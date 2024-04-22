import {useState} from "react";
import {useDispatch} from "react-redux";
import {loginF} from "../store/authSlice";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const LoginPage = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginCheck, setLoginCheck] = useState(false);
    const [signupEmailCheck, setSignupEmailCheck] = useState(false);
    const [signupPasswordCheck, setSignupPasswordCheck] = useState(false);
    const [signupPasswordPatternCheck, setSignupPasswordPatternCheck] = useState(false);

    // 정규 표현식 패턴
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

    // 비밀번호 검증 함수
    function isPasswordValid(password) {
        return passwordPattern.test(password);
    }


    // 로그인 submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault(); // onSubmit 기본동작(새로고침 등) 방지
        const res = await axios.post('/api/user/signin', {
            email: loginEmail,
            password: loginPassword
        });
        if (res.data.result === "success") {
            setLoginCheck(false); // p태그 제거
            dispatch(loginF(res.data.token.toString())); // 로그인
            navigate('/project'); // 프로젝트 페이지로 이동
        } else { // 로그인 실패
            setLoginCheck(true); // 아이디 비번 잘못된 입력 p태그 보여줌
        }
    };

    // 회원가입 submit
    const handleSignupSubmit = async (e) => {
        e.preventDefault(); // onSubmit 기본동작(새로고침 등) 방지

        setSignupPasswordCheck(false); // 비번 불일치 p태그 제거
        setSignupPasswordPatternCheck(false);
        setSignupEmailCheck(false);
        if (password === passwordCheck) { // 비밀번호
            if (isPasswordValid(password)) { // 형식 체크
                axios.post('/api/user/signup', {name, email, password}).then((res) => {
                    if (res.data.result === "success") {
                        window.location.reload();
                    } else {
                        setSignupEmailCheck(true); // 이메일 중복 p태그 보여줌
                    }
                }).catch(() => {
                    console.log('비밀번호 수정 못함')
                })
            } else {
                setSignupPasswordPatternCheck(true); // 패턴 불일치 p태그 보여줌
            }
        } else {
            setSignupPasswordCheck(true); // 비번 불일치 p태그 보여줌
        }
    };
    // 비밀번호 형식 맞지 않음
    // 이메일 중복


    return (
        <div className="login-box">
            <div className="login-container" id="login-container">
                <div className="form-container sign-in">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>로그인</h1>
                        <input type="email" placeholder="이메일" required={true}
                               value={loginEmail} onChange={(e) => setLoginEmail(e.target.value.toLowerCase())}/>
                        <input type="password" placeholder="비밀번호" required={true}
                               value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                        {loginCheck && <p style={{color: "red"}}
                        >이메일 또는 비밀번호를 잘못 입력했습니다.<br/>입력하신 내용을 다시 확인해주세요.</p>}
                        <button type="submit">로그인</button>
                    </form>
                </div>
                <div className="form-container sign-up">
                    <form onSubmit={handleSignupSubmit}>
                        <h1>회원가입</h1>
                        <input type="text" placeholder="이름" required={true}
                               value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="email" placeholder="이메일" required={true}
                               style={{
                                   border: signupEmailCheck && "1px solid red"
                               }}
                               value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())}/>
                        {signupEmailCheck && <p style={{color: "red"}}>이메일 중복</p>}
                        <input type="password" placeholder="비밀번호" required={true}
                               style={{border: signupPasswordCheck && "1px solid red"}}
                               value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <input type="password" placeholder="비밀번호 확인" required={true}
                               style={{border: signupPasswordCheck && "1px solid red"}}
                               value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)}/>
                        {signupPasswordCheck && <p style={{color: "red"}}>비밀번호가 일치하지 않습니다.</p>}
                        {signupPasswordPatternCheck &&
                            <p style={{color: "red"}}>비밀번호는 영어 대소문자, 숫자, 특수기호를 포함하여 8~20자 이어야 합니다.</p>}
                        <button type="submit">회원가입</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Project Pulse</h1>
                            <p>프로젝트를 관리해 보세요</p>
                            <button
                                onClick={() => {
                                    document.getElementById('login-container').classList.remove("active");
                                    setName('');
                                    setEmail('');
                                    setPassword('');
                                    setPasswordCheck('');
                                }}
                                className="hidden"
                            >
                                로그인
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Project Pulse</h1>
                            <p>계정을 생성해 무료로 사용</p>
                            <button
                                onClick={() => {
                                    document.getElementById('login-container').classList.add("active");
                                    setLoginEmail('');
                                    setLoginPassword('');
                                }}
                                className="hidden"
                            >
                                회원가입
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage