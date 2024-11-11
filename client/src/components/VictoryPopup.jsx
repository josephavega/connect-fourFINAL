import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Victory from '../assets/victory.jpg';
import '../styles/helpPopup.css';

const VictoryPopup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirects to the homepage
    }, 8000); // 8-second delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div className="help-popup-overlay">
      <div className="help-popup">
        <div className="popup-header">
          <h2>You Win!</h2>
        </div>
        <div className="popup-content">
          <div className="instruction-container">
            <img
              src={Victory}
              alt="Victory Image"
              className="instruction-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;

