import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { calculateSpribeMultiplier } from '../../utils/multiplier'
import { handleFlip } from '../../utils/handleFlip'
import { togglehowtoplay, toggleMenu, cashOutbetamount, revealAll, togglefooter, togglemain, clearCashoutNotification, setCashoutNotification, SetbetState, setcashOutamount } from '../../features/mines/mineSlices'
import { current } from '@reduxjs/toolkit'


const Cashout = () => {
    const revealed = useSelector(state => state.revealed);
    const betamount = useSelector(state => state.betamount)
    const cashoutAmount = useSelector(state => state.cashOutamount)
    const safeClicks = revealed.filter(val => val === true).length;
    const betState = useSelector(state => state.betState)
    const [disablefooter, setDisablefooter] = useState(false)
    const soundSelector = useSelector(state => state.soundSelector)
    const minesCount = useSelector(state => state.minesCount);
    // const multiplier = () => calculateSpribeMultiplier(safeClicks, minesCount)
    const fieldroundSelector = useSelector(state => state.fieldroundSelector)
    const fieldCountcolumn = useSelector(state => state.fieldCountcolumn)
    const multiplier = () => calculateSpribeMultiplier(fieldroundSelector, fieldCountcolumn)
    const dispatch = useDispatch()

    const cashOut = () => {
        dispatch(togglehowtoplay(false))
        dispatch(toggleMenu(false))
        if (fieldroundSelector > 0) {
            const currentmultiplier = multiplier()
            const payout = parseFloat(betamount) * currentmultiplier;
            dispatch(cashOutbetamount(payout))
            dispatch(revealAll())
            dispatch(togglefooter(false));
            dispatch(togglemain(true));
            setDisablefooter(false);
            dispatch(setCashoutNotification(payout))
            handleFlip(dispatch)
            dispatch(SetbetState(!betState))

            let minestapsound = "/sounds/success-alert.mp3"
            let audio = new Audio(minestapsound)
            if (soundSelector) {
                audio.play()
            }
            setTimeout(() => {
                dispatch(clearCashoutNotification())
            }, 2000);
            // resetGame()
        }
    }

    return (
        <div onClick={cashOut} className='flex cursor-pointer items-center justify-between w-9/10 bg-yellow-400 h-full rounded-2xl border-2 border-black inset-shadow-[0.4px_0.6px_0px_#94dcf7] shadow-[1px_1px_8px_rgb(0,0,0)] bg-radial-[at_50%_60%] from-[#D79E4E] to-[#C4872E] to-60% active:translate-x-0.2 active:translate-y-0.5  transition-transform duration-150'>
            <span className='text-white font-bold text-xl w-full flex justify-center '>CASHOUT : {cashoutAmount.toFixed(2)}
            </span>
        </div>
    )
}

export default Cashout