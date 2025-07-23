import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RxCross1 } from "react-icons/rx";
import { togglehowtoplay } from '../features/mines/mineSlices';

const Howtoplay = () => {
     const howtoplaySelector = useSelector(state => state.howtoplay)
     const dispatch = useDispatch()
  return (
<div className={`fixed bg-[#212226] z-20 md:h-[80%] h-[80%] md:w-[30%] w-[90%] md:top-9 bottom-30 md:left-[35%] left-[5%] rounded-xl  ${howtoplaySelector ? "" : "hidden"}`}>
          <div className=' flex justify-between items-center text-white m-4'><span className='font-semibold font-sans'>How To Play</span>
            <span onClick={() => dispatch(togglehowtoplay(false))} className='rounded-full cursor-pointer flex bg-[#373E48] p-0.5 inset-shadow-[0.4px_0.4px_0.8px_white]'><RxCross1 className='p-0.5' /></span></div>
          <div className='w-full h-px bg-[#38393C]'></div>
          <h1 className='font-semibold mt-4 text-2xl text-center text-white'>GOAL</h1>
          <div className='w-full flex justify-center my-10'><img className='w-[95%]' src="/images/how-goal.png" alt="how-to-play" /></div>
          <div className='text-center text-white'>Each column is a step towards the goal, but each also hides a mine.</div>
          <div className='text-center text-white mx-5 mt-2'>Avoid the mines and increase your winnings with each step. Change the field size for better odds, and cash out at any time.</div>
        </div>
  )
}

export default Howtoplay