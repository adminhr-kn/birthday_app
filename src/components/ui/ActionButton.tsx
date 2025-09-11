"use client";

import { useState, useEffect } from "react";

// children whats inside Actionbutton, props type,clasname etc
export function ActionButton({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {

	// how many seconds till redirect
	const [countdown, setCountdown] = useState<number | null>(null);

	useEffect(() => {
		if (countdown === null) return;

		// if countdown ended we redirect
		if (countdown === 0) {
			window.location.href = "/admin"; // redirecting
		} else {
			// we set a timer to decrease countdown every second
			const timer = setTimeout(() => {
				setCountdown((prev) => (prev !== null ? prev - 1 : null));
			}, 1000);

			// clean up function to clear the timer when the component unmounts
			// doesnt allow to have multiple timers running
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	return (
		<div>
			<button
				{...props}
				onClick={(e) => {
					props.onClick?.(e);
					setCountdown(5); // starting the countdown
				}}>
				{children}
			</button>

			{/* coundtdown message  */}
			{countdown !== null && (
				<p className="text-green-400 mt-1">
					✅ Changes were done. You will be redirected to the main site in{" "}
					<span className="font-bold">{countdown}</span> seconds...
				</p>
			)}
		</div>
	);
}
