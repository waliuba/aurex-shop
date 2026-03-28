import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const AdminLogin = ({ next = '#/admin' }) => {
  const auth = useAuth();
  const [email, setEmail] = useState('admin@aurex.com');
  const [password, setPassword] = useState('aurexadmin');
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
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 18, display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)' }}>
          Aurex
        </div>
        <div style={{ fontSize: 28, fontWeight: 900 }}>Admin Sign In</div>
        <div className="uiHelpText">Use admin credentials to manage products, orders, customers, and inventory.</div>
      </div>

      <Card title="Login">
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <div className="uiErrorText">{error}</div> : null}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            {loading ? <Spinner label="Checking credentials" /> : null}
            <Button href="#/" variant="secondary">
              Back to store
            </Button>
          </div>
          <div className="uiHelpText">
            Tip: default demo is <strong>admin@aurex.com</strong> / <strong>aurexadmin</strong>.
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;

