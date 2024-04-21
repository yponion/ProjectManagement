import {configureStore} from '@reduxjs/toolkit'
import toastReducer from "./toastSlice";
import authSlice from "./authSlice";
import boxSlice from "./boxSlice";
import numSlice from "./numSlice";

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        auth: authSlice,
        box: boxSlice,
        num: numSlice,
    },
})