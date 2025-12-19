import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { SignInButton, UserButton, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'

const Header = () => {

    const { credit, loadCreditsData, openSignIn } = useContext(AppContext)
    const { isSignedIn, user } = useUser()

    useEffect(() => {
        if (isSignedIn) {
            loadCreditsData()
        }
    }, [isSignedIn])

    return (
        <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-10 md:px-14 lg:px-28 mx-auto max-w-[90vw]'>
            <Link to='/'><img src={assets.logo} alt="" className='w-32 sm:w-44' /></Link>
            {
                isSignedIn ?
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <button className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
                            <img className='w-5' src={assets.credit_icon} alt="" />
                            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left : {credit}</p>
                        </button>
                        <p className='text-gray-600 max-sm:hidden'>Hi, {user.firstName}</p>
                        <UserButton />
                    </div>
                    : <button onClick={() => openSignIn({})} className='flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full hover:scale-105 transition-all duration-700'>
                        Get started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
                    </button>
            }
        </div>
    )
}

export default Header
