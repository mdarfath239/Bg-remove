import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'

const Header = () => {
    return (
        <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-10 md:px-14 lg:px-28 mx-auto max-w-[90vw]'>
            <Link to='/'><img src={assets.logo} alt="" className='w-32 sm:w-44' /></Link>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className='flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full hover:scale-105 transition-all duration-700'>
                        Get started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
}

export default Header
