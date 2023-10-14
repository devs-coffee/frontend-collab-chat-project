
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Logo.scss";
import { cp } from "fs";
const imageSrc = require('./Logo.png')


export function Logo(): JSX.Element {

	const [classPosition, setClassPosition] = useState<string>("");

	useEffect(() => {
		const setFromEvent = (e: MouseEvent) => {
			console.log(e.clientX);
			console.log(e.clientY);

			if (e.clientX < 420 && e.clientY < 55) {
				setClassPosition('--top')
			}

			if (e.clientX > 420 && e.clientY < 200) {
				setClassPosition('--right')
			}

			if (e.clientX > 420 && e.clientY > 200) {
				setClassPosition('--bottom-right')
			}

			if (e.clientX < 420 && e.clientY > 200) {
				setClassPosition('--bottom')
			}

			if (e.clientX <420 && e.clientY > 55 && e.clientY < 200) {
				setClassPosition('--center');
			}
		};
		window.addEventListener("mousemove", setFromEvent);


		return () => {
			window.removeEventListener("mousemove", setFromEvent);
		};
	}, []);


	return (
		<div className="logo">
			<Link to="/">
				<div className="logo__picture">
					<img src={imageSrc} alt="logo openChatRooms" />
					<div className={`logo__picture__lefteye${classPosition}`}></div>
					<div className={`logo__picture__righteye${classPosition}`}></div>
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