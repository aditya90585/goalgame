import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handleFlip } from '../../utils/handleFlip';
import { togglehowtoplay, toggleMenu, revealedOne, revealAll, togglefooter, togglemain, SetbetState, selectAutoOne, Setfieldroundselector } from '../../features/mines/mineSlices'
import { FaStar } from "react-icons/fa";
import { PiBombFill } from "react-icons/pi";

const Mainboxes = () => {
    const dispatch = useDispatch()
    const mainselector = useSelector(state => state.disablemain)
    const autogameSelector = useSelector(state => state.autoGame)
    const autogamingstate = useSelector(state => state.autogamingstate)
    const boxes = useSelector(state => state.boxes)
    const footerselector = useSelector(state => state.disablefooter)
    const soundSelector = useSelector(state => state.soundSelector)
    const minesCount = useSelector(state => state.minesCount)
    const selectAutoBoxes = useSelector(state => state.selectAutoBoxes)
    const revealed = useSelector(state => state.revealed)
    const flipTrigger = useSelector(state => state.flipTrigger)
    const autorevealState = useSelector(state => state.autorevealState)
    const betState = useSelector(state => state.betState)
    const fieldroundSelector = useSelector(state => state.fieldroundSelector)

    let safeClickCountauto = useMemo(() => {
        return selectAutoBoxes.filter(v => v === true).length;
    }, [selectAutoBoxes]);

    const handleBoxclick = (index, index1) => {
        dispatch(togglehowtoplay(false))
        dispatch(toggleMenu(false))


        if (footerselector && autogameSelector == false && fieldroundSelector == index) {

            dispatch(revealedOne({ index1, index }))
            if (boxes[index][index1] == "mines") {
                let minestapsound = "/sounds/lose.mp3"
                let audio = new Audio(minestapsound)
                if (soundSelector) {
                    audio.play()
                }

                // const revealall = Array(5 * 5).fill("true")
                // setRevealed(revealall)

                dispatch(revealAll())
                // handleFlip(dispatch)
                dispatch(togglefooter(false))
                dispatch(togglemain(true))
                dispatch(SetbetState(!betState))


            } else {
                let minestapsound = "/sounds/star-click.mp3"
                let audio = new Audio(minestapsound)
                if (soundSelector) {
                    audio.play()
                }
                dispatch(Setfieldroundselector(fieldroundSelector + 1))
            }

        }

        if (footerselector && autogameSelector) {
            let minestapsound = "/sounds/star-click.mp3"
            let audio = new Audio(minestapsound)
            if (soundSelector) {
                audio.play()
            }
            if (25 - minesCount > safeClickCountauto) {
                dispatch(selectAutoOne(index))
            } else (
                dispatch(selectAutoOne(index))
            )
        }
    }



    return (
        <div className={`md:w-2/4 mt-4 md:h-full  h-70 w-full bg-[#417615] rounded-2xl flex justify-center md:gap-x-1 gap-x-1 items-center ${((mainselector && autogameSelector == false) || autogamingstate) ? "disable-main" : ""}`}>
            {boxes.map((box1, index1) => {
                return <div key={index1} className={`h-full w-full flex justify-center items-center flex-col gap-x-1 gap-y-2   `}>

                    {/* ${(footerselector && autogameSelector == false) ? revealed[index] ? "grad2" : "grad-dark" : "grad"}
             ${flipTrigger && revealed[index] ? "animate-flip" : ""}
             ${(footerselector && autogameSelector) ? selectAutoBoxes[index] ? "grad-auto" : "grad-dark" : "grad"} */}
                    {box1.map((box, index) => {
                        return <div key={index} onClick={() => handleBoxclick(index1, index)} className={`w-full h-full rounded-sm border-4       
                     ${(footerselector && autogameSelector == false) ? (fieldroundSelector == index1) ? "grad-light" : "grad" : "grad"}
                            `} >

                            {(autogameSelector == false || autorevealState) ? (revealed[index1][index]) ? box == "safe" ? <div className={`h-full w-full flex  justify-center items-center`}><img src='/images/football.png' className='text-[#FEF4E0] bg-white rounded-full h-5/10 w-5/10 aspect-square ' /></div> : <div className={`h-full w-full flex  justify-center items-center `}><PiBombFill className=' h-7/10 w-7/10 drop-shadow-[3px_3px_2px_black]' /></div> : <div></div> : <div></div>}
                            {(autogameSelector && autorevealState == false) ? (selectAutoBoxes[index]) ? <div className={`h-7 w-7 rounded-full gradcircle-auto `}></div> : <div className={`h-7 w-7 rounded-full gradcircle `}></div> : <div></div>}
                        </div>
                    })}
                    {/* {(autogameSelector == false || autorevealState) ? (revealed[index]) ? box == "safe" ? <div className={`h-full w-full flex  justify-center items-center `}><FaStar className='text-[#FEF4E0] h-8/10 w-8/10 drop-shadow-[6px_5px_4px_#F78513]' /></div> : <div className={`h-full w-full flex  justify-center items-center `}><PiBombFill className=' h-7/10 w-7/10 drop-shadow-[3px_3px_2px_black]' /></div> : <div className={`h-7 w-7 rounded-full gradcircle `}></div> : <div></div>}
                    {(autogameSelector && autorevealState == false) ? (selectAutoBoxes[index]) ? <div className={`h-7 w-7 rounded-full gradcircle-auto `}></div> : <div className={`h-7 w-7 rounded-full gradcircle `}></div> : <div></div>} */}
                </div>
            })}
        </div>
    )
}

export default Mainboxes