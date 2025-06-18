import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Upload = () => {

    const {removeBg} = useContext(AppContext)
    return (
        <div className='pb-16'>
            {/* Title */}
            <h1 className='mb-12 text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'> See the magic. Try now </h1>

            {/* Upload */}
            <div className='text-center mb-24'>
                <input onChange={(e)=>removeBg(e.target.files[0])} type="file" accept='image/*' hidden id="upload2" />
                <label className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white m-auto hover:scale-105 transition-all duration-700' htmlFor="upload2">
                    <img width={20} src={assets.upload_btn_icon} alt="" />
                    <p>Upload your image</p>
                </label>
            </div>
        </div>
    )
}

export default Upload
