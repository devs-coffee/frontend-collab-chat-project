import React from 'react';
import Snackbar from '@mui/material/Snackbar/Snackbar';

export interface MessageErrorProps {
	setCallbackClose: () => React.SetStateAction<any>;
	open: boolean;
	message: string;
}


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