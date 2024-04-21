import {createSlice} from "@reduxjs/toolkit";

const localStorageLoggedIn = () => {
    try {
        if (localStorage.getItem('isLoggedIn')) {
            return true
        } else return false // 개발 -> true
    } catch {
        return false
    }
}

const initialState = {
    isLoggedIn: localStorageLoggedIn()
}

const authSlice = createSlice({ //createSlice를 통해 state를 정의
    name: 'auth',
    initialState,
    reducers: { // state를 변경하는 함수가 들어감
        loginF: (state, action) => {
            const token = action.payload;
            localStorage.setItem('isLoggedIn', token); // 로컬스토리지에 로그인 되었다고 저장
            state.isLoggedIn = true;
        },
        login: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            localStorage.removeItem('isLoggedIn'); // 로컬스토리지 로그인 되었다고 저장된거 삭제
            localStorage.removeItem('projectNum'); // 로컬스토리지 프로젝트 넘버도 삭제
            localStorage.removeItem('taskNum'); // 로컬스토리지 작업 넘버도 삭제
            localStorage.removeItem('noticeNum'); // 로컬스토리지 작업 넘버도 삭제
            state.isLoggedIn = false;
        }
    }
})

export const {loginF, login, logout} = authSlice.actions;

export default authSlice.reducer;