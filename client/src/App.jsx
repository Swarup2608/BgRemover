import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  
  return (
    <div className='min-h-screen bg-slate-50'>
      <NavBar />
      <ToastContainer position='bottom-right' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='/buy' element={<BuyCredit />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
