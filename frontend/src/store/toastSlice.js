import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    toasts: []
}

const toastSlice = createSlice({ //createSlice를 통해 state를 정의
    name: 'toast',
    initialState,
    reducers: { // state를 변경하는 함수가 들어감
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