import { useState } from "react";
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type messageHandler = {
    sendMessage: (message: string) => void,
    messageContent?: string
}

export function MessageEditor({ sendMessage, messageContent }: messageHandler) {


    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [messageToSend, setMessageToSend] = useState<string>(messageContent!);

    async function handleKeypress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            triggerSendMessage();
        }
    }

    function triggerSendMessage() {
        sendMessage(messageToSend);
        setMessageToSend('');
    }

    const onEditorStateChange = function (editorState: EditorState) {
        setEditorState(editorState);

        let message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setMessageToSend(message);
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
            />
            <button onClick={() => triggerSendMessage()}>Envoyer</button>
        </div>
    )
}