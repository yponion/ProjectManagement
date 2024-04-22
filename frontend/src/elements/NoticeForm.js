import {useEffect, useState} from "react";
import propTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import useToast from "../hooks/toast";

const NoticeForm = ({editing}) => {
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const [title, setTitle] = useState('')
    const {addToast} = useToast();

    useEffect(() => {
        if (editing) {
            axios.get(`/api/project/notice/${localStorage.getItem('noticeNum')}`).then((res) => {
                setTitle(res.data.notice.title);
                setContent(res.data.notice.content);
            }).catch(() => {
                console.log('글 정보 가져오지 못함')
            })
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) { // 수정된 게시글 업데이트 todo
            axios.put(`/api/project/notice/edit/${localStorage.getItem('noticeNum')}`,
                {title, content},
                {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then(() => {
                navigate('/project/dashboard/post');
                addToast({
                    text: title + ' 수정됨'
                })

            }).catch(() => {
                console.log('게시글 업데이트 실패')
            })
        } else {
            axios.post(`/api/project/notice/create/${localStorage.getItem('projectNum')}`, {
                title,
                content
            }, {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}}).then(() => {
                navigate('/project/dashboard');
                addToast({
                    text: title + ' 등록됨'
                })

            }).catch(() => {
                console.log('글쓰기 post error')
            })

        }
    }

    return (
        <div className="container-common">
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>게시물 {editing ? '수정' : '등록'}</h1>
                    <input
                        required
                        placeholder="제목"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                    /><br/><br/>
                    <textarea
                        required
                        placeholder="내용"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                        rows="20"
                    />
                    <br/><br/>
                    <button type="submit" className="ok-common">{editing ? '수정' : '등록'}</button>
                    <br/><br/>
                    <button type="button" className="cancel-common"
                            onClick={() => {
                                editing ? navigate('/project/dashboard/post') :
                                    navigate('/project/dashboard')
                            }}>취소
                    </button>
                </form>
            </div>
        </div>
    )
}

NoticeForm.propType = {
    editing: propTypes.bool,
}

NoticeForm.defaultProps = {
    editing: false,
}

export default NoticeForm;