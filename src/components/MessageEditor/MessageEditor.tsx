import { useState, useEffect } from "react";
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'

import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MessageEditor.scss';

type messageHandler = {
    sendMessage: (message: string) => void,
    messageContent?: string
}

export function MessageEditor({ sendMessage, messageContent }: messageHandler) {

    const [messageToSend, setMessageToSend] = useState<string>(messageContent!);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if (messageContent) {
            const blocksFromHtml = htmlToDraft(messageContent)
            const { contentBlocks, entityMap } = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap
            )
            setEditorState(EditorState.createWithContent(contentState))
        } else {
            setEditorState(EditorState.createEmpty())
        }
    }, [messageContent])


const handleKeypress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        triggerSendMessage();
    }
}

const triggerSendMessage = (): void => {
    sendMessage(messageToSend);
    setMessageToSend('');
    setEditorState(EditorState.createEmpty());
}

const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    let message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setMessageToSend(message);
};

return (
    <div className="message-editor" onKeyDown={handleKeypress} >
        <Editor

            wrapperClassName="wrapper"
            editorClassName="editor"
            toolbarClassName={"toolbar"}
            editorState={editorState}
            placeholder="Envoyez votre messsage..."
            onEditorStateChange={onEditorStateChange}
        />
    </div>
)

}