import React, { useEffect, useState } from 'react';
import axios from "axios";
import { setTaskNum } from "../store/numSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProjectTimelinePage = () => {
    const [projectName, setProjectName] = useState('');
    const [projectStart, setProjectStart] = useState('');
    const [projectEnd, setProjectEnd] = useState('');
    const [taskList, setTaskList] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/project/${localStorage.getItem('projectNum')}`).then((res) => {
            setProjectName(res.data.data.projectName);
            setProjectStart(res.data.data.startDate);
            setProjectEnd(res.data.data.lastDate);
        }).catch(e => {
            console.log('대시보드 정보 가져오지 못함');
        });

        axios.get(`/api/project/task/list/${localStorage.getItem('projectNum')}`).then((res) => {
            const sortedTasks = res.data.data.sort((a, b) =>
                new Date(a.startDate) - new Date(b.startDate)
            );
            setTaskList(sortedTasks);
        }).catch(e => {
            console.log('작업 리스트 가져오지 못함')
        })
    }, []);


    const oneDayTo10px = (input, scaleFactor = 1) => {
        const dif = new Date(projectEnd) / (1000 * 60 * 60 * 24) - new Date(projectStart) / (1000 * 60 * 60 * 24);
        return ((new Date(input) - new Date(projectStart)) / (1000 * 60 * 60 * 24)) * 10 * scaleFactor;
    }


    const ps = oneDayTo10px(projectStart);
    const pe = oneDayTo10px(projectEnd);
    const pl = pe - ps;

    const calculateMonthlyMarkers = (startDate, endDate) => {
        let markers = [];
        let currentDate = new Date(startDate);
        currentDate.setDate(1);

        while (currentDate <= new Date(endDate)) {
            markers.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return markers;
    }
    const monthlyMarkers = calculateMonthlyMarkers(projectStart, projectEnd);

    return (
        <>
            <div className="project-search">
                <h2>{projectName}</h2>
                <p>{projectStart} ~ {projectEnd}</p>
            </div>
            <div className="container-timeline">
                {monthlyMarkers.map((date, index) => (
                    <div
                        className="timeline-month-marker"
                        key={index}
                        style={{
                            left: `${oneDayTo10px(date) - ps}px`,
                            top: 0,
                            height: '100%'
                        }}
                    >
                        <span className="timeline-date-label">{date.toLocaleDateString()}</span>
                    </div>
                ))}
                {taskList.map((task, index) => {
                    const ts = oneDayTo10px(task.startDate) - ps;
                    const tl = oneDayTo10px(task.lastDate) - oneDayTo10px(task.startDate);

                    return (
                        <div
                            className="container-timeline-div"
                            key={index}
                            style={{
                                width: `${pl}px`,
                            }}
                        >
                            <div
                                className="container-timeline-div-div"
                                style={{
                                    width: `${tl}px`,
                                    left: `${ts}px`,
                                }}
                                onClick={() => {
                                    dispatch(setTaskNum(task.taskId));
                                    navigate('/project/task/edit');
                                }}
                            >
                                {task.content}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default ProjectTimelinePage;
