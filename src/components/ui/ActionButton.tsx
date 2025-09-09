"use client";

import { useState, useEffect } from "react";

export function ActionButton({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [countdown, setCountdown] = useState<number | null>(null);

	useEffect(() => {
		if (countdown === null) return;

		if (countdown === 0) {
			window.location.href = "/admin"; // redirecting
		} else {
			const timer = setTimeout(() => {
				setCountdown((prev) => (prev !== null ? prev - 1 : null));
			}, 1000);

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

			{countdown !== null && (
				<p className="text-green-400 mt-1">
					✅ Changes were done. You will be redirected to the main site in{" "}
					<span className="font-bold">{countdown}</span> seconds...
				</p>
			)}
		</div>
	);
}
