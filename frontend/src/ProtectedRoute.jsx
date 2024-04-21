import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const ProtectedRoute = (
    {element}
) => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // 아래 authSlice의 로그인 되있는지
    if (!isLoggedIn) { // 로그인 되어있지 않다면 로그인 페이지로
        return <Navigate to='/login'/>
    }
    // 로그인 되어있다면 이동
    return element;
};

export default ProtectedRoute;