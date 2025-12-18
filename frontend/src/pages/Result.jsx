import React from 'react'
import { assets } from '../assets/assets'

const Result = () => {
    return (
        <div className='mx-auto max-w-7xl px-4 py-20 lg:px-44'>
            <div className='bg-white rounded-lg px-8 py-6 drop-shadow-sm'>
                {/* Image Container */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                    {/* Left Side */}
                    <div>
                        <p className='font-semibold text-gray-600 mb-2'>Original</p>
                        <img className='rounded-md border' src={assets.image_w_bg} alt="" />
                    </div>

                    {/* Right Side */}
                    <div className='flex flex-col'>
                        <p className='font-semibold text-gray-600 mb-2'>Background Removed</p>
                        <div className='relative overflow-hidden rounded-md border border-gray-300 h-full flex items-center justify-center bg-layer'>
                            <img src={assets.image_wo_bg} alt="" />
                            {/* If bg_layer is an image, we might want to set it as background style or absolute img. 
                            However, usually 'bg-layer' implies a class. 
                            If I added it to assets, I can use it as inline style background.
                        */}
                            <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${assets.bg_layer})`, backgroundRepeat: 'repeat', backgroundSize: 'cover' }}></div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6'>
                    <button className='px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700'>Try another image</button>
                    <a className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-700' href="">Download image</a>
                </div>
            </div>
        </div>
    )
}

export default Result
