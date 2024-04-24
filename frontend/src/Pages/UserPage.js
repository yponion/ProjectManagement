import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../store/authSlice";
import useToast from "../hooks/toast";

const UserPage = () => {
    const [showChange, setShowChange] = useState(false);

    const [nowPassword, setNowPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {addToast} = useToast();

    // 정규 표현식 패턴
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

    // 비밀번호 검증 함수
    function isPasswordValid(password) {
        return passwordPattern.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== newPasswordCheck) {
            addToast({
                text: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.'
            })

        } else { // 비밀번호 변경 요청
            if (isPasswordValid(newPassword)) {
                axios.put('/api/user/info',
                    {currentPassword: nowPassword, changePassword: newPassword},
                    {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}},
                ).then((res) => {
                    if (res.data.result === 'success') { // 비밀번호 변경 성공
                        addToast({
                            text: '비밀번호 변경 성공'
                        })
                        setShowChange(false);
                        setNowPassword('');
                        setNewPassword('');
                        setNewPasswordCheck('');
                    } else {
                        alert('비밀번호를 정확하게 입력해 주세요.');
                    }
                }).catch(() => {
                    console.log('비밀번호 변경 못함');
                })
            } else {
                addToast({
                    text: '비밀번호는 영어 대소문자, 숫자, 특수기호를 포함하여 8~20자 이어야 합니다.'
                })
            }
        }
    }

    useEffect(() => {
        axios.get('/api/user/info', {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then((res) => { // get 으로 가져옴
            setName(res.data.user.name);
            setEmail(res.data.user.email);
        }).catch(() => { // 못가져 왔을 경우 예외처리
            console.log('유저 정보 가져오지 못함')
        })
    }, []);

    const show = () => {
        if (!showChange) {
            return (
                <button
                    className="cancel-common"
                    onClick={() => {
                        setShowChange(true);
                    }}
                >
                    비밀번호 변경하기
                </button>
            )
        } else {
            return (
                <form onSubmit={handleSubmit}>
                    <input type="password"
                           className="container-common-input"
                           placeholder="현재 비밀번호"
                           required
                           value={nowPassword}
                           onChange={(e) => setNowPassword(e.target.value)}/>
                    <br/><br/>
                    <input type="password"
                           className="container-common-input"
                           placeholder="새 비밀번호"
                           required
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}/>
                    <input type="password"
                           className="container-common-input"
                           placeholder="새 비밀번호 확인"
                           required
                           value={newPasswordCheck}
                           onChange={(e) => setNewPasswordCheck(e.target.value)}/>
                    <br/><br/>
                    <button className="ok-common" type="submit">확인</button>
                    <br/><br/>
                    <button className="cancel-common" onClick={() => {
                        setShowChange(false);
                        setNowPassword('');
                        setNewPassword('');
                        setNewPasswordCheck('');
                    }}>취소
                    </button>
                </form>
            )
        }
    }

    return (
        <div className="container-common">
            <div>
                <h1>{name}</h1>
                <h3>{email}</h3>
                {show()}
                <br/><br/>
                <button
                    className="cancel-common"
                    onClick={() => {
                        dispatch(logout());
                    }}
                >
                    로그아웃
                </button>
                <br/><br/>
                <button
                    className="cancel-common"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    돌아가기
                </button>
                <br/><br/>
                <button
                    className="del-common"
                    onClick={() => {
                        axios.delete('/api/user/withdraw', {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then(() => {
                            dispatch(logout());
                            navigate('/login');
                        }).catch(() => {
                            console.log('회원 탈퇴 못함');
                        })
                    }}
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    )
}

export default UserPage;