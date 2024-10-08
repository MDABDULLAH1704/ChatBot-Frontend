import React, { useEffect } from 'react';
import './Alert.css'; 

const Alert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); // Remove alert after 2 seconds

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [onClose]);

    return (
        <div className="alert">
            {message}
        </div>
    );
};

export default Alert;
