import React, { useEffect } from 'react';
import './Alert.css';

const Alert = ({ message, onClose, duration = 2000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);  // Use the duration prop

        return () => clearTimeout(timer);
    }, [onClose, duration]);


    return (
        <div className="alert">
            {message}
        </div>
    );
};

export default Alert;
