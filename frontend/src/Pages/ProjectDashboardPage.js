import {useNavigate} from "react-router-dom";
import List from "../elements/List";

const ProjectDashboardPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <List isDashboard={true}/>
            <div
                className="project-add"
                onClick={() => navigate('/project/dashboard/create')}
                style={{
                    fontFamily:"Arial"
                }}
            >
                +
            </div>
        </div>


    )
}

export default ProjectDashboardPage;