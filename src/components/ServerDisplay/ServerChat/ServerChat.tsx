import { ChannelBase } from "../../../interfaces/IChannel.base";
import { ChannelManager, MessageBox } from "../..";

import './ServerChat.scss';

interface ServerChatProps {
	content: string;
	channelID: string;
	currentUser: boolean;
	channels: Array<ChannelBase>;
	avoidManagingChannel: () => void;
}

export function ServerChat(props: ServerChatProps): JSX.Element {

	return (
		<div className="chat">
			{props.content === 'chat' ? (
				<>
					<h4>Chat-box</h4>
					{props.channelID && <MessageBox channelId={props.channelID} canUserPost={props.currentUser} key={props.channelID} />}
				</>
			) : (
				<ChannelManager channels={props.channels} avoidManaging={props.avoidManagingChannel} />
			)}
		</div>
	)

}