import { Avatar } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import "./ServerHeading.scss";

interface ServerHeadingProps {
	title: string;
	admin: boolean;
	picture?: string;
	setIsUpdatingServer: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @param {string} title - The title to be displayed.
 * @param {boolean} admin - A boolean indicating whether the user is an admin.
 * @param {string} picture - The picture to be displayed.
 * @param {function} setIsUpdatingServer - A callback function that updates to true when the settings are clicked. 
 * @returns {JSX.Element} - The ServerHeading component displaying server details.
 */
export function ServerHeading(props: ServerHeadingProps): JSX.Element {

	return (
		<div className="heading">
			{props.picture ?
				(<Avatar alt="avatar server" src={props.picture} />)
				:
				(<Avatar>{props.title.substring(0, 1).toUpperCase()}</Avatar>)
			}
			<h3>{props.title}</h3>
			{props?.admin &&
				<SettingsIcon onClick={() => props.setIsUpdatingServer(true)} />
			}
		</div>
	)

}