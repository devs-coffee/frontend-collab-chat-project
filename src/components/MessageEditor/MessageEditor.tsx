import { useState } from "react";
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useMessageEditorState } from "../../hooks/useMessageEditorState";
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MessageEditor.scss';

type messageHandler = {
    sendMessage: (message: string) => void,
    messageContent?: string
}

export function MessageEditor({ sendMessage, messageContent }: messageHandler) {

    const [messageToSend, setMessageToSend] = useState<string>(messageContent!);
    const [editorState, setEditorState] = useMessageEditorState(messageContent ? messageContent : undefined);
    const [editorFocus, setEditorFocus] = useState<boolean>(false);

    const handleKeypress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            triggerSendMessage();
        }
    }

    const triggerSendMessage = async (): Promise<void> => {
        sendMessage(messageToSend);
        setMessageToSend('');
        await setEditorState(EditorState.createEmpty());
        document.getElementById('wrapper')?.focus();
    }

    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);
        let message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setMessageToSend(message);
    };

    return (
        <>
            <div tabIndex={-1} id="wrapper"></div>
            <div className="message-editor" onKeyDown={handleKeypress} >
                <Editor
                    onFocus={() => setEditorFocus(true)}
                    onBlur={() => setEditorFocus(false)}
                    wrapperClassName="wrapper"
                    editorClassName="editor"
                    toolbarClassName={editorFocus || messageContent ? "toolbar-focus" : "toolbar"}
                    editorState={editorState}
                    placeholder="Envoyez votre messsage..."
                    onEditorStateChange={onEditorStateChange}
                />
            </div>
        </>
    )

}