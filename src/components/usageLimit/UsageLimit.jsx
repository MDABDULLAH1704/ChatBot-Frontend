import React, { useState, useEffect } from 'react';
import './usageLimit.css';

const MAX_USES_PER_DAY = 50;
export { MAX_USES_PER_DAY };
const STORAGE_KEY = 'chat_usage_data';

const UsageLimit = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const loadUsage = () => {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            const now = Date.now();

            if (stored) {
                const { count, resetTime } = stored;
                setCount(count);
                if (now >= resetTime) {
                    resetUsage();
                } else {
                    startCountdown(resetTime);
                }
            } else {
                resetUsage();
            }
        };

        loadUsage();

        window.addEventListener('usage_updated', loadUsage);
        return () => window.removeEventListener('usage_updated', loadUsage);
    }, []);

    const startCountdown = (targetTime) => {
        const interval = setInterval(() => {
            const now = Date.now();
            const msLeft = targetTime - now;

            if (msLeft <= 0) {
                resetUsage();
                clearInterval(interval);
            } else {
                const hrs = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((msLeft / (1000 * 60)) % 60);
                const secs = Math.floor((msLeft / 1000) % 60);
                setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
            }
        }, 1000);
    };

    const resetUsage = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const nextReset = tomorrow.getTime();
        const data = { count: 0, resetTime: nextReset };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setCount(0);
        startCountdown(nextReset);
    };

    return (
        <div className='usageLimit'>
            <p>🧠 Uses left today: {MAX_USES_PER_DAY - count} / <strong> {MAX_USES_PER_DAY}</strong></p>
            {timeLeft && <p>⏳ Reset in: {timeLeft}</p>}
        </div>
    );
};

export default UsageLimit;
