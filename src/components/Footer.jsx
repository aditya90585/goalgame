import React, { useMemo, useRef } from 'react'
import { store } from '../app/store.js'
import { handleFlip } from '../utils/handleFlip'
import { calculateSpribeMultiplier } from '../utils/multiplier'
import { useSelector, useDispatch } from 'react-redux'
import { addfixBet, toggleMenu, togglehowtoplay, triggerFlip, Setfieldroundselector, SetfieldCountcolumn, resetFlip, betAmt, boxesSet, cashOutbetamount, changefixbettomin, changebetFix, changebetValue, clearCashoutNotification, fixBets, revealedFalse, setcashOutamount, setCashoutNotification, setNavcashout, togglefooter, togglemain, revealAll, toggleStartAutoGameSelector, SetautoGameRound, revealedOne, toggleAutoGame, SetbetState, SetautorevealState, Setautogamingstate, SetroundLeft, SetstopGamestate, SetselectAutoBoxes } from '../features/mines/mineSlices'
import { useState, useEffect } from 'react'
import { CiPlay1 } from "react-icons/ci";
import { MdOutlineAutorenew } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import Firstfoot from './Footercomponents/Firstfoot.jsx'
import Cashout from './Footercomponents/Cashout.jsx'
import Betcomponent from './Footercomponents/Betcomponent.jsx'


