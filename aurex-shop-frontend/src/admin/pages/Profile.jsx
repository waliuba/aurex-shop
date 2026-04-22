import { useMemo, useRef, useState } from 'react';
import { useAdminProfile } from '../context/AdminProfileContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import sizes from '../../universal components/sizes';
import { textStrings } from '../../constants/textStrings';
import { styleStrings } from '../../constants/styleStrings';
import ProfileCard from '../components/profile/ProfileCard';
import PermissionToggle from '../components/profile/PermissionToggle';
import ActivityLogTable from '../components/profile/ActivityLogTable';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const isUsername = (v) => /^[a-z0-9_]{3,30}$/.test(String(v || '').trim().toLowerCase());

const Profile = () => {
  const admin = useAdminProfile();
  const fileRef = useRef(null);

  const profile = admin.profile;
  const canManagePermissions = profile?.adminRole === 'super_admin';

  const [editIdentity, setEditIdentity] = useState(false);
  const [identity, setIdentity] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    location: '',
    bio: '',
    avatar: '',
  });
  const [identityError, setIdentityError] = useState('');

  const [editPermissions, setEditPermissions] = useState(false);
  const [permDraft, setPermDraft] = useState(null);
  const [permError, setPermError] = useState('');

  const [prefEdit, setPrefEdit] = useState(false);
  const [prefDraft, setPrefDraft] = useState(null);
  const [prefError, setPrefError] = useState('');

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwOk, setPwOk] = useState('');

  const [twoFactor, setTwoFactor] = useState({ currentPassword: '', otp: '' });
  const [twoFactorError, setTwoFactorError] = useState('');

  const [activityLocalFilters, setActivityLocalFilters] = useState(admin.activity.filters);

  const bootIdentity = () => {
    setIdentity({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      username: profile?.username || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      avatar: profile?.avatar || '',
    });
  };

  const bootPerms = () => setPermDraft({ ...(admin.permissions || {}) });
  const bootPrefs = () => setPrefDraft({ ...(admin.preferences || {}) });

  const loginHistory = useMemo(
    () => (admin.activity.items || []).filter((i) => i.action_type === 'auth.login').slice(0, 8),
    [admin.activity.items]
  );

  const onPickAvatar = () => fileRef.current?.click?.();

  const onAvatarFile = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setIdentityError(textStrings.admin.profile.errors.avatarType);
      return;
    }
    if (file.size > 200_000) {
      setIdentityError(textStrings.admin.profile.errors.avatarTooLarge);
      return;
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(textStrings.admin.profile.errors.avatarReadFailed));
      reader.readAsDataURL(file);
    });

    setIdentity((p) => ({ ...p, avatar: dataUrl }));
    setIdentityError('');
    if (!editIdentity) setEditIdentity(true);
  };

  if (admin.status === 'loading' || admin.status === 'idle') {
    return (
      <Card title={textStrings.admin.profile.title}>
        <Spinner label={textStrings.admin.profile.loading} />
      </Card>
    );
  }

  if (admin.status === 'error') {
    return (
      <Card title={textStrings.admin.profile.title}>
        <div className="uiErrorText">{admin.error || textStrings.admin.common.failedToLoad}</div>
        <div style={{ marginTop: sizes.admin.gaps.lg }}>
          <Button variant="secondary" onClick={admin.loadAll}>
            {textStrings.admin.actions.retry}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="adminGrid" style={{ gap: sizes.admin.gaps.xl }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onAvatarFile(e.target.files?.[0])}
      />

      <ProfileCard
        profile={profile}
        onEdit={() => {
          bootIdentity();
          setIdentityError('');
          setEditIdentity(true);
        }}
        onAvatarPick={onPickAvatar}
        avatarPickingDisabled={admin.saving.profile}
      />

      <div className="adminGrid adminGrid--2" style={{ alignItems: 'start' }}>
        <Card
          title={textStrings.admin.profile.identity.title}
          action={
            editIdentity ? (
              <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { flexWrap: 'wrap' })}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditIdentity(false);
                    setIdentityError('');
                    bootIdentity();
                  }}
                  disabled={admin.saving.profile}
                >
                  {textStrings.admin.actions.cancel}
                </Button>
                <Button
                  onClick={async () => {
                    setIdentityError('');
                    if (!identity.name.trim()) return setIdentityError(textStrings.admin.profile.errors.nameRequired);
                    if (!isEmail(identity.email)) return setIdentityError(textStrings.admin.profile.errors.emailInvalid);
                    if (identity.username && !isUsername(identity.username)) {
                      return setIdentityError(textStrings.admin.profile.errors.usernameInvalid);
                    }
                    try {
                      await admin.saveProfile({
                        name: identity.name,
                        email: identity.email,
                        phone: identity.phone,
                        username: identity.username,
                        location: identity.location,
                        bio: identity.bio,
                        avatar: identity.avatar,
                      });
                      setEditIdentity(false);
                    } catch (e) {
                      setIdentityError(e?.message || textStrings.admin.profile.errors.failedToSave);
                    }
                  }}
                  disabled={admin.saving.profile}
                >
                  {admin.saving.profile ? textStrings.admin.common.saving : textStrings.admin.actions.save}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  bootIdentity();
                  setIdentityError('');
                  setEditIdentity(true);
                }}
              >
                {textStrings.admin.profile.actions.edit}
              </Button>
            )
          }
        >
          <div className="adminFormGrid">
            <Input
              label={textStrings.admin.profile.identity.fields.name}
              value={editIdentity ? identity.name : profile?.name || ''}
              onChange={(e) => setIdentity((p) => ({ ...p, name: e.target.value }))}
              disabled={!editIdentity}
            />
            <Input
              label={textStrings.admin.profile.identity.fields.email}
              value={editIdentity ? identity.email : profile?.email || ''}
              onChange={(e) => setIdentity((p) => ({ ...p, email: e.target.value }))}
              disabled={!editIdentity}
            />
            <Input
              label={textStrings.admin.profile.identity.fields.phone}
              value={editIdentity ? identity.phone : profile?.phone || ''}
              onChange={(e) => setIdentity((p) => ({ ...p, phone: e.target.value }))}
              disabled={!editIdentity}
              placeholder={textStrings.admin.profile.identity.placeholders.phone}
            />
            <Input
              label={textStrings.admin.profile.identity.fields.location}
              value={editIdentity ? identity.location : profile?.location || ''}
              onChange={(e) => setIdentity((p) => ({ ...p, location: e.target.value }))}
              disabled={!editIdentity}
              placeholder={textStrings.admin.profile.identity.placeholders.location}
            />

            <Input
              label={textStrings.admin.profile.identity.fields.username}
              value={editIdentity ? identity.username : profile?.username || ''}
              onChange={(e) => setIdentity((p) => ({ ...p, username: e.target.value }))}
              disabled={!editIdentity}
              placeholder={textStrings.admin.profile.identity.placeholders.username}
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                as="textarea"
                rows={4}
                label={textStrings.admin.profile.identity.fields.bio}
                value={editIdentity ? identity.bio : profile?.bio || ''}
                onChange={(e) => setIdentity((p) => ({ ...p, bio: e.target.value }))}
                disabled={!editIdentity}
                placeholder={textStrings.admin.profile.identity.placeholders.bio}
              />
            </div>
          </div>
          {identityError ? <div className="uiErrorText" style={{ marginTop: sizes.admin.gaps.lg }}>{identityError}</div> : null}
        </Card>

        <Card
          title={textStrings.admin.profile.permissions.title}
          action={
            editPermissions ? (
              <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { flexWrap: 'wrap' })}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditPermissions(false);
                    setPermError('');
                    bootPerms();
                  }}
                  disabled={admin.saving.permissions}
                >
                  {textStrings.admin.actions.cancel}
                </Button>
                <Button
                  onClick={async () => {
                    setPermError('');
                    try {
                      await admin.savePermissions(permDraft);
                      setEditPermissions(false);
                    } catch (e) {
                      setPermError(e?.message || textStrings.admin.profile.errors.failedToSave);
                    }
                  }}
                  disabled={admin.saving.permissions}
                >
                  {admin.saving.permissions ? textStrings.admin.common.saving : textStrings.admin.actions.save}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  bootPerms();
                  setPermError('');
                  setEditPermissions(true);
                }}
                disabled={!canManagePermissions}
              >
                {textStrings.admin.profile.actions.edit}
              </Button>
            )
          }
        >
          <div style={styleStrings.layout.grid(sizes.admin.gaps.lg)}>
            <div
              style={styleStrings.layout.flexRow(sizes.admin.gaps.md, {
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              })}
            >
              <div>
                <div style={{ fontWeight: 900 }}>{textStrings.admin.profile.permissions.currentRole}</div>
                <div className="uiHelpText">{textStrings.admin.profile.roles[profile?.adminRole || 'staff']}</div>
              </div>
              <Badge tone={canManagePermissions ? 'ok' : 'default'}>
                {canManagePermissions ? textStrings.admin.profile.permissions.manageEnabled : textStrings.admin.profile.permissions.manageDisabled}
              </Badge>
            </div>

            {admin.permissions ? (
              <div style={styleStrings.layout.grid(sizes.admin.gaps.md)}>
                <PermissionToggle
                  label={textStrings.admin.profile.permissions.flags.can_read}
                  description={textStrings.admin.profile.permissions.descriptions.can_read}
                  checked={Boolean((editPermissions ? permDraft : admin.permissions)?.can_read)}
                  disabled={!editPermissions || !canManagePermissions}
                  onChange={(v) => setPermDraft((p) => ({ ...p, can_read: v }))}
                />
                <PermissionToggle
                  label={textStrings.admin.profile.permissions.flags.can_write}
                  description={textStrings.admin.profile.permissions.descriptions.can_write}
                  checked={Boolean((editPermissions ? permDraft : admin.permissions)?.can_write)}
                  disabled={!editPermissions || !canManagePermissions}
                  onChange={(v) => setPermDraft((p) => ({ ...p, can_write: v }))}
                />
                <PermissionToggle
                  label={textStrings.admin.profile.permissions.flags.can_delete}
                  description={textStrings.admin.profile.permissions.descriptions.can_delete}
                  checked={Boolean((editPermissions ? permDraft : admin.permissions)?.can_delete)}
                  disabled={!editPermissions || !canManagePermissions}
                  onChange={(v) => setPermDraft((p) => ({ ...p, can_delete: v }))}
                />
                <PermissionToggle
                  label={textStrings.admin.profile.permissions.flags.can_manage_users}
                  description={textStrings.admin.profile.permissions.descriptions.can_manage_users}
                  checked={Boolean((editPermissions ? permDraft : admin.permissions)?.can_manage_users)}
                  disabled={!editPermissions || !canManagePermissions}
                  onChange={(v) => setPermDraft((p) => ({ ...p, can_manage_users: v }))}
                />
                <PermissionToggle
                  label={textStrings.admin.profile.permissions.flags.can_manage_system}
                  description={textStrings.admin.profile.permissions.descriptions.can_manage_system}
                  checked={Boolean((editPermissions ? permDraft : admin.permissions)?.can_manage_system)}
                  disabled={!editPermissions || !canManagePermissions}
                  onChange={(v) => setPermDraft((p) => ({ ...p, can_manage_system: v }))}
                />
              </div>
            ) : (
              <div className="uiHelpText">{textStrings.admin.profile.permissions.noPermissions}</div>
            )}

            {permError ? <div className="uiErrorText">{permError}</div> : null}
            {!canManagePermissions ? (
              <div className="uiHelpText">{textStrings.admin.profile.permissions.requestRoleChangeHint}</div>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="adminGrid adminGrid--2" style={{ alignItems: 'start' }}>
        <Card title={textStrings.admin.profile.security.title}>
          <div style={styleStrings.layout.grid(sizes.admin.gaps.xl)}>
            <div className="uiCard" style={{ padding: 12 }}>
              <div style={{ fontWeight: 900 }}>{textStrings.admin.profile.security.changePasswordTitle}</div>
              <div className="uiHelpText">{textStrings.admin.profile.security.changePasswordHint}</div>

              <div className="adminFormGrid" style={{ marginTop: sizes.admin.gaps.lg }}>
                <Input
                  label={textStrings.admin.profile.security.fields.currentPassword}
                  type="password"
                  value={pw.currentPassword}
                  onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                  autoComplete="current-password"
                />
                <Input
                  label={textStrings.admin.profile.security.fields.newPassword}
                  type="password"
                  value={pw.newPassword}
                  onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                  autoComplete="new-password"
                />
                <Input
                  label={textStrings.admin.profile.security.fields.confirmPassword}
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>

              {pwError ? <div className="uiErrorText" style={{ marginTop: sizes.admin.gaps.md }}>{pwError}</div> : null}
              {pwOk ? <div className="uiHelpText" style={{ marginTop: sizes.admin.gaps.md }}>{pwOk}</div> : null}

              <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { marginTop: sizes.admin.gaps.lg, flexWrap: 'wrap' })}>
                <Button
                  onClick={async () => {
                    setPwError('');
                    setPwOk('');
                    if (!pw.currentPassword || !pw.newPassword) return setPwError(textStrings.admin.profile.errors.passwordRequired);
                    if (pw.newPassword.length < 8) return setPwError(textStrings.admin.profile.errors.passwordWeak);
                    if (pw.newPassword !== pw.confirm) return setPwError(textStrings.admin.profile.errors.passwordMismatch);
                    try {
                      await admin.doChangePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
                      setPwOk(textStrings.admin.profile.security.passwordChanged);
                    } catch (e) {
                      setPwError(e?.message || textStrings.admin.profile.errors.failedToSave);
                    }
                  }}
                  disabled={admin.saving.password}
                >
                  {admin.saving.password ? textStrings.admin.common.saving : textStrings.admin.profile.security.actions.changePassword}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPw({ currentPassword: '', newPassword: '', confirm: '' });
                    setPwError('');
                    setPwOk('');
                  }}
                  disabled={admin.saving.password}
                >
                  {textStrings.admin.actions.clear}
                </Button>
              </div>
            </div>

            <div className="uiCard" style={{ padding: 12 }}>
              <div
                style={styleStrings.layout.flexRow(sizes.admin.gaps.md, {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                })}
              >
                <div>
                  <div style={{ fontWeight: 900 }}>{textStrings.admin.profile.security.twoFactorTitle}</div>
                  <div className="uiHelpText">
                    {admin.twoFactor.enabled ? textStrings.admin.profile.security.twoFactorEnabled : textStrings.admin.profile.security.twoFactorDisabled}
                  </div>
                </div>
                <Badge tone={admin.twoFactor.enabled ? 'ok' : 'warn'}>
                  {admin.twoFactor.enabled ? textStrings.admin.profile.security.statusOn : textStrings.admin.profile.security.statusOff}
                </Badge>
              </div>

              {twoFactorError ? <div className="uiErrorText" style={{ marginTop: sizes.admin.gaps.md }}>{twoFactorError}</div> : null}

              {!admin.twoFactor.enabled ? (
                <div style={styleStrings.layout.grid(sizes.admin.gaps.md, { marginTop: sizes.admin.gaps.lg })}>
                  <Input
                    label={textStrings.admin.profile.security.fields.currentPassword}
                    type="password"
                    value={twoFactor.currentPassword}
                    onChange={(e) => setTwoFactor((p) => ({ ...p, currentPassword: e.target.value }))}
                  />

                  {admin.twoFactor.setup ? (
                    <div className="uiCard" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 900 }}>{textStrings.admin.profile.security.twoFactorSetupTitle}</div>
                      <div className="uiHelpText">{textStrings.admin.profile.security.twoFactorSetupHint}</div>

                      <div style={styleStrings.layout.grid(sizes.admin.gaps.md, { marginTop: sizes.admin.gaps.md })}>
                        <div className="uiHelpText">
                          {textStrings.admin.profile.security.manualKeyLabel}{' '}
                          <strong style={{ color: 'inherit' }}>{admin.twoFactor.setup.secret_base32}</strong>
                        </div>
                        <div className="uiHelpText">
                          {textStrings.admin.profile.security.otpauthLabel}{' '}
                          <code style={{ fontSize: 12 }}>{admin.twoFactor.setup.otpauth_url}</code>
                        </div>
                        <Input
                          label={textStrings.admin.profile.security.fields.twoFactorCode}
                          value={twoFactor.otp}
                          onChange={(e) => setTwoFactor((p) => ({ ...p, otp: e.target.value }))}
                          inputMode="numeric"
                          placeholder={textStrings.admin.profile.security.placeholders.twoFactorCode}
                        />
                        <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { flexWrap: 'wrap' })}>
                          <Button
                            onClick={async () => {
                              setTwoFactorError('');
                              try {
                                await admin.enableTwoFactor({ otp: twoFactor.otp });
                                setTwoFactor({ currentPassword: '', otp: '' });
                              } catch (e) {
                                setTwoFactorError(e?.message || textStrings.admin.profile.errors.failedToSave);
                              }
                            }}
                            disabled={admin.saving.twoFactor}
                          >
                            {admin.saving.twoFactor ? textStrings.admin.common.saving : textStrings.admin.profile.security.actions.enable2fa}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setTwoFactor((p) => ({ ...p, otp: '' }));
                              setTwoFactorError('');
                            }}
                            disabled={admin.saving.twoFactor}
                          >
                            {textStrings.admin.actions.clear}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={async () => {
                        setTwoFactorError('');
                        try {
                          await admin.startTwoFactorSetup({ currentPassword: twoFactor.currentPassword });
                        } catch (e) {
                          setTwoFactorError(e?.message || textStrings.admin.profile.errors.failedToSave);
                        }
                      }}
                      disabled={admin.saving.twoFactor}
                    >
                      {admin.saving.twoFactor ? textStrings.admin.common.saving : textStrings.admin.profile.security.actions.setup2fa}
                    </Button>
                  )}
                </div>
              ) : (
                <div style={styleStrings.layout.grid(sizes.admin.gaps.md, { marginTop: sizes.admin.gaps.lg })}>
                  <Input
                    label={textStrings.admin.profile.security.fields.currentPassword}
                    type="password"
                    value={twoFactor.currentPassword}
                    onChange={(e) => setTwoFactor((p) => ({ ...p, currentPassword: e.target.value }))}
                  />
                  <Button
                    variant="danger"
                    onClick={async () => {
                      setTwoFactorError('');
                      try {
                        await admin.disableTwoFactor({ currentPassword: twoFactor.currentPassword });
                        setTwoFactor({ currentPassword: '', otp: '' });
                      } catch (e) {
                        setTwoFactorError(e?.message || textStrings.admin.profile.errors.failedToSave);
                      }
                    }}
                    disabled={admin.saving.twoFactor}
                  >
                    {admin.saving.twoFactor ? textStrings.admin.common.saving : textStrings.admin.profile.security.actions.disable2fa}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card
          title={textStrings.admin.profile.sessions.title}
          action={
            <Button variant="danger" onClick={admin.doLogoutAll} disabled={admin.saving.logoutAll}>
              {admin.saving.logoutAll ? textStrings.admin.common.saving : textStrings.admin.profile.sessions.logoutAll}
            </Button>
          }
        >
          <div style={styleStrings.layout.grid(sizes.admin.gaps.md)}>
            {(admin.sessions || []).length === 0 ? (
              <div className="uiHelpText">{textStrings.admin.profile.sessions.empty}</div>
            ) : (
              admin.sessions.map((s) => (
                <div key={s.id} className="adminSessionRow">
                  <div style={{ minWidth: 0 }}>
                    <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { alignItems: 'center', flexWrap: 'wrap' })}>
                      <div style={{ fontWeight: 800 }}>{s.device_info || textStrings.admin.profile.sessions.unknownDevice}</div>
                      {s.is_current ? <Badge tone="ok">{textStrings.admin.profile.sessions.current}</Badge> : null}
                    </div>
                    <div className="uiHelpText">
                      {textStrings.admin.profile.sessions.ipLabel} <strong style={{ color: 'inherit' }}>{s.ip_address || '-'}</strong>{' '}
                      <span style={{ margin: '0 8px', opacity: 0.65 }}>•</span>
                      {textStrings.admin.profile.sessions.lastActiveLabel}{' '}
                      <strong style={{ color: 'inherit' }}>{String(s.last_active || '').slice(0, 16).replace('T', ' ')}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="uiHelpText">{textStrings.admin.profile.sessions.logoutAllHint}</div>
          </div>
        </Card>
      </div>

      <div className="adminGrid adminGrid--2" style={{ alignItems: 'start' }}>
        <Card title={textStrings.admin.profile.activity.title}>
          <div style={styleStrings.layout.grid(sizes.admin.gaps.lg)}>
            <div className="adminFormGrid adminFormGrid--tight">
              <Input
                label={textStrings.admin.profile.activity.filters.from}
                type="date"
                value={activityLocalFilters.from || ''}
                onChange={(e) => setActivityLocalFilters((p) => ({ ...p, from: e.target.value }))}
              />
              <Input
                label={textStrings.admin.profile.activity.filters.to}
                type="date"
                value={activityLocalFilters.to || ''}
                onChange={(e) => setActivityLocalFilters((p) => ({ ...p, to: e.target.value }))}
              />
              <Input
                label={textStrings.admin.profile.activity.filters.actionType}
                value={activityLocalFilters.action_type || ''}
                onChange={(e) => setActivityLocalFilters((p) => ({ ...p, action_type: e.target.value }))}
                placeholder={textStrings.admin.profile.activity.filters.actionTypePlaceholder}
              />
            </div>

            <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { flexWrap: 'wrap' })}>
              <Button
                variant="secondary"
                onClick={async () => {
                  admin.setActivityFilters(activityLocalFilters);
                  await admin.reloadActivity();
                }}
                disabled={admin.activity.loading}
              >
                {admin.activity.loading ? textStrings.admin.profile.loading : textStrings.admin.profile.activity.actions.apply}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const cleared = { from: '', to: '', action_type: '' };
                  setActivityLocalFilters(cleared);
                  admin.setActivityFilters(cleared);
                  admin.reloadActivity();
                }}
                disabled={admin.activity.loading}
              >
                {textStrings.admin.profile.activity.actions.clear}
              </Button>
            </div>

            {admin.activity.error ? <div className="uiErrorText">{admin.activity.error}</div> : null}
            <ActivityLogTable items={admin.activity.items} />
          </div>
        </Card>

        <Card
          title={textStrings.admin.profile.preferences.title}
          action={
            prefEdit ? (
              <div style={styleStrings.layout.flexRow(sizes.admin.gaps.md, { flexWrap: 'wrap' })}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPrefEdit(false);
                    setPrefError('');
                    bootPrefs();
                  }}
                  disabled={admin.saving.preferences}
                >
                  {textStrings.admin.actions.cancel}
                </Button>
                <Button
                  onClick={async () => {
                    setPrefError('');
                    try {
                      await admin.savePreferences(prefDraft);
                      setPrefEdit(false);
                    } catch (e) {
                      setPrefError(e?.message || textStrings.admin.profile.errors.failedToSave);
                    }
                  }}
                  disabled={admin.saving.preferences}
                >
                  {admin.saving.preferences ? textStrings.admin.common.saving : textStrings.admin.actions.save}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  bootPrefs();
                  setPrefError('');
                  setPrefEdit(true);
                }}
              >
                {textStrings.admin.profile.actions.edit}
              </Button>
            )
          }
        >
          <div style={styleStrings.layout.grid(sizes.admin.gaps.lg)}>
            <div className="adminFormGrid">
              <Input
                as="select"
                label={textStrings.admin.profile.preferences.fields.theme}
                value={(prefEdit ? prefDraft : admin.preferences)?.theme || 'dark'}
                onChange={(e) => setPrefDraft((p) => ({ ...p, theme: e.target.value }))}
                disabled={!prefEdit}
              >
                <option value="dark">{textStrings.admin.profile.preferences.options.themeDark}</option>
                <option value="light">{textStrings.admin.profile.preferences.options.themeLight}</option>
              </Input>

              <Input
                as="select"
                label={textStrings.admin.profile.preferences.fields.language}
                value={(prefEdit ? prefDraft : admin.preferences)?.language || 'en'}
                onChange={(e) => setPrefDraft((p) => ({ ...p, language: e.target.value }))}
                disabled={!prefEdit}
              >
                <option value="en">{textStrings.admin.profile.preferences.options.langEn}</option>
                <option value="sw">{textStrings.admin.profile.preferences.options.langSw}</option>
              </Input>

              <Input
                as="select"
                label={textStrings.admin.profile.preferences.fields.dashboardLayout}
                value={(prefEdit ? prefDraft : admin.preferences)?.dashboard_layout || 'default'}
                onChange={(e) => setPrefDraft((p) => ({ ...p, dashboard_layout: e.target.value }))}
                disabled={!prefEdit}
              >
                <option value="default">{textStrings.admin.profile.preferences.options.layoutDefault}</option>
                <option value="compact">{textStrings.admin.profile.preferences.options.layoutCompact}</option>
                <option value="comfortable">{textStrings.admin.profile.preferences.options.layoutComfortable}</option>
              </Input>
            </div>

            <PermissionToggle
              label={textStrings.admin.profile.preferences.fields.notifications}
              description={textStrings.admin.profile.preferences.hints.notifications}
              checked={Boolean((prefEdit ? prefDraft : admin.preferences)?.notifications_enabled)}
              disabled={!prefEdit}
              onChange={(v) => setPrefDraft((p) => ({ ...p, notifications_enabled: v }))}
            />

            {prefError ? <div className="uiErrorText">{prefError}</div> : null}
          </div>
        </Card>
      </div>

      <Card title={textStrings.admin.profile.security.loginHistoryTitle}>
        {(loginHistory || []).length === 0 ? (
          <div className="uiHelpText">{textStrings.admin.profile.security.loginHistoryEmpty}</div>
        ) : (
          <ActivityLogTable items={loginHistory} />
        )}
      </Card>
    </div>
  );
};

export default Profile;
