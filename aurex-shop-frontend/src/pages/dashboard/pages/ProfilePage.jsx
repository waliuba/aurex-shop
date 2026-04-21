import React, { useEffect, useRef, useState } from 'react';
import Skeleton from '../components/Skeleton';
import { useToasts } from '../../../components/ui/ToastProvider';
import { useSession } from '../../../context/SessionContext';
import { getMe, updateMyProfile, changeMyPassword } from '../../../services/api';
import { textStrings } from '../../../constants/textStrings';

const buildProfileForm = (user = {}) => ({
  name: user?.name || '',
  email: user?.email || '',
  username: user?.username || '',
  phone: user?.phone || '',
  location: user?.location || '',
  bio: user?.bio || '',
  avatar: user?.avatar || '',
});

const initialsFor = (user) => {
  const name = String(user?.name || '').trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
    return `${first}${last}`.toUpperCase() || 'AX';
  }

  const email = String(user?.email || '').trim();
  if (email) return email.slice(0, 2).toUpperCase();
  return 'AX';
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(textStrings.userDashboard.profile.errors.avatarReadFailed));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(textStrings.userDashboard.profile.errors.avatarReadFailed));
    img.src = src;
  });

const resizeImageToDataUrl = async (file) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxSize = 320;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(textStrings.userDashboard.profile.errors.avatarReadFailed);
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const output = canvas.toDataURL('image/jpeg', 0.82);

  if (output.length > 340000) {
    throw new Error(textStrings.userDashboard.profile.errors.avatarTooLarge);
  }

  return output;
};

