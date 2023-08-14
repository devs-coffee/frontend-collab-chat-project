import { useParams } from "react-router-dom";
import { MessageList } from "../../components";

export const PrivateMessages = () => {
    const urlSearchParams = useParams();
    return (
        <MessageList messages={[]}/>
    )
}

