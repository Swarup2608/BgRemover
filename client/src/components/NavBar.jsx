import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { credits, loadCreditData } = useContext(AppContext);

  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) {

      loadCreditData()
    }
  }, [isSignedIn])

  return (
    <div className='flex item-center justify-between py-3 mx-4 lg:mx-44'>
      <Link to={"/"}><img className='w-32 sm:w-44' src={assets.logo} alt="Logo" /></Link>
      {isSignedIn ?
        <div className='flex items-center gap-2 sm:gap-3'>
          <button onClick={()=>navigate('/buy')} className='cursor-pointer flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
            <img className='w-5' src={assets.credit_icon} alt="Coin" />
            <p className='text-xs sm:text-sm font-medium text-gray-600 '>Credits : {credits}</p>
          </button>
          <p className='text-gray-600 max-sm:hidden'>Hi, {user.fullName}</p>
          <UserButton />
        </div>
        :
        <button onClick={() => openSignIn({})} className='flex items-center text-white bg-zinc-800 cursor-pointer gap-4 px-4 py-2 sm:py-3 border border-zinc-800 text-sm rounded-full font-medium'>
          Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" /></button>

      }

    </div>
  )
}

export default NavBar
