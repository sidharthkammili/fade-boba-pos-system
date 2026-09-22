import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={errorCodeStyle}>404</div>
        <h1 style={titleStyle}>Page Not Found</h1>
        <p style={textStyle}>
          The boba you're looking for seems to have faded away... 
          or maybe the link is broken.
        </p>
        <div style={visualStyle}>
           <span style={bobaEmoji}></span>
           <div style={puddleStyle}></div>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#6c5ce7'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#a29bfe'}
        >
          Take Me Back
        </button>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes spread {
            0% { width: 40px; opacity: 0.3; }
            50% { width: 80px; opacity: 0.1; }
            100% { width: 40px; opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  background: '#2d3436', // Dark background for a premium feel
  fontFamily: "'Outfit', 'Inter', sans-serif",
  padding: '20px'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '60px',
  borderRadius: '40px',
  textAlign: 'center',
  maxWidth: '600px',
  width: '100%',
  color: 'white'
};

const errorCodeStyle = {
  fontSize: '120px',
  fontWeight: '800',
  letterSpacing: '-5px',
  background: 'linear-gradient(to bottom, #a29bfe, #6c5ce7)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0'
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  marginTop: '0',
  marginBottom: '15px'
};

const textStyle = {
  fontSize: '1.2rem',
  color: '#b2bec3',
  lineHeight: '1.6',
  marginBottom: '40px'
};

const visualStyle = {
  position: 'relative',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '40px'
};

const bobaEmoji = {
  fontSize: '60px',
  animation: 'float 4s infinite ease-in-out'
};

const puddleStyle = {
  height: '10px',
  width: '60px',
  background: 'rgba(162, 155, 254, 0.3)',
  borderRadius: '50%',
  marginTop: '10px',
  animation: 'spread 4s infinite ease-in-out'
};

const buttonStyle = {
  backgroundColor: '#a29bfe',
  color: 'white',
  border: 'none',
  padding: '15px 45px',
  borderRadius: '50px',
  fontSize: '1.2rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 20px rgba(162, 155, 254, 0.2)'
};
