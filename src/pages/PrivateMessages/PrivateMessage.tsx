import { useParams } from "react-router-dom";
import { MessageList } from "../../components";

const PrivateMessages = () => {
    const urlSearchParams = useParams();
    return (
        <MessageList messages={[]}/>
    )
}

export default PrivateMessages;