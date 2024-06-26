import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    showBox: false
}

const boxSlice = createSlice({ //createSlice 를 통해 state 를 정의
    name: 'box',
    initialState,
    reducers: { // state 를 변경하는 함수가 들어감
        show:(state) =>{
            state.showBox = true;
        },
        hide:(state)=>{
            state.showBox = false;
        }
    }
})

export const {show, hide } = boxSlice.actions;

export default boxSlice.reducer;