import './App.css';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import NavBar from "./elements/NavBar";
import routes from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import {useDispatch, useSelector} from "react-redux";
import {hide} from "./store/boxSlice";
import {useEffect, useState} from "react";
import {login} from "./store/authSlice";
import Toast from "./elements/Toast";
import useToast from "./hooks/toast";

function App() {
    const toasts = useSelector(state => state.toast.toasts)
    const {deleteToast} = useToast();
    const dispatch = useDispatch();
    const [render, setRender] = useState(true);
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn')){
            dispatch(login());
        }
        setRender(!render);
    }, []);

    return (
        <BrowserRouter>
            <Toast
                toasts={toasts}
                deleteToast={deleteToast}
            />
            <NavBar/>
            <div className="container" onClick={() => { // 사용자/로그아웃 div 숨기기
                dispatch(hide());
                setRender(!render);
            }}
            >
                <Routes>
                    {routes.map((route) => {
                        return <Route
                            key={route.path}
                            path={route.path}
                            element={
                                route.auth ? // 로그인 되어 있어도 로그인 페이지 갈 수 있음..auth 필요한가?
                                    <ProtectedRoute element={route.element}/> :
                                    route.element}
                        />
                    })}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
