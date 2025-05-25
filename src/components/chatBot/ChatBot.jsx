import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css'
import axios from 'axios';
import baseURL from '../../baseURL/BaseURL';
import { FaArrowUp } from 'react-icons/fa';
import CopyButton from '../copyButton/CopyButton';
import Loader from '../loader/Loader';
import { MAX_USES_PER_DAY } from '../usageLimit/UsageLimit';


const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'You', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Usage limit handling
        const usageData = JSON.parse(localStorage.getItem('chat_usage_data'));
        const now = Date.now();

        if (usageData) {
            if (now >= usageData.resetTime) {
                // Reset if it's a new day
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const resetTime = tomorrow.getTime();
                localStorage.setItem('chat_usage_data', JSON.stringify({ count: 1, resetTime }));
            } else if (usageData.count >= MAX_USES_PER_DAY) {
                setMessages(prev => [...prev, { sender: 'Bot', text: '🚫 Daily usage limit reached. Please try again after reset.' }]);
                return;
            } else {
                usageData.count += 1;
                localStorage.setItem('chat_usage_data', JSON.stringify(usageData));
            }
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const resetTime = tomorrow.getTime();
            localStorage.setItem('chat_usage_data', JSON.stringify({ count: 1, resetTime }));
        }

        // ✅ Dispatch update event
        window.dispatchEvent(new Event('usage_updated'));


        try {
            const res = await axios.post(`${baseURL}/api/chat`, { message: input });
            const botMessage = { sender: 'Bot', text: res.data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = '❌ Sorry, something went wrong. Please try again.';
            // ✅ Network error (no response received)
            if (!error.response) {
                errorMessage = '🌐 Network error. Please check your internet connection and try again.';
            }
            // ✅ Server error (500)
            else if (error.response.status === 500) {
                errorMessage = '⚠️ Server error (500). We are fixing it. Try again later.';
            }
            const botErrorMessage = {
                sender: 'Bot',
                text: errorMessage
            };
            setMessages(prev => [...prev, botErrorMessage]);
        } finally {
            setLoading(false);
        }
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className='outputDiv'>
                <div className='outputScroll'>
                    {messages.map((msg, i) => (
                        <div className='messageDivOne' key={i} style={{ textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                            <div className='messageDivTwo'>
                                {msg.sender === 'Bot' ? (
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                ) : (
                                    <p>{msg.text}</p>
                                )}
                                <CopyButton htmlContent={msg.text} />
                            </div>
                        </div>
                    ))}
                    {loading && <Loader />}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className='inputDiv'>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder='Ask me anything...'
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}><FaArrowUp /></button>
            </div>
        </>
    );
};

export default ChatBot;
