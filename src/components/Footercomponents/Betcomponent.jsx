import React, { useState } from 'react'
import { CiPlay1 } from "react-icons/ci";
import { calculateSpribeMultiplier } from '../../utils/multiplier';
import { useSelector, useDispatch } from 'react-redux';
import { togglehowtoplay, Setfieldroundselector,toggleMenu, betAmt, togglemain, togglefooter, boxesSet, revealedFalse, setcashOutamount, SetbetState } from '../../features/mines/mineSlices';

const Betcomponent = () => {
    const dispatch = useDispatch()
    const fieldCount = useSelector(state => state.fieldCount)
    const revealed = useSelector(state => state.revealed);
    const minesCount = useSelector(state => state.minesCount);
    const autogameSelector = useSelector(state => state.autoGame)
    const [keyboard, setKeyboard] = useState(false)
    const betamount = useSelector(state => state.betamount)
    const soundSelector = useSelector(state => state.soundSelector)
    const [togglefixedamt, setTogglefixedamt] = useState(false)
    const betState = useSelector(state => state.betState)
    const safeClicks = revealed.filter(val => val === true).length;
    const multiplier = () => calculateSpribeMultiplier(safeClicks, minesCount)
    const [disablefooter, setDisablefooter] = useState(false)



    const resetGame = () => {
       let newBoxes
       if (fieldCount === "small") {
         newBoxes = Array.from({ length: 4 }, () => Array(3).fill("safe"));
   
         let index = 0;
         while (index < 4) {
           const random = Math.floor(Math.random() * 3);
           newBoxes[index][random] = "mines";
           index++;
         }
       } else if (fieldCount === "medium") {
         newBoxes = Array.from({ length: 7 }, () => Array(4).fill("safe"));
   
         let index = 0;
         while (index < 7) {
           const random = Math.floor(Math.random() * 4);
           newBoxes[index][random] = "mines";
           index++;
         }
       } else if (fieldCount === "large") {
         newBoxes = Array.from({ length: 10 }, () => Array(5).fill("safe"));
   
         let index = 0;
         while (index < 10) {
           const random = Math.floor(Math.random() * 5);
           newBoxes[index][random] = "mines";
           index++;
         }
       }
   

       dispatch(togglemain(true))
       dispatch(boxesSet(newBoxes))
       dispatch(revealedFalse())
       dispatch(Setfieldroundselector(0))
     }
    const bet = (e) => {
        dispatch(togglehowtoplay(false))
        dispatch(toggleMenu(false))
        resetGame()
        if (keyboard == false && Number(betamount) > 0 && autogameSelector == false) {
            let minestapsound = "/sounds/bet-click.mp3"
            let audio = new Audio(minestapsound)
            if (soundSelector) {
                audio.play()
            }
            dispatch(betAmt(Number(betamount)))
            dispatch(togglemain(false))
            setDisablefooter(true)
            dispatch(togglefooter(true))
            setTogglefixedamt(false)
            dispatch(setcashOutamount(multiplier()))
            dispatch(SetbetState(!betState))
        }
    }

    return (
        <div onClick={bet} className={` ${autogameSelector ? "disable-div" : ""} flex cursor-pointer border-2 border-black inset-shadow-[0.4px_0.6px_0px_#94dcf7] shadow-[1px_1px_8px_rgb(0,0,0)] items-center justify-between w-9/10 bg-radial-[at_50%_60%] from-[#5CA003] to-[#327A00] to-60% h-full rounded-2xl active:translate-x-0.2 active:translate-y-0.5  transition-transform duration-150`}><CiPlay1 className='text-white font-bold text-3xl ml-5 ' />
            <span className='text-white font-bold text-xl w-8/10  mr-10 flex justify-center'>
                BET
            </span>
        </div>
    )
}

export default Betcomponent