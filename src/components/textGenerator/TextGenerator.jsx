import React, { useState } from 'react';
import './TextGenerator.css'
import axios from 'axios';
import baseURL from '../../baseURL/BaseURL';
import Alert from '../alert/Alert';


const TextGenerator = () => {
    const [count, setCount] = useState(1);
    const [message, setMessage] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    // generateAndShare function
    const generateAndShare = async () => {
        const response = await axios.post(`${baseURL}/generate-text`, { message, count });
        const texts = response.data.join('\n'); // Format texts for WhatsApp
        const url = `https://wa.me/?text=${encodeURIComponent(texts)}`;
        window.open(url, '_blank');
    };

    // generateText function
    const generateText = async () => {
        const response = await axios.post(`${baseURL}/generate-text`, { message, count });
        setGeneratedText(response.data.join('\n'));
    };

    // copyToClipboard function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText).then(() => {
            setShowAlert(true); // Show the alert
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // handleCloseAlert function
    const handleCloseAlert = () => {
        setShowAlert(false); // Close the alert
    };

    return (
        <div className='textGenerator'>
            <div className='center'>

                <h1 className='heading'>Text Generator</h1>

                <div className='message'>
                    <label htmlFor="Message">Message : </label>
                    <input
                        className='messageInput'
                        type="text"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="number">
                    <label htmlFor="Number">Number : </label>
                    <input
                        className='numberInput'
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        min="1"
                        max="1000000000" // Update as needed        
                    />
                </div>

                <div className="btn">
                    <button onClick={generateText}>Generate Text</button>
                    <button onClick={generateAndShare}>Generate and Share on WhatsApp</button>
                </div>

                <h2 className='subHeading'>Generated Text</h2>

                <div className='generatedText'>
                    {generatedText && <button className='copy' onClick={copyToClipboard}>Copy</button>}
                    <div className="generatedText-div" style={{ whiteSpace: 'pre-wrap' }}>{generatedText}
                    </div>
                </div>

                {showAlert && <Alert message="Text Copied" onClose={handleCloseAlert} />}

            </div>
        </div>
    )
}

export default TextGenerator
