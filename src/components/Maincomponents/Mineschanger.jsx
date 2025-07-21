import React, { useState, useMemo,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { togglehowtoplay, toggleMenu, changeField, SetselectAutoBoxes, SetfieldCountcolumn } from '../../features/mines/mineSlices'
import { FaChevronDown } from "react-icons/fa";

const Mineschanger = () => {
    const dispatch = useDispatch()
    const multiplier = useSelector(state => state.multiplier);
    const mainselector = useSelector(state => state.disablemain)
    const autogameSelector = useSelector(state => state.autoGame)
    const footerselector = useSelector(state => state.disablefooter)
    const soundSelector = useSelector(state => state.soundSelector)
    const fieldCount = useSelector(state => state.fieldCount)
    const revealed = useSelector(state => state.revealed)
    const [togglemine, setTogglemine] = useState(true)
    const [totalfield, setTotalfield] = useState(["small", "medium", "large"])

     useEffect(() => {
       
     if(fieldCount== "small"){
        dispatch(SetfieldCountcolumn(4))
     }else if(fieldCount== "medium"){
        dispatch(SetfieldCountcolumn(7))
     }else if(fieldCount== "large"){
        dispatch(SetfieldCountcolumn(10))
     }
      
     }, [fieldCount])
     

    const safeClickCount = useMemo(() => {
        return revealed.filter(v => v === true).length;
    }, [revealed]);

    const togglemineselector = () => {

        dispatch(togglehowtoplay(false))
        dispatch(toggleMenu(false))
        let minestapsound = "/sounds/minestap.mp3"
        let audio = new Audio(minestapsound)
        if (soundSelector) {
            audio.play()
        }
        setTogglemine(!togglemine)

    }


    const changefield = (field) => {

        dispatch(changeField(field))
        let minestapsound = "/sounds/minestap.mp3"
        let audio = new Audio(minestapsound)
        if (soundSelector) {
            audio.play()
        }
        setTogglemine(true)
        if (autogameSelector) {
            dispatch(SetselectAutoBoxes())
        }
    }


    return (
        <div className={`flex flex-col md:w-3/4 w-9/10 mt-2 ${((autogameSelector && footerselector) || !mainselector || autogameSelector) ? "disable-main" : ""}`}>

            <div className=' bg-[#335415] h-6 rounded-2xl flex justify-between items-center'>
                <div className='flex items-center h-5 mx-1 '>
                    <div onClick={togglemineselector} className='bg-[#3E7315] cursor-pointer rounded-xl w-45  h-5 text-white flex justify-center items-center active:translate-x-0.2 active:translate-y-0.5  transition-transform duration-150 inset-shadow-[0.8px_0.6px_0px_#488112] shadow-[1px_1px_1px_rgb(0,0,0)]' >
                        <span className='w-8/10 flex justify-center items-center ml-3'> Field : {fieldCount}</span>  <FaChevronDown className='w-2/10 text-xs' />
                    </div>
                    <div className={`h-fit w-40 bg-[#1C3016] fixed md:top-19 top-9 z-10 rounded-xl ${togglemine ? "hidden" : ""}`}>
                        {totalfield.map((field, index) => {
                            return <div key={index} onClick={() => changefield(field)} className={`cursor-pointer text-white mx-4 mt-4 mb-4 h-5 flex justify-center items-center rounded-xl ${(fieldCount) == field ? "bg-[#3E6C00]" : "bg-[#2A4702]"}`}>{field}</div>
                        })}


                    </div>
                </div>
                <div className='bg-[#FFC107] rounded-xl mx-px w-40 flex justify-center items-center text-sm h-5'>Next: {multiplier.toFixed(2)}X</div>
            </div>
        </div>
    )
}

export default Mineschanger