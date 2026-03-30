import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';
import colorstring from '../../universal components/colorstrings';

const AdminLogin = ({ next = '#/admin' }) => {
  const auth = useAuth();
  const [email, setEmail] = useState(Text.admin.login.tip.email);
  const [password, setPassword] = useState(Text.admin.login.tip.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.login({ email, password });
      window.location.hash = next || '#/admin';
    } catch (err) {
      setError(err?.message || Text.admin.login.errors.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: sizes.admin.login.maxWidth,
        margin: '0 auto',
        padding: sizes.admin.login.padding,
        display: 'grid',
        gap: sizes.admin.login.containerGap,
      }}
    >
      <div style={{ display: 'grid', gap: sizes.admin.login.headerGap }}>
        <div
          style={{
            fontSize: sizes.admin.login.kickerFontSize,
            letterSpacing: sizes.admin.login.kickerLetterSpacing,
            textTransform: 'uppercase',
            color: colorstring.admin.muted,
          }}
        >
          {Text.admin.login.brand}
        </div>
        <div style={{ fontSize: sizes.admin.login.titleFontSize, fontWeight: sizes.admin.login.titleFontWeight }}>
          {Text.admin.login.title}
        </div>
        <div className="uiHelpText">{Text.admin.login.description}</div>
      </div>

      <Card title={Text.admin.login.cardTitle}>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: sizes.admin.login.formGap }}>
          <Input
            label={Text.admin.login.emailLabel}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            label={Text.admin.login.passwordLabel}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <div className="uiErrorText">{error}</div> : null}
          <div style={{ display: 'flex', gap: sizes.admin.login.actionsGap, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button type="submit" disabled={loading}>
              {loading ? Text.admin.common.signingIn : Text.admin.login.signIn}
            </Button>
            {loading ? <Spinner label={Text.admin.login.checkingCredentials} /> : null}
            <Button href="#/" variant="secondary">
              {Text.admin.actions.backToStore}
            </Button>
          </div>
          <div className="uiHelpText">
            {Text.admin.login.tip.prefix} <strong>{Text.admin.login.tip.email}</strong> /{' '}
            <strong>{Text.admin.login.tip.password}</strong>.
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
