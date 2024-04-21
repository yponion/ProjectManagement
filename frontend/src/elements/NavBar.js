import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/authSlice";
import {hide, show} from "../store/boxSlice";
import logo from '../images/logo.png';
import user from '../images/user.png';
import axios from "axios";
import {useEffect, useState} from "react";

const NavBar = () => {
    const location = useLocation();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const showBox = useSelector(state => state.box.showBox);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const isLeader = () => {
    //     axios.get(`/api/project/pm/${localStorage.getItem('projectNum')}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}})
    //         .then((res) => {
    //             return res.data.result;
    //         })
    //         .catch(e => {
    //             console.log('유저 정보 가져오지 못함');
    //         });
    //     return false;
    // }

    return (
        <nav>
            <div className="nav-container" onClick={() => {
                dispatch(hide());
            }}>
                <Link style={{
                    width: "50px",
                    height: "50px"
                }}
                      className="nav-logo" to="/project"><img
                    style={{
                        width: "50px",
                        height: "50px"
                    }}
                    src={logo}
                    alt="로고"
                /></Link>
                {(location.pathname.startsWith('/project/dashboard') || location.pathname.startsWith('/project/task') || location.pathname.startsWith('/project/management') || location.pathname.startsWith('/project/timeline')) &&
                    <ul>
                        <li>
                            <NavLink
                                className={({isActive}) => "link" + (isActive ? " activate" : "")}
                                aria-current="page"
                                to="/project/dashboard"
                            >
                                대시보드
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) => "link" + (isActive ? " activate" : "")}
                                aria-current="page"
                                to="/project/task"
                            >
                                작업
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) => "link" + (isActive ? " activate" : "")}
                                aria-current="page"
                                to="/project/timeline"
                            >
                                타임라인
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) => "link" + (isActive ? " activate" : "")}
                                aria-current="page"
                                to="/project/management"
                            >
                                관리
                            </NavLink>
                        </li>
                    </ul>}
                {isLoggedIn && <div
                    style={{
                        cursor: "pointer",
                        width: "27px",
                        height: "27px"
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (showBox) {
                            dispatch(hide())
                        } else {
                            dispatch(show())
                        }
                    }}
                >
                    <img
                        style={{
                            width: "27px",
                            height: "27px"
                        }}
                        src={user}
                        alt="사용자"/>
                </div>}
            </div>
            {showBox && <div className="nav-box">
                <div className="nav-box-container">
                    <div
                        onClick={() => {
                            navigate('/members/info');
                            dispatch(hide())
                        }}
                    >
                        사용자
                    </div>
                    <hr/>
                    <div
                        onClick={() => {
                            dispatch(logout());
                            dispatch(hide());
                            navigate('/')
                        }}
                    >
                        로그아웃
                    </div>
                </div>
            </div>}
        </nav>
    )
}

export default NavBar;