const Footer = () => {
    const [togglefixedamt, setTogglefixedamt] = useState(false)
    const revealed = useSelector(state => state.revealed);
    const fieldCount = useSelector(state => state.fieldCount);
    const betamount = useSelector(state => state.betamount)
    const soundSelector = useSelector(state => state.soundSelector)
    const autogameSelector = useSelector(state => state.autoGame)
    const autoGameRoundsArray = useSelector(state => state.autoGameRoundsArray)
    const autoGameRound = useSelector(state => state.autoGameRound)
    const betState = useSelector(state => state.betState)
    const roundLeft = useSelector(state => state.roundLeft)
    const autogamingstate = useSelector(state => state.autogamingstate)
    const [disablefooter, setDisablefooter] = useState(false)
    const [keyboard, setKeyboard] = useState(false)
    const dispatch = useDispatch()
    const footerselector = useSelector(state => state.disablefooter)
    const selectAutoBoxes = useSelector(state => state.selectAutoBoxes)
    const StartAutoGameSelector = useSelector(state => state.startAutoGameSelector)
    const boxes = useSelector(state => state.boxes)
    const stopGamesstate = useSelector(state => state.stopGamestate)
    const boxesRef = useRef([]);
    const roundLeftRef = useRef(roundLeft);
    const safeClicks = revealed.filter(val => val === true).length;
    const fieldroundSelector = useSelector(state => state.fieldroundSelector)
    const fieldCountcolumn = useSelector(state => state.fieldCountcolumn)

    let safeClickCountauto = useMemo(() => {
        if (!Array.isArray(selectAutoBoxes[0])) return 0;
        let value = 1
        selectAutoBoxes.forEach((e, index) => {
            if (!Array.isArray(e)) {
                return 0;
            } else if (e.filter(v => v === true).length > 0) {
                value++
            }

        })
        return value
    }, [selectAutoBoxes]);

    const multiplier = () => calculateSpribeMultiplier(fieldroundSelector, fieldCountcolumn)
    const multiplier2 = () => calculateSpribeMultiplier(safeClickCountauto, fieldCountcolumn)
    const autogamemultiplier = useSelector(state => state.multiplier)


    useEffect(() => {
        dispatch(setcashOutamount(multiplier()))
    }, [fieldCountcolumn, safeClickCountauto, fieldroundSelector])

    useEffect(() => {
        boxesRef.current = boxes;
    }, [boxes]);

    useEffect(() => {
        roundLeftRef.current = roundLeft;
    }, [roundLeft]);

    const stopGamestateRef = useRef(stopGamesstate);

    useEffect(() => {
        stopGamestateRef.current = stopGamesstate;
    }, [stopGamesstate]);




    // const safeClickCountauto = useMemo(() => {
    //     if (!Array.isArray(selectAutoBoxes[0])) return 0;
    //     return selectAutoBoxes[0].filter(v => v === true).length;
    // }, [selectAutoBoxes]);


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

    useEffect(() => {
        setDisablefooter(footerselector)
    }, [footerselector])

    const togglestartautoGame = () => {
        if ((autogameSelector && safeClickCountauto > 0)) {
            dispatch(toggleStartAutoGameSelector(!StartAutoGameSelector))
            dispatch(SetstopGamestate(false))
        }
    }

    const selectRounds = (rounds) => {
        dispatch(SetautoGameRound(rounds))
        dispatch(SetroundLeft(rounds))
    }

    const startAutoGame = () => {
        dispatch(toggleStartAutoGameSelector(!StartAutoGameSelector))
        dispatch(togglemain(true))
        dispatch(togglefooter(true))
        dispatch(Setautogamingstate(true))
        dispatch(SetroundLeft(autoGameRound))
        roundLeftRef.current = autoGameRound

        // dispatch(toggleAutoGame(false))

        let currentRound = 0;

        const runRound = () => {
            if (stopGamestateRef.current) return;
            if (currentRound >= autoGameRound) {
                dispatch(toggleStartAutoGameSelector(false));
                dispatch(toggleAutoGame(false))
                dispatch(SetbetState(false))
                dispatch(togglemain(false))
                dispatch(togglefooter(false))
                dispatch(Setautogamingstate(false))
                resetGame()
                return;
            }

            dispatch(betAmt(Number(betamount)))
            dispatch(SetroundLeft(roundLeftRef.current - 1));
            resetGame()
            dispatch(SetautorevealState(false))

            setTimeout(() => {
                dispatch(SetautorevealState(true))
                let isLoss = false;
                for (let index1 = 0; index1 < fieldCountcolumn; index1++) {
                    for (let index = 0; index < 4; index++) {
                        if (selectAutoBoxes[index1][index] == true) {
                            dispatch(SetautorevealState(true))
                            dispatch(revealedOne({ index1: index, index: index1 }))
                            handleFlip(dispatch)


                            if (boxesRef.current[index1][index] === "mines") {
                                isLoss = true;
                            }
                        }
                    }
                }
                if (isLoss) {
                    let minestapsound = "/sounds/lose.mp3"
                    let audio = new Audio(minestapsound)
                    if (soundSelector) {
                        audio.play()
                    }
                } else {
                    const payout = parseFloat(betamount) * autogamemultiplier;

                    dispatch(cashOutbetamount(payout))
                    dispatch(setCashoutNotification(payout))
                    setTimeout(() => {
                        dispatch(clearCashoutNotification())
                    }, 1000);

                    let minestapsound = "/sounds/success-alert.mp3"
                    let audio = new Audio(minestapsound)
                    if (soundSelector) {
                        audio.play()
                    }
                }
                currentRound++;
                setTimeout(runRound, 1000); // wait between rounds
            }, 1000);
        }
        runRound()
    }

    const stopAutogame = () => {
        dispatch(SetstopGamestate(true))
        dispatch(togglemain(false))
        dispatch(togglefooter(false))
        dispatch(toggleStartAutoGameSelector(false));
        dispatch(toggleAutoGame(false))
        dispatch(SetbetState(false))
        dispatch(Setautogamingstate(false))
        resetGame()
    }
    return (
        <footer className={`bg-radial-[at_50%_60%] from-[#3D6B06] to-[#1E3B16] to-60%  w-full md:h-20 h-4/16 rounded-2xl flex md:flex-row flex-col-reverse gap-x-2 gap-y-2 justify-center  items-center md:static relative bottom-9 `}>
            <Firstfoot />
            <div className=' md:w-1/3 w-9/10 md:h-7/10 h-1/3 rounded-full flex  items-center' >

                {!autogamingstate ? <div onClick={togglestartautoGame} className={`w-15 cursor-pointer mr-5 h-full bg-[#0257C0] border-2 border-black shadow-md shadow-black rounded-full flex justify-center items-center text-slate-300 text-3xl aspect-square ${(autogameSelector && safeClickCountauto > 0) ? "" : "disable-div"}`}><MdOutlineAutorenew /></div>
                    : <div onClick={stopAutogame} className={`w-15 cursor-pointer mr-5 h-full bg-[#D2000F] border-2 border-black shadow-md shadow-black rounded-full flex justify-center items-center text-slate-300 text-3xl aspect-square font-sans ${(autogameSelector && safeClickCountauto > 0) ? "" : "disable-div"}`}>{roundLeft}</div>
                }
                <div className={`fixed flex  flex-col items-center bg-[#212226] z-20 md:h-[80%] h-[80%] md:w-[40%] w-[90%] md:top-9 bottom-30 md:left-[30%] left-[5%] rounded-xl  ${StartAutoGameSelector ? "" : "hidden"}`}>

                    <div className=' flex justify-between w-[90%] items-center text-white m-4'><span className='font-semibold font-sans'>AUTO PLAY</span>
                        <span onClick={() => dispatch(toggleStartAutoGameSelector(false))} className='rounded-full cursor-pointer flex bg-[#373E48] p-0.5 inset-shadow-[0.4px_0.4px_0.8px_white]'><RxCross1 className='p-0.5' /></span></div>

                    <div className='w-full h-px bg-[#38393C]'></div>
                    <div className='w-[90%]  h-43 flex items-center flex-col my-6 bg-[#1A1B1E] rounded-xl'>
                        <h1 className='text-white text-xs m-2'>Number Of Rounds</h1>
                        <div className='w-[99%] h-[90%] mb-3  flex-wrap gap-x-2 gap-y-2 flex justify-center'>
                            {autoGameRoundsArray.map((rounds, index) => {
                                return <div key={rounds} onClick={() => selectRounds(rounds)} className={` ${(autoGameRound == rounds) ? "bg-[#555961]" : "bg-[#393B3F]"} cursor-pointer w-[48%] h-[30%] rounded-sm flex justify-between items-center`}>
                                    <div className='w-1/10 h-full flex justify-center items-center ml-1'>
                                        <span className={`${(autoGameRound == rounds) ? "bg-[#5BA100]" : "bg-[#6C6E71]"}  size-3 rounded-full flex`}></span>
                                    </div>
                                    <div className='w-9/10 flex justify-center items-center text-white mr-2'>{rounds}</div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className='text-center text-white'></div>
                    <div className='text-center text-white mx-5 mt-2'></div>
                    <div className='w-full h-px bg-[#38393C] absolute bottom-17'></div>
                    <div onClick={startAutoGame} className={` ${autogameSelector ? "" : ""} flex absolute bottom-3 cursor-pointer border-2 border-black inset-shadow-[0.4px_0.6px_0px_#94dcf7] shadow-[1px_1px_8px_rgb(0,0,0)] items-center justify-between w-9/10 bg-radial-[at_50%_60%] from-[#5CA003] to-[#327A00] to-60% h-12 rounded-2xl active:translate-x-0.2 active:translate-y-0.5  transition-transform duration-150`}><span className='text-white font-bold w-full  flex justify-center'>START AUTO</span></div>
                </div>

                {(autogameSelector == false) ? (footerselector == false) ? <Betcomponent />
                    : <Cashout />
                    : <Betcomponent />
                }

            </div>

        </footer>
    )
}

export default Footer