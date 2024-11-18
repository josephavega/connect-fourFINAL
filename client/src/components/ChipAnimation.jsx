import React, { useEffect, useState } from 'react';
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png';
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png';
import '../styles/chipAnimation.css';

const ChipAnimation = ({ startX, startY, endX, endY, chipType, onAnimationEnd }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    // Trigger the animation on mount
    const animationStyle = {
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      transition: 'all 0.5s ease-in-out',
      transform: `translate(${endX - startX}px, ${endY - startY}px)`,
    };
    setStyle(animationStyle);

    // Notify parent when the animation is complete
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 500); // Match duration with transition

    return () => clearTimeout(timer); // Cleanup timer
  }, [startX, startY, endX, endY, onAnimationEnd]);

  return (
    <img
      src={chipType === 'Red' ? RedChip : YellowChip}
      alt={`${chipType} Chip`}
      style={style}
      className="chip-animation"
    />
  );
};

export default ChipAnimation;
