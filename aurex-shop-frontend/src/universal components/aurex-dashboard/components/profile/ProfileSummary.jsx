import { useMemo, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import Button from '../../Button';
import InputField from '../../InputField';
import Modal from '../ui/Modal';

const initials = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'G';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
};

const ProfileSummary = () => {
  const session = useSession();
  const user = session.user;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const avatarText = useMemo(() => initials(user?.name), [user?.name]);

  return (
    <section className="mdCard">
      <div className="mdSectionHeader">
        <div>
          <div className="mdSectionTitle">Profile</div>
          <div className="mdMuted">Who am I in this store?</div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setName(user?.name || '');
            setEmail(user?.email || '');
            setOpen(true);
          }}
        >
          Edit profile
        </Button>
      </div>

      <div className="mdProfileSummary">
        <div className="mdAvatar" aria-hidden="true">
          {avatarText}
        </div>
        <div>
          <div className="mdProfileName">{user?.name || 'Guest'}</div>
          <div className="mdMuted">{user?.email || 'No email set'}</div>
        </div>
      </div>

      <Modal
        open={open}
        title="Edit profile"
        onClose={() => setOpen(false)}
        footer={
          <div className="mdModal__footerActions">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                session.setUser({ ...user, name: name.trim() || 'Guest', email: email.trim() });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="mdFormGrid">
          <div>
            <div className="mdFormLabel">Name</div>
            <InputField value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <div className="mdFormLabel">Email</div>
            <InputField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default ProfileSummary;

