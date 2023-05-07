import { useParams } from "react-router-dom";
import Message from "../../components/MessageList/MessageList"

const PrivateMessages = () => {
    const urlSearchParams = useParams();
    return (
        <Message channelId={urlSearchParams?.channelId!}/>
    )
}

export default PrivateMessages;