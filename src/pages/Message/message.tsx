import { useParams } from "react-router-dom";
import Message from "../../components/Message/message"

const MessageView = () => {
    const urlSearchParams = useParams();
    return (
        <Message channelId={urlSearchParams?.channelId!}/>
    )
}

export default MessageView;