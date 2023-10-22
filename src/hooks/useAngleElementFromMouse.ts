import { useEffect, useState } from "react";

/**
 * 
 * @param element a useRef element 
 * @returns The angle from the origin of the element and the mouse position relative to the coordinate X & Y
 */
export function useAngleElementFromMouse(element: React.MutableRefObject<HTMLDivElement>) {

	const [angleState, setAngleState] = useState<number>(0);

	useEffect(() => {
		const setFromEvent = (e: MouseEvent) => {

			// Get origin of element X & Y
			const elementRect = element.current.getBoundingClientRect()
			const elementX = (elementRect.left + elementRect.right) / 2
			const elementY = (elementRect.top + elementRect.bottom) / 2

			// Calcul the angle from the mouse position
			const opposite = e.clientX - elementX;
			const adjascent = e.clientY - elementY;
			let angle: number = Math.round(Math.atan(Math.abs(opposite) / Math.abs(adjascent)) * 180 / Math.PI);

			if (opposite > 0) {
				if (adjascent > 0) {
					angle = 90 - angle;
				} else {
					angle += 270;
				}
			}
			if (opposite <= 0) {
				if (adjascent > 0) {
					angle += 90;
				} else {
					angle = 270 - angle;
				}
			}

			// Update angle 
			setAngleState(angle);
		};
		window.addEventListener("mousemove", setFromEvent);


		return () => {
			window.removeEventListener("mousemove", setFromEvent);
		};
	}, [element]);

	return [angleState] as const;
}