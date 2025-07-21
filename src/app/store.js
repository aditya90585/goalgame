import { configureStore } from "@reduxjs/toolkit";

import { minesReducers } from "../features/mines/mineSlices";
export const store = configureStore({
       reducer:minesReducers
})