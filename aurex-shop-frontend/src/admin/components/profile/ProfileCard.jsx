import Badge from '../ui/Badge';
import Button from '../ui/Button';
import sizes from '../../../universal components/sizes';
import colorstring from '../../../universal components/colorstrings';
import { textStrings } from '../../../constants/textStrings';

const RoleBadge = ({ adminRole }) => {
  const role = adminRole || 'staff';
  const tone = role === 'super_admin' ? 'ok' : role === 'moderator' ? 'warn' : 'default';
  return <Badge tone={tone}>{textStrings.admin.profile.roles[role] || role}</Badge>;
};

const ProfileCard = ({ profile, onEdit, onAvatarPick, avatarPickingDisabled }) => {
  const avatar = profile?.avatar || '';
  const fallback = (profile?.name || textStrings.admin.topbar.defaultUserName || 'Admin')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <div className="uiCard">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: sizes.admin.gaps.lg, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sizes.admin.gaps.lg, minWidth: 0 }}>
          <div className="adminAvatar">
            {avatar ? <img src={avatar} alt={textStrings.admin.profile.avatarAlt} /> : <span>{fallback}</span>}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sizes.admin.gaps.md, flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{profile?.name || textStrings.admin.profile.unknownAdmin}</div>
              <RoleBadge adminRole={profile?.adminRole} />
            </div>

            <div className="uiHelpText" style={{ marginTop: 2 }}>
              <span style={{ color: colorstring.admin.mutedStrong }}>
                {textStrings.admin.profile.usernameLabel}{' '}
              </span>
              <strong style={{ color: 'inherit' }}>{profile?.username || textStrings.admin.profile.noUsername}</strong>
              <span style={{ margin: '0 8px', opacity: 0.65 }}>•</span>
              <span style={{ color: colorstring.admin.mutedStrong }}>
                {textStrings.admin.profile.adminIdLabel}{' '}
              </span>
              <strong style={{ color: 'inherit' }}>{profile?.id?.slice(-10) || '-'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: sizes.admin.gaps.md, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onAvatarPick} disabled={avatarPickingDisabled}>
            {textStrings.admin.profile.changeAvatar}
          </Button>
          <Button onClick={onEdit}>{textStrings.admin.profile.editProfile}</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

