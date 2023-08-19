import { useEffect, useState } from "react";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from 'html-to-draftjs';

/**
 * @param messageContent A message content
 * @returns A hook which return two value
 * - editorState A state with value of the given messageContent
 * - setEditorState A React.dispatch<SetStateAction<T>> which update the state of the editorState
 */
export function useMessageEditorState(messageContent?: string) {
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

	return [editorState, setEditorState] as const;
}