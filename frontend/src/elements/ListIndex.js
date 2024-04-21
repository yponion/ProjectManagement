import propTypes from "prop-types";

const ListIndex = ({isProject, isDashboard, isTask, project, dashboard, task, onClick}) => {

    return (
        <div
            className="project-container"
            onClick={onClick}
        >
            {isProject &&
                <>
                    <div>{project.title}</div>
                    <div>{project.kind}</div>
                    <div>{project.leader}</div>
                </>
            }
            {isDashboard &&
                <>
                    <div>{dashboard.title}</div>
                    <div>{dashboard.writer===null?'알수없음':dashboard.writer}</div>
                    <div>{dashboard.date}</div>
                </>
            }
            {isTask &&
                <>
                    <div>{task.title}</div>
                    <div>{task.memo}</div>
                    <div>{task.start}</div>
                    <div>{task.end}</div>
                </>
            }

        </div>
    )
}

ListIndex.propTypes = {
    isProject: propTypes.bool,
    isDashboard: propTypes.bool,
    isTask: propTypes.bool,
    project: propTypes.object,
    dashboard: propTypes.object,
    task: propTypes.object,
}
ListIndex.defaultProps = {
    isProject: false,
    isDashboard: false,
    isTask: false,
}

export default ListIndex;