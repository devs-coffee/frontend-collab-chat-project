import { useEffect, useState } from "react";

/**
 * A hook that set up the dark mode or not if selected in the preference system or localstorage.
 * @returns A custom hook with his state and his setState function. 
 * @example const [darkMode, setDarkMode] = useDarkMode();
 */
export function useDarkMode() {
	const [darkMode, setDarkMode] = useState<boolean>(false);

	const storedTheme: string | null = localStorage.getItem("theme");
	const prefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

	useEffect(() => {
		if (!storedTheme && prefersDark) setDarkMode(true);
		if (!storedTheme && !prefersDark) setDarkMode(false);
		if (storedTheme) { storedTheme === "dark" ? setDarkMode(true) : setDarkMode(false) }
	}, [])


	useEffect(() => {
		localStorage.setItem("theme", darkMode ? "dark" : "light");
		document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
	}, [darkMode])

	return [darkMode, setDarkMode] as const;
}