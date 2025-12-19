import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Result = () => {

    const { resultImage, image } = useContext(AppContext)
    const { removeBg, loading, setResultImage, setImage } = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (image) {
            removeBg(image)
        }
    }, [image])

    return (
        <div className='mx-auto max-w-7xl px-4 py-20 lg:px-44'>
            <div className='bg-white rounded-lg px-8 py-6 drop-shadow-sm'>
                {/* Image Container */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                    {/* Left Side */}
                    <div>
                        <p className='font-semibold text-gray-600 mb-2'>Original</p>
                        {image ? <img className='rounded-md border' src={URL.createObjectURL(image)} alt="" /> : null}
                    </div>

                    {/* Right Side */}
                    <div className='flex flex-col'>
                        <p className='font-semibold text-gray-600 mb-2'>Background Removed</p>
                        <div className='relative overflow-hidden rounded-md border border-gray-300 h-full flex items-center justify-center bg-layer'>
                            {resultImage ? <img src={resultImage} alt="" /> : loading ? <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2'>
                                <div className='border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
                            </div> : null}
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
                    <button onClick={() => { setImage(false); setResultImage(false); navigate('/') }} className='px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700'>Try another image</button>
                    {resultImage && <a className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-700' href={resultImage} download>Download image</a>}
                </div>
            </div>
        </div>
    )
}

export default Result
