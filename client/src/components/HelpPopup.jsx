import React, { useState } from 'react';
import Help1 from '../assets/help/Help_PlacingChip.gif';
import Help2 from '../assets/help/Help_WinDiag.gif';
import Help3 from '../assets/help/Help_Lightning.gif';
import Help4 from '../assets/help/Help_WinHoz.gif';
import '../styles/helpPopup.css';

const HelpPopup = ({ onClose }) => {
  const images = [Help1, Help2, Help3, Help4];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const setImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="help-popup-overlay">
      <div className="help-popup">
        <div className="popup-header2">
          <h2>How To Play</h2>
          <button className="close-btn" onClick={onClose}><img src="../src/assets/Menu/Buttons/Help_Settings_Exit.png" alt="" /></button>
        </div>
        <div className="popup-content">
          <div className="instruction-container">
            <span className="arrow left-arrow" onClick={prevImage}>&#x2190;</span>
            <img
              src={images[currentImageIndex]}
              alt="Instruction Image"
              className="instruction-image"
            />
            <span className="arrow right-arrow" onClick={nextImage}>&#x2192;</span>
          </div>

          <div className="pagination">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setImage(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
