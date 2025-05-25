import React from 'react'
import './Navbar.css'
import UsageLimit from '../usageLimit/UsageLimit'

const Navbar = () => {
    return (
        <>
            <h1></h1>
            <h3 className='nav'>Chatbot - AI Assistant</h3>
            <UsageLimit />
        </>
    )
}

export default Navbar