const ProfilePage = () => {
  const toasts = useToasts();
  const session = useSession();
  const fileInputRef = useRef(null);

  const [state, setState] = useState({ status: 'loading', error: '', user: null });
  const [profileForm, setProfileForm] = useState(buildProfileForm());
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMe();
        if (!mounted) return;
        setState({ status: 'ready', error: '', user: data.user });
        setProfileForm(buildProfileForm(data.user));
      } catch (error) {
        if (!mounted) return;
        setState({ status: 'error', error: error?.message || textStrings.userDashboard.profile.errors.failedToLoad, user: null });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onPickAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!String(file.type || '').startsWith('image/')) {
        throw new Error(textStrings.userDashboard.profile.errors.invalidAvatarType);
      }

      const resizedAvatar = await resizeImageToDataUrl(file);
      setProfileForm((prev) => ({ ...prev, avatar: resizedAvatar }));
    } catch (error) {
      toasts.push({
        type: 'error',
        title: textStrings.userDashboard.profile.toasts.profileSaveFailedTitle,
        message: error?.message || textStrings.userDashboard.profile.toasts.tryAgain,
      });
      event.target.value = '';
    }
  };

  const onRemoveAvatar = () => {
    setProfileForm((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    toasts.push({
      type: 'success',
      title: textStrings.userDashboard.profile.toasts.avatarRemovedTitle,
      message: textStrings.userDashboard.profile.toasts.avatarRemovedMessage,
    });
  };

  const onSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updated = await updateMyProfile({
        name: profileForm.name,
        email: profileForm.email,
        username: profileForm.username,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
      });

      setState({ status: 'ready', error: '', user: updated });
      setProfileForm(buildProfileForm(updated));
      session.setUser(updated);

      toasts.push({
        type: 'success',
        title: textStrings.userDashboard.profile.toasts.profileSavedTitle,
        message: textStrings.userDashboard.profile.toasts.profileSavedMessage,
      });
    } catch (error) {
      toasts.push({
        type: 'error',
        title: textStrings.userDashboard.profile.toasts.profileSaveFailedTitle,
        message: error?.message || textStrings.userDashboard.profile.toasts.tryAgain,
      });
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (event) => {
    event.preventDefault();
    setChanging(true);
    try {
      if (pwForm.newPassword.trim().length < textStrings.userDashboard.profile.password.minLength) {
        throw new Error(textStrings.userDashboard.profile.password.errors.tooShort(textStrings.userDashboard.profile.password.minLength));
      }
      await changeMyPassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '' });
      toasts.push({
        type: 'success',
        title: textStrings.userDashboard.profile.toasts.passwordChangedTitle,
        message: textStrings.userDashboard.profile.toasts.passwordChangedMessage,
      });
    } catch (error) {
      toasts.push({
        type: 'error',
        title: textStrings.userDashboard.profile.toasts.passwordChangeFailedTitle,
        message: error?.message || textStrings.userDashboard.profile.toasts.tryAgain,
      });
    } finally {
      setChanging(false);
    }
  };

  if (state.status === 'loading') {
    return (
      <div className="tw-grid tw-gap-3">
        <Skeleton className="tw-h-28" />
        <Skeleton className="tw-h-56" />
        <Skeleton className="tw-h-56" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-6">
        <div className="tw-font-semibold">{textStrings.userDashboard.profile.errors.couldNotLoadTitle}</div>
        <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{state.error}</div>
      </div>
    );
  }

  const user = state.user || {};
  const role = String(user?.role || 'user');
  const avatar = profileForm.avatar || '';
  const initials = initialsFor(profileForm);

  return (
    <div className="tw-grid tw-gap-4">
      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-flex tw-items-end tw-justify-between tw-gap-3 tw-flex-wrap">
          <div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.header.kicker}</div>
            <div className="tw-text-lg tw-font-semibold">{textStrings.userDashboard.profile.header.title}</div>
          </div>
          {role === 'admin' ? (
            <a className="tw-text-sm tw-underline" href="#/admin">
              {textStrings.userDashboard.profile.header.openAdminDashboard}
            </a>
          ) : null}
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold">{textStrings.userDashboard.profile.avatar.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.avatar.description}</div>

        <div className="tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={textStrings.userDashboard.profile.avatar.previewAlt}
              className="tw-h-24 tw-w-24 tw-rounded-full tw-object-cover tw-border tw-border-slate-200 dark:tw-border-slate-800"
            />
          ) : (
            <div className="tw-h-24 tw-w-24 tw-rounded-full tw-bg-brand-secondary tw-text-white tw-grid tw-place-items-center tw-text-2xl tw-font-semibold">
              {initials}
            </div>
          )}

          <div className="tw-grid tw-gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="tw-hidden" onChange={onPickAvatar} />
            <div className="tw-flex tw-flex-wrap tw-gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900"
              >
                {avatar ? textStrings.userDashboard.profile.avatar.change : textStrings.userDashboard.profile.avatar.choose}
              </button>
              {avatar ? (
                <button
                  type="button"
                  onClick={onRemoveAvatar}
                  className="tw-rounded-2xl tw-border tw-border-rose-200 tw-text-rose-600 dark:tw-border-rose-900/60 dark:tw-text-rose-300 tw-px-4 tw-py-2 tw-text-sm hover:tw-bg-rose-50 dark:hover:tw-bg-rose-950/40"
                >
                  {textStrings.userDashboard.profile.avatar.remove}
                </button>
              ) : null}
            </div>
            <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{textStrings.userDashboard.profile.avatar.hint}</div>
          </div>
        </div>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold">{textStrings.userDashboard.profile.basic.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.description}</div>

        <form className="tw-mt-4 tw-grid tw-gap-4" onSubmit={onSaveProfile}>
          <div className="tw-grid tw-gap-x-8 tw-gap-y-5 md:tw-grid-cols-2">
            <div className="md:tw-max-w-sm">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.name}</label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                maxLength={50}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
            <div className="md:tw-max-w-sm">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.email}</label>
              <input
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                maxLength={80}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
            <div className="md:tw-max-w-sm">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.username}</label>
              <input
                value={profileForm.username}
                onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))}
                placeholder={textStrings.userDashboard.profile.basic.placeholders.username}
                maxLength={30}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
            <div className="md:tw-max-w-sm">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.phone}</label>
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder={textStrings.userDashboard.profile.basic.placeholders.phone}
                maxLength={20}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
            <div className="md:tw-col-span-2 md:tw-max-w-xl">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.location}</label>
              <input
                value={profileForm.location}
                onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))}
                placeholder={textStrings.userDashboard.profile.basic.placeholders.location}
                maxLength={80}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
            <div className="md:tw-col-span-2 md:tw-max-w-xl">
              <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.basic.fields.bio}</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder={textStrings.userDashboard.profile.basic.placeholders.bio}
                rows={4}
                maxLength={220}
                className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
              />
            </div>
          </div>

          <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap tw-pt-2">
            <div className="tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">
              {textStrings.userDashboard.profile.basic.roleLabel} <strong>{role}</strong>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="tw-rounded-2xl tw-bg-brand-secondary tw-text-white tw-px-4 tw-py-2 tw-text-sm disabled:tw-opacity-60"
            >
              {saving ? textStrings.userDashboard.profile.basic.saving : textStrings.userDashboard.profile.basic.save}
            </button>
          </div>
        </form>
      </div>

      <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
        <div className="tw-font-semibold">{textStrings.userDashboard.profile.security.title}</div>
        <div className="tw-mt-1 tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.security.description}</div>

        <form className="tw-mt-4 tw-grid tw-gap-4 md:tw-grid-cols-2" onSubmit={onChangePassword}>
          <div className="md:tw-max-w-sm">
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">
              {textStrings.userDashboard.profile.security.fields.currentPassword}
            </label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
              maxLength={64}
              className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
            />
          </div>
          <div className="md:tw-max-w-sm">
            <label className="tw-text-xs tw-text-slate-600 dark:tw-text-slate-300">{textStrings.userDashboard.profile.security.fields.newPassword}</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
              maxLength={64}
              className="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-px-3 tw-py-2 tw-text-sm"
            />
          </div>
          <div className="md:tw-col-span-2 tw-flex tw-justify-end tw-pt-2">
            <button
              type="submit"
              disabled={changing}
              className="tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-px-4 tw-py-2 tw-text-sm hover:tw-bg-slate-50 dark:hover:tw-bg-slate-900 disabled:tw-opacity-60"
            >
              {changing ? textStrings.userDashboard.profile.security.updating : textStrings.userDashboard.profile.security.changePassword}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
