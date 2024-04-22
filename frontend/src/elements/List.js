import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ListIndex from "./ListIndex";
import propTypes from "prop-types";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setNoticeNum, setProjectNum, setTaskNum} from "../store/numSlice";
import {dateFormat} from "../utils/dateFormat";

const List = ({isProject, isDashboard, isTask}) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');

    const [oriProList, setOriProList] = useState([]);
    const [proList, setProList] = useState([]);

    const [dashboardList, setDashboardList] = useState([]);

    const [oriTaskList, setOriTaskList] = useState([]);
    const [taskList, setTaskList] = useState([]);

    const dispatch = useDispatch();
    const [projectName, setProjectName] = useState('');
    const [projectDate, setProjectDate] = useState('');


    useEffect(() => {
        if (isProject) {
            axios.get('/api/project/', {headers: {'Authorization': `Bearer ${localStorage.getItem('isLoggedIn')}`}})
                .then((res) => {
                    setProList(res.data.projects);
                    setOriProList(res.data.projects)
                })
                .catch(() => {
                    console.log('프로젝트 리스트 가져오지 못함');
                });
        } else if (isDashboard) {
            axios.get(`/api/project/${localStorage.getItem('projectNum')}`).then((res) => {
                setProjectName(res.data.project.title);
                setProjectDate(`${dateFormat(res.data.project.start)} ~ ${dateFormat(res.data.project.end)}`);

            }).catch(() => {
                console.log('대시보드 정보 가져오지 못함');
            });
            axios.get(`/api/project/notice/list/${localStorage.getItem('projectNum')}`).then((res) => {
                setDashboardList(res.data.notices);
            }).catch(() => {
                console.log('대시보드 리스트 가져오지 못함')
            })
        } else if (isTask) {
            axios.get(`/api/project/task/list/${localStorage.getItem('projectNum')}`).then((res) => {
                setTaskList(res.data.tasks);
                setOriTaskList(res.data.tasks);
            }).catch(() => {
                console.log('작업 리스트 가져오지 못함')
            })
        }
    }, []);

    const renderProject = () => {
        return proList.map((projects) => {
            return (
                <ListIndex
                    key={projects._id}
                    isProject={true}
                    project={{
                        title: projects.title,
                        kind: projects.type,
                        leader: projects.leader
                    }}
                    onClick={() => {
                        navigate(`/project/dashboard`)
                        dispatch(setProjectNum(projects._id)); // 프로젝트 받아온 번호로 지정
                    }}
                />
            )
        })
    }

    const renderDashboard = () => {
        return dashboardList.map((notices) => {
            return (
                <ListIndex
                    key={notices._id}
                    isDashboard={true}
                    dashboard={{
                        title: notices.title,
                        writer: notices.name,
                        date: dateFormat(notices.createdAt)
                    }}
                    onClick={() => {
                        dispatch(setNoticeNum(notices._id));
                        navigate('/project/dashboard/post')
                    }}
                />

            )
        })
    }

    const renderTask = () => {
        return taskList.map((task) => {
            return (
                <ListIndex
                    key={task._id}
                    isTask={true}
                    task={{
                        title: task.title,
                        memo: task.memo,
                        start: dateFormat(task.start),
                        end: dateFormat(task.end),
                    }}
                    onClick={() => {
                        dispatch(setTaskNum(task._id));
                        navigate('/project/task/edit');
                    }} // 작업 수정으로ㄱㄱ
                />
            )
        })

    }

    const onSearch = () => {
        if (isProject) {
            setProList(oriProList.filter(item => item.title.includes(searchText)));
        } else if (isTask) {
            setTaskList(oriTaskList.filter(item => item.title.includes(searchText)));
        }
    }
    return (
        <div>
            {(isProject || isTask) &&
                <div className="project-search">
                    <h2>{isProject ? "프로젝트" : isTask ? "작업" : ""}</h2>
                    <input
                        type='text'
                        placeholder="검색"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyUp={onSearch}
                    />
                </div>
            }
            {isDashboard &&
                <div className="project-search">
                    <h2>{projectName}</h2>
                    <p>{projectDate}</p>
                </div>
            }
            <br/>
            <div
                style={{
                    cursor: "default",
                    backgroundColor: "initial",
                    fontWeight: "bold"
                }}
                className="project-container"
            >
                {isProject ?
                    <>
                        <div>이름</div>
                        <div>유형</div>
                        <div>리더</div>
                    </>
                    : isDashboard ?
                        <>
                            <div>제목</div>
                            <div>작성자</div>
                            <div>작성일</div>
                        </>
                        : isTask ?
                            <>
                                <div>작업</div>
                                <div>메모</div>
                                <div>시작일</div>
                                <div>마감일</div>
                            </>
                            : ""
                }
            </div>
            {isProject ? renderProject()
                : isDashboard ? renderDashboard()
                    : isTask ? renderTask()
                        : ""
            }

        </div>
    )
}
List.propTypes = {
    isProject: propTypes.bool,
    isDashboard: propTypes.bool,
    isTask: propTypes.bool,
}
List.defaultProps = {
    isProject: false,
    isDashboard: false,
    isTask: false,
}

export default List;