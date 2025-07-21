import { triggerFlip,resetFlip } from "../features/mines/mineSlices";
import { useDispatch } from "react-redux";

export function handleFlip(dispatch){

  dispatch(triggerFlip());
  setTimeout(() => {
    dispatch(resetFlip());
  }, 800); 
};