import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  changeAdminPassword,
  disableAdminTwoFactor,
  enableAdminTwoFactor,
  getAdminActivityLog,
  getAdminPermissions,
  getAdminPreferences,
  getAdminProfile,
  getAdminSessions,
  getAdminTwoFactor,
  logoutAllAdminSessions,
  setupAdminTwoFactor,
  updateAdminPermissions,
  updateAdminPreferences,
  updateAdminProfile,
} from '../../services/api';
import { useAuth } from './AuthContext';

const AdminProfileContext = createContext(null);

const initial = {
  status: 'idle',
  error: '',
  profile: null,
  permissions: null,
  preferences: null,
  sessions: [],
  twoFactor: { enabled: false, configured: false, setup: null },
  activity: { items: [], filters: { from: '', to: '', action_type: '' }, loading: false, error: '' },
  saving: { profile: false, permissions: false, preferences: false, password: false, twoFactor: false, logoutAll: false },
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: '' };
    case 'LOAD_SUCCESS':
      return { ...state, status: 'ready', error: '', ...action.payload };
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error || 'Failed to load' };
    case 'SET_PROFILE':
      return { ...state, profile: action.profile };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.permissions };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.preferences };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.sessions || [] };
    case 'SET_2FA':
      return { ...state, twoFactor: { ...state.twoFactor, ...action.payload } };
    case 'SET_SAVING':
      return { ...state, saving: { ...state.saving, [action.key]: Boolean(action.value) } };
    case 'ACTIVITY_START':
      return { ...state, activity: { ...state.activity, loading: true, error: '' } };
    case 'ACTIVITY_SUCCESS':
      return { ...state, activity: { ...state.activity, loading: false, error: '', items: action.items || [] } };
    case 'ACTIVITY_ERROR':
      return { ...state, activity: { ...state.activity, loading: false, error: action.error || 'Failed to load' } };
    case 'ACTIVITY_FILTERS':
      return { ...state, activity: { ...state.activity, filters: { ...state.activity.filters, ...action.filters } } };
    default:
      return state;
  }
}

export const AdminProfileProvider = ({ children }) => {
  const auth = useAuth();
  const [state, dispatch] = useReducer(reducer, initial);

  const loadActivity = useCallback(
    async (filters = state.activity.filters) => {
      dispatch({ type: 'ACTIVITY_START' });
      try {
        const res = await getAdminActivityLog({
          from: filters.from || undefined,
          to: filters.to || undefined,
          action_type: filters.action_type || undefined,
          limit: 75,
        });
        dispatch({ type: 'ACTIVITY_SUCCESS', items: res.items });
      } catch (e) {
        dispatch({ type: 'ACTIVITY_ERROR', error: e?.message });
      }
    },
    [state.activity.filters]
  );

  const loadAll = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const [profile, permissions, preferences, sessionsRes, twoFactor] = await Promise.all([
        getAdminProfile(),
        getAdminPermissions(),
        getAdminPreferences(),
        getAdminSessions(),
        getAdminTwoFactor(),
      ]);

      dispatch({
        type: 'LOAD_SUCCESS',
        payload: {
          profile,
          permissions,
          preferences,
          sessions: sessionsRes.sessions || [],
          twoFactor: { enabled: Boolean(twoFactor.enabled), configured: Boolean(twoFactor.configured), setup: null },
        },
      });

      await loadActivity();
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message });
    }
  }, [loadActivity]);

  useEffect(() => {
    if (auth.status !== 'authenticated') return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status]);

  const refreshSessions = useCallback(async () => {
    const res = await getAdminSessions();
    dispatch({ type: 'SET_SESSIONS', sessions: res.sessions || [] });
  }, []);

  const saveProfile = useCallback(
    async (payload) => {
      dispatch({ type: 'SET_SAVING', key: 'profile', value: true });
      try {
        const updated = await updateAdminProfile(payload);
        dispatch({ type: 'SET_PROFILE', profile: updated });
        auth.setUser?.({ ...auth.user, name: updated.name, email: updated.email });
        return updated;
      } finally {
        dispatch({ type: 'SET_SAVING', key: 'profile', value: false });
      }
    },
    [auth]
  );

  const savePermissions = useCallback(async (payload) => {
    dispatch({ type: 'SET_SAVING', key: 'permissions', value: true });
    try {
      const updated = await updateAdminPermissions(payload);
      dispatch({ type: 'SET_PERMISSIONS', permissions: updated });
      return updated;
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'permissions', value: false });
    }
  }, []);

  const savePreferences = useCallback(async (payload) => {
    dispatch({ type: 'SET_SAVING', key: 'preferences', value: true });
    try {
      const updated = await updateAdminPreferences(payload);
      dispatch({ type: 'SET_PREFERENCES', preferences: updated });
      return updated;
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'preferences', value: false });
    }
  }, []);

  const doLogoutAll = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', key: 'logoutAll', value: true });
    try {
      await logoutAllAdminSessions();
      auth.logout();
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'logoutAll', value: false });
    }
  }, [auth]);

  const doChangePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      dispatch({ type: 'SET_SAVING', key: 'password', value: true });
      try {
        await changeAdminPassword({ currentPassword, newPassword });
        auth.logout();
        return { ok: true };
      } finally {
        dispatch({ type: 'SET_SAVING', key: 'password', value: false });
      }
    },
    [auth]
  );

  const startTwoFactorSetup = useCallback(async ({ currentPassword }) => {
    dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: true });
    try {
      const res = await setupAdminTwoFactor({ currentPassword });
      dispatch({ type: 'SET_2FA', payload: { setup: res, configured: true } });
      return res;
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: false });
    }
  }, []);

  const enableTwoFactor = useCallback(async ({ otp }) => {
    dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: true });
    try {
      await enableAdminTwoFactor({ otp });
      dispatch({ type: 'SET_2FA', payload: { enabled: true, setup: null } });
      return { enabled: true };
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: false });
    }
  }, []);

  const disableTwoFactor = useCallback(async ({ currentPassword }) => {
    dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: true });
    try {
      await disableAdminTwoFactor({ currentPassword });
      dispatch({ type: 'SET_2FA', payload: { enabled: false } });
      return { enabled: false };
    } finally {
      dispatch({ type: 'SET_SAVING', key: 'twoFactor', value: false });
    }
  }, []);

  const setActivityFilters = useCallback((filters) => {
    dispatch({ type: 'ACTIVITY_FILTERS', filters });
  }, []);

  const reloadActivity = useCallback(async () => {
    await loadActivity(state.activity.filters);
  }, [loadActivity, state.activity.filters]);

  const value = useMemo(
    () => ({
      ...state,
      loadAll,
      saveProfile,
      savePermissions,
      savePreferences,
      refreshSessions,
      doLogoutAll,
      doChangePassword,
      startTwoFactorSetup,
      enableTwoFactor,
      disableTwoFactor,
      setActivityFilters,
      reloadActivity,
    }),
    [
      state,
      loadAll,
      saveProfile,
      savePermissions,
      savePreferences,
      refreshSessions,
      doLogoutAll,
      doChangePassword,
      startTwoFactorSetup,
      enableTwoFactor,
      disableTwoFactor,
      setActivityFilters,
      reloadActivity,
    ]
  );

  return <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>;
};

export const useAdminProfile = () => {
  const ctx = useContext(AdminProfileContext);
  if (!ctx) throw new Error('useAdminProfile must be used within AdminProfileProvider');
  return ctx;
};
