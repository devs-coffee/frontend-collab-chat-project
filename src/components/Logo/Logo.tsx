
import React from "react";
import { useAngleElementFromMouse} from "../../hooks/useAngleElementFromMouse";
import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Logo.scss";
const imageSrc = require('./Logo.png')


export function Logo(): JSX.Element {

	const leftEye = useRef() as React.MutableRefObject<HTMLDivElement>;
	const rightEye = useRef() as React.MutableRefObject<HTMLDivElement>;

	const [rotateLeftEye] = useAngleElementFromMouse(leftEye);
	const [rotateRightEye] = useAngleElementFromMouse(rightEye);

	return (

		<div className="logo">
			<Link to="/">
				<div className="logo__picture">
					<img src={imageSrc} alt="logo openChatRooms" />
					<div ref={leftEye} className={`logo__picture__lefteye`} style={{ transform: `rotate(${rotateLeftEye}deg)`}}></div>
					<div ref={rightEye} className={`logo__picture__righteye`} style={{ transform: `rotate(${rotateRightEye}deg)` }}></div>
				</div>
			</Link>
			<Link to="/">
				<div className="logo__text">
					OpenChatRooms
				</div>
			</Link>
		</div >
	)

}