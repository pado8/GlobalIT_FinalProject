import { useParams } from "react-router-dom";
import ReadComponent from "../../components/community/ReadComponent";

const ReadPage = () => {
    const { pno } = useParams()

    return (
        <div id="readPage">
            <div>
                community Read Page Component {pno}
            </div>
            <ReadComponent key={pno} pno={Number(pno)}></ReadComponent>
        </div>
    );
}

export default ReadPage;