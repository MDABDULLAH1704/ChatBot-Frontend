import React, { useState } from 'react';
import './CopyButton.css'

const CopyButton = ({ htmlContent }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;
        const plainText = tempElement.textContent || tempElement.innerText || '';

        navigator.clipboard.writeText(plainText)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200); 
            })
            .catch(err => console.error('Copy failed:', err));
    };

    return (
        <button className='copyBtn' onClick={handleCopy} style={{ cursor: 'pointer' }}>
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
};

export default CopyButton;
