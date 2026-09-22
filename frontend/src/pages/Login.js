import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { verifyGoogleToken, loginEmployee } from '../api/api';
 
export default function Login() {
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
 
  // Read the intended role from the URL e.g. /login?role=manager
  const intendedRole = searchParams.get('role'); // 'manager' or 'cashier' or null
  const isCustomerLogin = searchParams.get('customer') === '1';
 
  const enforceRole = (userRole) => {
    // If no intended role specified, just route by DB role
    if (!intendedRole) {
      return userRole === 'Manager' ? '/manager' : '/cashier';
    }
    // If intended role is manager but user is cashier, block
    if (intendedRole === 'manager' && userRole !== 'Manager') {
      setError('Access denied. This login is for managers only.');
      return null;
    }
    // If intended role is cashier but user is manager, block
    if (intendedRole === 'cashier' && userRole !== 'Cashier') {
      setError('Access denied. This login is for cashiers only.');
      return null;
    }
    return userRole === 'Manager' ? '/manager' : '/cashier';
  };
 
  const handlePinLogin = async () => {
    if (!pin.trim()) return setError('Please enter a PIN.');

    // Validate PIN format: must be exactly XXXX (4 digits)
    const pinFormatRegex = /^\d{4}$/;
    if (!pinFormatRegex.test(pin)) {
      return setError('PIN must be in the format XXXX (ex: 9999).');
    }

    setError('');
    try {
      const user = await loginEmployee(pin);
      const destination = enforceRole(user.role);
      if (!destination) return; // blocked
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('userType', 'employee');
      navigate(destination);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };
 
  const handleLoginSuccess = async (credentialResponse) => {
    setError('');
    try {
      console.log('intendedRole being sent:', intendedRole);
      const data = await verifyGoogleToken(credentialResponse.credential, intendedRole);
      if (data.success) {
        if (data.userType === 'employee') {
          const destination = enforceRole(data.user.role);
          if (!destination) return; // blocked
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('userType', data.userType);
          navigate(destination);
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('userType', 'customer');
          navigate('/kiosk');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Server error during login. Please try again.');
    }
  };
 
  return (
    <main style={styles.bg} id="main-content">
      <div style={styles.wrapper}>
        <section style={styles.box} aria-labelledby="login-title">
          <h1 style={styles.logo}>Fade Boba</h1>
          <h2 id="login-title" style={styles.title}>
            {isCustomerLogin
              ? 'Customer Sign In'
              : intendedRole === 'manager'
              ? 'Manager Sign In'
              : intendedRole === 'cashier'
              ? 'Cashier Sign In'
              : 'Staff Sign In'}
          </h2>
 
          <p style={styles.subtitle}>
            {isCustomerLogin
              ? 'Customers can sign in with Google to access order history and liked items.'
              : intendedRole === 'manager'
              ? 'This login is for managers only.'
              : intendedRole === 'cashier'
              ? 'This login is for cashiers only.'
              : 'Managers and cashiers should authenticate below. Customers should use the kiosk from the portal page.'}
          </p>
 
          {error && <p style={styles.error} role="alert">{error}</p>}
 
          {!isCustomerLogin && (
            <>
              <div style={styles.pinSection}>
                <input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePinLogin()}
                  style={styles.input}
                />
                <button onClick={handlePinLogin} style={styles.pinBtn}>
                  Login with PIN
                </button>
              </div>
 
              <div style={styles.divider}>OR</div>
            </>
          )}
 
          <div style={styles.btnContainer} aria-label="Google sign-in section">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => setError('Google Login UI Failed')}
              theme="filled_black"
              shape="rectangular"
            />
          </div>
 
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            Back to Portal
          </button>
        </section>
      </div>
    </main>
  );
}
const styles = {
  bg: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--dark)',
    padding: '24px',
    position: 'relative', 
  },
  wrapper: {
    width: '100%',
    maxWidth: '500px', 
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  box: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  logo: {
    fontSize: '2.25rem',
    textAlign: 'center',
    color: 'var(--pink)',
    fontWeight: 800,
    margin: '0 0 8px 0',
  },
  title: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.6rem',
    margin: '0',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    marginBottom: '6px',
  },

  error: {
    color: 'var(--red)',
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '4px',
  },
  backBtn: {
    background: 'var(--border)',
    color: 'var(--text)',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
  },
  pinSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--dark)',
    color: 'white',
    fontSize: '1rem',
  },
  pinBtn: {
    background: 'var(--purple)',
    color: 'white',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
  },
  divider: {
    textAlign: 'center',
    margin: '10px 0',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
};