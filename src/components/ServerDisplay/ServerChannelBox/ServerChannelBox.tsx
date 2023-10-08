import { Stack } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

import { ChannelBase } from "../../../interfaces/IChannel.base";

import "./ServerChannelBox.scss";

interface ServerChannelBoxProps {
	channels: Array<ChannelBase>;
	admin: boolean;
	setMainContent: React.Dispatch<React.SetStateAction<string>>;
	setChannelId: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * @param channels - A array of channels.
 * @param admin - A boolean indicating whether the user is an admin.
 * @param setChannelId - A callback function that updates the channel id.
 * @param setMainContent - A callback function that updates to "updateChannel" when the settings are clicked. 
 * @returns JSX.Element - The ServerChannelBox component displaying channels
 */
export function ServerChannelBox(props: ServerChannelBoxProps): JSX.Element {

	return (
		<div className="channelsbox">
			<h4>
				Channels :
				{props.channels && props.admin && (
					<SettingsIcon fontSize={"inherit"} onClick={() => props.setMainContent('updateChannel')} />
				)}
			</h4>
			<Stack className="stack" spacing={0.8}>
				{props.channels && (
					props.channels.map((channel: ChannelBase) => (
						<span className="items" key={`span-${channel.id}`}>
							<p className="title" onClick={() => props.setChannelId(channel.id)}>{channel.title}</p>
						</span>
					))
				)}
			</Stack>
		</div>
	)

}