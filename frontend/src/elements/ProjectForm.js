import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import propTypes from "prop-types";
import axios from "axios";
import useToast from "../hooks/toast";
import {dateFormat} from "../utils/dateFormat";

const ProjectForm = ({editing}) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [memberList, setMemberList] = useState([]);
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [leaderEmail, setLeaderEmail] = useState('');
    const {addToast} = useToast();

    useEffect(() => {
        if (editing) {
            axios.get(`/api/project/pm/${localStorage.getItem('projectNum')}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}})
                .then((res) => {
                    setIsAdmin(res.data.result);
                    setLoading(false);
                })
                .catch(() => {
                    console.log('유저 정보 가져오지 못함');
                });

            // 프로젝트 수정 : 데이터 가져오기
            axios.get(`/api/project/${localStorage.getItem('projectNum')}`).then((res) => {
                setTitle(res.data.project.title);
                setType(res.data.project.type);
                setStart(dateFormat(res.data.project.start));
                setEnd(dateFormat(res.data.project.end));
                setLeaderEmail(res.data.project.leader);
                setMemberList(res.data.project.memberList);
            }).catch(() => {
                console.log('프로젝트 수정페이지 받아오지 못함');
            })
        }
    }, []);


    const update = ({flag, member}) => { // flag 가 true 이면 프로젝트 수정 후 리더 변경, false 이면 프로젝트 수정
        if (editing) { // 프로젝트 수정 페이지 submit
            // 프로젝트 수정
            axios.put(`/api/project/edit/${localStorage.getItem('projectNum')}`,
                {
                    title,
                    type,
                    start,
                    end,
                    memberList,
                }).then(() => {
                navigate('/project/dashboard');
                addToast({
                    text: title + ' 프로젝트 수정됨'
                });

                if (flag) {
                    // 리더 변경
                    axios.put(`/api/project/edit/leader/${localStorage.getItem('projectNum')}`,
                        {leader: member})
                        .then(() => {
                            navigate('/project/dashboard');
                            addToast({
                                text: title + ' 프로젝트 리더 변경됨'
                            });
                        }).catch(() => {
                        console.log('리더 변경 실패');
                    })
                }
            }).catch(() => {
                console.log('프로젝트 수정 실패');
            })
        } else { // 프로젝트 생성 페이지 submit
            axios.post('/api/project/create',
                {
                    title,
                    type,
                    start,
                    end,
                    memberList,
                },
                {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then(() => {
                navigate('/project')
                addToast({
                    text: title + ' 프로젝트 생성됨'
                })
            }).catch(() => {
                console.log('프로젝트 생성 실패')
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        update({flag: false});
    }


    if (editing && loading) {
        return <></>
    }

    if (isAdmin || !editing) {
        return (
            <form onSubmit={handleSubmit}>
                <div className="container-common">
                    <div>
                        <h1>프로젝트 {editing ? '수정' : '생성'}</h1><br/>
                        <label>프로젝트명</label>
                        <input type="text" placeholder="프로젝트명" value={title} required
                               onChange={(e) => setTitle(e.target.value)}/>
                        <br/><br/><br/>
                        <label>타입</label>
                        <input type="text" placeholder="타입" value={type} required
                               onChange={(e) => setType(e.target.value)}/>
                        <br/><br/><br/>
                        <label>시작일</label>
                        <input type="date" placeholder="시작일" value={start} required
                               onChange={(e) => setStart(e.target.value)}
                               max={end}/>
                        <br/><br/><br/>
                        <label>마감일</label>
                        <input type="date" placeholder="마감일" value={end} required
                               onChange={(e) => setEnd(e.target.value)}
                               min={start}/>
                        <br/><br/><br/>

                        <div style={{
                            width: '100%',
                            backgroundColor: "#091E4224",
                            borderRadius: "10px"
                        }}>
                            <h3 style={{textAlign: "center"}}>팀원 명단</h3>

                            {memberList.map((member) => {
                                return (
                                    <div key={member}
                                         style={{
                                             width: '100%',
                                             height: '30px',
                                             display: 'flex',
                                             justifyContent: "space-between"
                                         }}
                                    >
                                        <p style={{
                                            margin: "0px",
                                            marginLeft: "5%",
                                            width: "100%",
                                            height: "30px"
                                        }}>{member}</p>

                                        {member === leaderEmail ? <>
                                            <button
                                                style={{
                                                    boxSizing: "border-box",
                                                    width: "100px",
                                                    height: "27px",
                                                    margin: "1.5px",
                                                    backgroundColor: "#607274",
                                                    color: "#FFFFFF",
                                                    border: "none",
                                                    cursor: "default",
                                                    fontSize: "12px"
                                                }}
                                                type="button"
                                            >
                                                리더
                                            </button>
                                        </> : <>
                                            {editing && <button
                                                style={{
                                                    boxSizing: "border-box",
                                                    width: "150px",
                                                    height: "27px",
                                                    margin: "1.5px",
                                                    backgroundColor: "#4040EFBB",
                                                    color: "#FFFFFF",
                                                    border: "none",
                                                    fontSize: "12px"
                                                }}
                                                type="button"
                                                onClick={() => {
                                                    // 업데이트 후 리더 변경
                                                    update({flag: true, member});
                                                }}
                                            >
                                                저장 및 리더 위임
                                            </button>}
                                            <button
                                                style={{
                                                    boxSizing: "border-box",
                                                    width: "27px",
                                                    height: "27px",
                                                    margin: "1.5px",
                                                    backgroundColor: "#EF4040CC",
                                                    color: "#FFFFFF",
                                                    border: "none"
                                                }}
                                                onClick={() => {
                                                    setMemberList(memberList.filter(memberList => memberList !== member));
                                                }}
                                            >
                                                X
                                            </button>
                                        </>}
                                    </div>
                                );
                            })}


                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: "space-between"
                            }}>
                                <input
                                    id='inputEmail'
                                    placeholder="추가할 회원 이메일 입력"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    style={{
                                        width: "50px",
                                        color: "#FFFFFF",
                                        backgroundColor: "#7C93C3"
                                    }}
                                    type="button"
                                    onClick={() => {
                                        const inputEmail = document.getElementById('inputEmail');
                                        if (email !== '') {// 이미 회원명단에 추가된 경우
                                            if (memberList.includes(email)) {
                                                setEmail('');
                                                inputEmail.style.border = '2px solid green';
                                                inputEmail.placeholder = '이미 추가된 회원 입니다.';
                                            } else { // 회원명단에 없는 경우
                                                // 추가할 회원의 이메일 확인
                                                axios.get(`/api/project/create/${email}`).then((res) => {
                                                    if (res.data.result === 'exist') { // db에 이메일이 있을 경우
                                                        setMemberList([...memberList, email]);
                                                        setEmail('');
                                                        inputEmail.style.border = '1px solid black';
                                                        inputEmail.placeholder = '추가할 회원 이메일 입력';
                                                    } else { // db에 이메일이 없을 경우
                                                        setEmail('');
                                                        inputEmail.style.border = '1px solid red';
                                                        inputEmail.placeholder = '정확한 이메일을 입력해 주세요';
                                                    }
                                                }).catch(() => { // 못가져 왔을 경우 예외처리
                                                    console.log('유저 정보 요청 실패')
                                                })
                                            }
                                        } else {
                                            inputEmail.style.border = '2px solid blue';
                                        }
                                    }}
                                >추가
                                </button>
                            </div>
                        </div>

                        <br/><br/>
                        <button
                            type="submit"
                            className="ok-common"
                        >
                            {editing ? '수정' : '생성'}
                        </button>
                        <br/><br/>
                        <input
                            className="cancel-common"
                            type="button"
                            value="취소"
                            onClick={() => editing ? navigate('/project/dashboard') : navigate('/project')}
                        />
                        <br/><br/>
                        {editing && <input
                            className="del-common"
                            type="button"
                            value="삭제"
                            onClick={() => {
                                // 프로젝트 삭제
                                axios.delete(`/api/project/${localStorage.getItem('projectNum')}`).then(() => {
                                    navigate('/project');
                                    addToast({
                                        text: title + ' 프로젝트 삭제됨'
                                    });
                                }).catch(() => {
                                    console.log('프로젝트 삭제 실패')
                                })
                            }}
                        />}
                    </div>
                </div>
            </form>
        )

    } else {
        return (
            <div className="container-common">
                <div>
                    <h1>프로젝트 나가기</h1>
                    <button className="del-common" onClick={() => {
                        // 프로젝트 나가기
                        axios.delete(`/api/project/withdrawal/${localStorage.getItem('projectNum')}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then(() => {
                            navigate('/project');
                            addToast({
                                text: title + ' 프로젝트에서 나감'
                            });
                        }).catch(() => {
                            console.log('프로젝트 나가기 실패');
                        })
                    }}>나가기
                    </button>
                </div>
            </div>
        )
    }


}

ProjectForm.propType = {
    editing: propTypes.bool
}
ProjectForm.defaultProps = {
    editing: false
}

export default ProjectForm;