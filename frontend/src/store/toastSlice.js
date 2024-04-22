import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    toasts: []
}

const toastSlice = createSlice({ //createSlice 를 통해 state 를 정의
    name: 'toast',
    initialState,
    reducers: { // state 를 변경하는 함수가 들어감
        addToast: (state, action) => {
            state.toasts.push(action.payload)
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(toast => {
                    return toast.id !== action.payload
                }
            )
        }
    }
})

export const {addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;