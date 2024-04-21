import {createSlice} from "@reduxjs/toolkit";

const tmp = () => {
    try {
        if (localStorage.getItem('projectNum')) {
            const a = localStorage.getItem('projectNum');
            return Number(a)
        } else return 0
    } catch {
        return 0
    }
}

const tmp1 = () => {
    try {
        if (localStorage.getItem('taskNum')) {
            const a = localStorage.getItem('taskNum');
            return Number(a)
        } else return 0
    } catch {
        return 0
    }
}

const tmp2 = () => {
    try {
        if (localStorage.getItem('noticeNum')) {
            const a = localStorage.getItem('noticeNum');
            return Number(a)
        } else return 0
    } catch {
        return 0
    }
}


const initialState = {
    projectNum: tmp(),
    taskNum: tmp1(),
    noticeNum: tmp2()
}

const numSlice = createSlice({ //createSlice를 통해 state를 정의
    name: 'num',
    initialState,
    reducers: { // state를 변경하는 함수가 들어감
        setProjectNum: (state, action) => {
            state.projectNum = action.payload;
            localStorage.setItem('projectNum', action.payload);
        },
        setTaskNum: (state, action) => {
            state.projectNum = action.payload;
            localStorage.setItem('taskNum', action.payload);
        },
        setNoticeNum: (state, action) => {
            state.noticeNum = action.payload;
            localStorage.setItem('noticeNum', action.payload);
        },
    }
})

export const {setProjectNum, setTaskNum,setNoticeNum} = numSlice.actions;

export default numSlice.reducer;