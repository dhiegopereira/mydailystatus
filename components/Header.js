import React from 'react'
import NavBar from '../components/NavBar'
import { useAuth } from '../lib/AuthContext'

const Header = () => {
    const auth = useAuth()  
    return (
        <div className='bg-gray-200'>
            <h1>
                <img 
                    className='h-24 mx-auto py-4'  
                    src='/logo.png' 
                    alt='Olá FSL!'
                    />
            </h1>
            <NavBar />
        </div>
    )
}

export default Header
