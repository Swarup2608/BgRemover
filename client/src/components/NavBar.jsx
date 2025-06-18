import React from 'react'
import {assets} from '../assets/assets'
import {Link} from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const NavBar = () => {
  const {openSignIn} = useClerk();
  const {isSignedIn,user} = useUser();

  return (
    <div className='flex item-center justify-between py-3 mx-4 lg:mx-44'>
      <Link to={"/"}><img className='w-32 sm:w-44' src={assets.logo} alt="Logo" /></Link>
      {isSignedIn ? 
        <div>
          <UserButton />
        </div>
        :
        <button onClick={()=>openSignIn({})} className='flex items-center text-white bg-zinc-800 cursor-pointer gap-4 px-4 py-2 sm:py-3 border border-zinc-800 text-sm rounded-full font-medium'>
        Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" /></button>

      }
      
    </div>
  )
}

export default NavBar
