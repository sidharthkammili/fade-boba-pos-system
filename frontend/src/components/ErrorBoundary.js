import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h1 style={titleStyle}>Oops! Something went wrong.</h1>
            <p style={textStyle}>
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            <div style={iconStyle}>🍵</div>
            <button 
              onClick={() => window.location.href = '/'}
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '90%'
};

const titleStyle = {
  color: '#2d3436',
  marginBottom: '20px',
  fontSize: '2rem'
};

const textStyle = {
  color: '#636e72',
  marginBottom: '30px',
  lineHeight: '1.6'
};

const iconStyle = {
  fontSize: '80px',
  marginBottom: '30px',
  animation: 'wiggle 2s infinite ease-in-out'
};

const buttonStyle = {
  backgroundColor: '#0984e3',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '30px',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  boxShadow: '0 5px 15px rgba(9, 132, 227, 0.3)'
};

export default ErrorBoundary;
