import {useEffect, useState} from "react";
import propTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import useToast from "../hooks/toast";
import {dateFormat} from "../utils/dateFormat";

const TaskForm = ({editing}) => {
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const navigate = useNavigate();

    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');
    const {addToast} = useToast();

    useEffect(() => {
        axios.get(`/api/project/${localStorage.getItem('projectNum')}`).then((res) => {
            setProjectStart(res.data.project.start);
            setProjectEnd(res.data.project.end);
        }).catch(() => {
            console.log('프로젝트 시작일 마감일 가져오지 못함');
        });

        if (editing) { // 수정 페이지일 경우에 값을 가져와서 띄워줌
            axios.get(`/api/project/task/${localStorage.getItem('taskNum')}`)
                .then((res) => {
                    setTitle(res.data.task.title);
                    setMemo(res.data.task.memo);
                    setStart(dateFormat(res.data.task.start));
                    setEnd(dateFormat(res.data.task.end));
                }).catch(() => {
                console.log('작업 내용 가져오지 못함')
            })
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) { // 작업 수정
            axios.put(`/api/project/task/edit/${localStorage.getItem('taskNum')}`, {
                title,
                memo,
                start,
                end
            }).then(() => {
                navigate('/project/task');
                addToast({
                    text: title + ' 작업 수정됨'
                })
            }).catch(() => {
                console.log('작업 내용 수정 실패')
            })
        } else { // 작업 등록
            axios.post(`/api/project/task/create/${localStorage.getItem('projectNum')}`, {
                title,
                memo,
                start,
                end
            }).then(() => {
                navigate('/project/task');
                addToast({
                    text: title + ' 작업 추가됨'
                })

            }).catch(() => {
                console.log('작업 등록 오류')
            })
        }
    }

    return (
        <div className="container-common">
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>작업 {editing ? '수정' : '등록'}</h1>
                    <label>작업명</label>
                    <input required type="text" value={title} onChange={(e) => {
                        setTitle(e.target.value)
                    }}/>
                    <br/><br/>
                    <label>메모</label>
                    <textarea
                        style={{
                            borderRadius: "5px",
                            border: "1px solid black",
                            height: "100px"
                        }}
                        value={memo}
                        onChange={(e) => {
                            setMemo(e.target.value)
                        }}
                    />
                    <br/><br/>
                    <label>시작일</label>
                    <input required type="date" value={start} onChange={(e) => {
                        setStart(e.target.value)
                    }} min={projectStart} max={projectEnd < end ? projectEnd : end}/>
                    <br/><br/>
                    <label>마감일</label>
                    <input required type="date" value={end} onChange={(e) => {
                        setEnd(e.target.value)
                    }} min={projectStart > start ? projectStart : start} max={projectEnd}/>
                    <br/><br/><br/>
                    <button
                        className="ok-common"
                        type="submit"
                    >{editing ? '수정' : '등록'}</button>
                    <br/><br/>
                    <button type="button" className="cancel-common" onClick={() => navigate('/project/task')}>취소
                    </button>
                    <br/><br/>
                    {editing && <button type="button" className="del-common" onClick={() => {
                        // 작업 삭제
                        axios.delete(`/api/project/task/delete/${localStorage.getItem('taskNum')}`).then(() => {
                            navigate('/project/task');
                            addToast({
                                text: title + ' 작업 삭제됨'
                            })
                        }).catch(() => {
                            console.log('작업 삭제 실패')
                        })
                    }}>삭제
                    </button>}
                </form>
            </div>
        </div>
    )
}

TaskForm.propType = {
    editing: propTypes.bool,
}

TaskForm.defaultProps = {
    editing: false,
}

export default TaskForm;