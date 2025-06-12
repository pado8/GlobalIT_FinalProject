import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/community/ModifyComponent";

const ModifyPage = () => {
    const { pno } = useParams()

    return (
        <div id="ModifyPage">
            <div>
                Todo Modify Page
            </div>
            <ModifyComponent pno={pno} />
        </div>
    );
}

export default ModifyPage;
