import React, { useState, useEffect, useMemo } from 'react'
import { handleFlip } from '../utils/handleFlip'
import { useSelector, useDispatch } from 'react-redux'
import { setMultiplier, betAmt, SetbetState, SetautorevealState, cashOutbetamount, setCashoutNotification, clearCashoutNotification, Setautogamingstate, toggleAutoGame, toggleMenu, togglehowtoplay, revealedFalse, togglefooter, togglemain, revealedOne, revealAll, changeMines, boxesSet, SetselectAutoBoxes, selectAutoOne, Setfieldroundselector } from '../features/mines/mineSlices'
import { calculateSpribeMultiplier } from '../utils/multiplier'
import { MdOutlineAutorenew } from "react-icons/md";
import Mainboxes from './Maincomponents/Mainboxes'
import Mineschanger from './Maincomponents/Mineschanger'


const Main = () => {
  const betamount = useSelector(state => state.betamount)
  const fieldCount = useSelector(state => state.fieldCount)
  const fieldCountcolumn = useSelector(state => state.fieldCountcolumn)
  const fieldroundSelector = useSelector(state => state.fieldroundSelector)
  const multiplier = useSelector(state => state.multiplier);
  const boxes = useSelector(state => state.boxes)
  const revealed = useSelector(state => state.revealed)
  const soundSelector = useSelector(state => state.soundSelector)
  const autogameSelector = useSelector(state => state.autoGame)
  const selectAutoBoxes = useSelector(state => state.selectAutoBoxes)
  const betState = useSelector(state => state.betState)
  const autorevealState = useSelector(state => state.autorevealState)
  const autogamingstate = useSelector(state => state.autogamingstate)
  const [maindisable, setMaindisable] = useState(true)
  const mainselector = useSelector(state => state.disablemain)
  const footerselector = useSelector(state => state.disablefooter)
  const flipTrigger = useSelector(state => state.flipTrigger)
  const multiplier2 = () => calculateSpribeMultiplier(fieldroundSelector, fieldCountcolumn)
  const dispatch = useDispatch()

  useEffect(() => {
    resetGame();
  }, [fieldCount]);




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

    setMaindisable(true)
    dispatch(togglemain(true))
    dispatch(boxesSet(newBoxes))
    dispatch(revealedFalse())
    dispatch(Setfieldroundselector(0))
    dispatch(Setfieldroundselector(0))
  }

  const selectRandom = () => {
    dispatch(togglehowtoplay(false))
    dispatch(toggleMenu(false))
    if (!mainselector && autogameSelector == false) {
      let random
      if (fieldCount == "small") {
        random = Math.floor(Math.random() * 3);
      } else if (fieldCount == "medium") {
        random = Math.floor(Math.random() * 4);
      } else if (fieldCount == "large") {
        random = Math.floor(Math.random() * 5);
      }

      if (revealed[fieldroundSelector][random] == false) {


        dispatch(revealedOne({ index: fieldroundSelector, index1: random }))



        if (boxes[fieldroundSelector][random] == "mines") {
          let minestapsound = "/sounds/lose.mp3"
          let audio = new Audio(minestapsound)
          if (soundSelector) {
            audio.play()
          }
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
          if ((fieldroundSelector + 1) == fieldCountcolumn) {
            dispatch(Setfieldroundselector(fieldroundSelector + 1))
            const currentmultiplier = multiplier2()
            const payout = parseFloat(betamount) * currentmultiplier;
            dispatch(cashOutbetamount(payout))
            dispatch(setCashoutNotification(payout))
            dispatch(SetbetState(!betState))
            dispatch(togglefooter(false))
            dispatch(togglemain(true))
            dispatch(revealAll())

            let minestapsound = "/sounds/success-alert.mp3"
            let audio = new Audio(minestapsound)
            if (soundSelector) {
              audio.play()
            }
            setTimeout(() => {
              dispatch(clearCashoutNotification())
            }, 2000);

          } else {
            dispatch(Setfieldroundselector(fieldroundSelector + 1))
          }

        }

      }
      else {
        selectRandom()
      }
    }
    if (footerselector && autogameSelector) {
      let random
      if (fieldCount == "small") {
        random = Math.floor(Math.random() * 3);
      } else if (fieldCount == "medium") {
        random = Math.floor(Math.random() * 4);
      } else if (fieldCount == "large") {
        random = Math.floor(Math.random() * 5);
      }

      if ((fieldroundSelector) < fieldCountcolumn) {
        if (selectAutoBoxes[fieldroundSelector][random] == false) {
          let minestapsound = "/sounds/star-click.mp3"
          let audio = new Audio(minestapsound)
          if (soundSelector) {
            audio.play()
          }
          dispatch(selectAutoOne({ index: fieldroundSelector, index1: random }))
          dispatch(Setfieldroundselector(fieldroundSelector + 1))
        }

      }

    }
  }

  const safeClickCount = useMemo(() => {
    return revealed.filter(v => v === true).length;
  }, [revealed]);

  const autoGameFunction = () => {

    if (!betState) {
      resetGame()
      dispatch(toggleAutoGame(!autogameSelector))
      dispatch(togglefooter(!footerselector))
      dispatch(togglemain(!mainselector))
      dispatch(SetselectAutoBoxes())
      dispatch(SetautorevealState(false))
    } else {

    }
  }


  useEffect(() => {
    if (autogameSelector == false) {
      const newMultiplier = calculateSpribeMultiplier(fieldroundSelector + 1, fieldCountcolumn);
      dispatch(setMultiplier(newMultiplier));
    } else {

      const newMultiplier = calculateSpribeMultiplier(safeClickCountauto - 1, fieldCountcolumn);
      dispatch(setMultiplier(newMultiplier));
    }

  }, [safeClickCount, autogameSelector, fieldCount, fieldroundSelector, fieldCountcolumn, flipTrigger, safeClickCountauto])


  return (
    <main className={`flex flex-col justify-between items-center md:h-8/10 h-8/12  `}>
      <Mineschanger />
      <Mainboxes />
      <div className='flex md:w-1/3 w-9/10 h-8 justify-between items-center mt-3 mb-2 space-x-1'>
        <div onClick={selectRandom} className={`w-1/2 cursor-pointer bg-[#36610A] border border-gray-800 rounded-xl flex justify-center items-center text-white font-semibold font-sans ${((mainselector && autogameSelector == false) || autogamingstate) ? "disable-div" : ""}`}>RANDOM</div>
        <div className={`${(betState || autogamingstate) ? "disable-div" : ""} w-1/2 bg-[#36610A] cursor-pointer border border-gray-800 rounded-xl flex justify-between items-center text-white font-semibold font-sans `}>
          <span className='w-2/10'><MdOutlineAutorenew className='size-5 ' /></span>

          <span className='flex items-center w-8/10'>
            <label className="relative inline-flex items-center cursor-pointer mr-1">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={autoGameFunction}
                checked={autogameSelector}
              />
              <div className="w-7 h-4 bg-[#719446]  rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-[#5BA100]"></div>

            </label>
            AUTOGAME
          </span>
        </div>
      </div>
    </main>
  )
}

export default Main