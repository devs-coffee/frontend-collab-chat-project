import React from 'react';
import Snackbar from '@mui/material/Snackbar/Snackbar';

export interface MessageErrorProps {
	setCallbackClose: () => React.SetStateAction<any>;
	open: boolean;
	message: string;
}

/**
 * @param open A boolean indicating whether the message should appear on the screen or not.
 * @param setCallbackClose A function to call when the message is close or a click is away of the message.
 * @param message The message to display.
 * @returns A Component that represents a message error box.
 */
export function MessageError(props: MessageErrorProps): JSX.Element {

	const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		props.setCallbackClose();
	}
	return (
		<Snackbar
			open={props.open}
			autoHideDuration={4000}
			onClose={handleToastClose}
			message={props.message}
		/>
	);

}