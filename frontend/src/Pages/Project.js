import {useNavigate} from "react-router-dom";
import List from "../elements/List";

const Project = () => {
    const navigate = useNavigate();
    return (
        <div>
            <List isProject={true}/>
            <div
                className="project-add"
                onClick={() => navigate('/project/create')}
                style={{
                    fontFamily:"Arial"
                }}
            >
                +
            </div>
        </div>
    );
};
export default Project