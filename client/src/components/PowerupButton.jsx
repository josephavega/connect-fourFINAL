import React, { useState } from 'react';
import { io } from 'socket.io-client';


const PowerupButton = ({ name, onActivate, isActive }) => {
    return (
        <button
            onClick={() => onActivate(name)}
            style={{ backgroundColor: isActive ? 'green' : 'gray' }}
        >   
            {name}
        </button>
    );
};

const PowerupButtonPanel = () => {
    const [activePowerups, setActivePowerups] = useState({
        Anvil: false,
        Lightning: false,
        Brick: false,
    });
}
useEffect(() => {
    // Listening
    socket.on('powerupUsed', ({ powerupType }) => {
        setActivePowerups((prev) => ({
            ...prev,
            [powerupType]: true,
        }));
        // Reseting power-ups
        setTimeout(() => {
            setActivePowerups((prev) => ({
                ...prev,
                [powerupType]: false,
            }));
        }, 5000); // Deactivating 
    });

    return () => {
        socket.off('powerupUsed');
    };
}, []);

const handleActivate = (powerupType) => {
    socket.emit('usePowerup', { powerupType });
};

return (
    <div>
        <h3>Power-ups</h3>
        {Object.keys(activePowerups).map((powerup) => (
            <PowerupButton
                key={powerup}
                name={powerup}
                isActive={activePowerups[powerup]}
                onActivate={handleActivate}
            />
        ))}
    </div>
);


export default PowerupButton;