import React, { useState } from 'react';
import { io } from 'socket.io-client';


const PowerupButton = ({ name, onActivate, isActive, image }) => {
    return (
        <button
            onClick={() => onActivate(name)}
            style={{
                position: 'relative',
                backgroundColor: isActive ? 'transparent' : 'gray',
                width: '72px',
                height: '72px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
            }}
        >
            {isActive && (
                <img
                    src={image}
                    alt={`${name} unused`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                />
            )}

    {!isActive && (
                <img
                    src={image}
                    alt={`${name} used`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                />
            )}


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

const powerupAnimations = {
    Anvil: anvilGif,
    Lightning: lightningGif,
    Brick: brickGif,
};


export default PowerupButton;