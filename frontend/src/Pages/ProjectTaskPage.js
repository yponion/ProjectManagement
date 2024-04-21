
import {useNavigate} from "react-router-dom";
import List from "../elements/List";

const ProjectTaskPage = () =>{
    const navigate = useNavigate();
    return (
        <div>
            <List isTask={true}/>
            <div
                className="project-add"
                onClick={() => navigate('/project/task/create')}
                style={{
                    fontFamily:"Arial"
                }}
            >
                +
            </div>
        </div>

    )
}

export default ProjectTaskPage;