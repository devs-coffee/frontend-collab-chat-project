import { useState } from "react";

type messageHandler = {
    sendMessage: (message:string) => void
}

export default function MessageEditor({sendMessage}: messageHandler) {

    const [messageToSend, setMessageToSend] = useState<string>('');

    async function handleKeypress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            triggerSendMessage();
        }
    }

    function triggerSendMessage () {
        sendMessage(messageToSend);
        setMessageToSend('');
    }
    
    return (
        <div>
            <input onKeyUp={handleKeypress} onChange={(e) => setMessageToSend(e.target.value)} placeholder='Ecris ton message' type='text' value={messageToSend} />
            <button onClick={() =>triggerSendMessage()}>Envoyer</button>
        </div>
    )
}