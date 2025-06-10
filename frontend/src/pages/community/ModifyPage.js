import { useNavigate } from "react-router-dom";
const ModifyPage = ({ pno }) => {
    const navigate = useNavigate()
    const moveToRead = () => { navigate({ pathname: `/community/read/${pno}` }) }
    const moveToList = () => { navigate({ pathname: `/community/list` }) }
    return (
        <div id="modifyPage"> community Modify Page </div>
    );
}
export default ModifyPage;
