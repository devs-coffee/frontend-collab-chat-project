import { useParams } from "react-router-dom";
import Message from "../../components/Message/message"

const MessageViewer = () => {
    const urlSearchParams = useParams();
    return (
        <Message channelId={urlSearchParams?.channelId!}/>
    )
}

export default MessageViewer;