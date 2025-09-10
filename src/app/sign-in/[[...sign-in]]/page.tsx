"use client";

import { SignIn, useUser } from "@clerk/nextjs";

import { useEffect } from "react";

export default function Page() {
	const { user, isLoaded } = useUser();

	useEffect(() => {
		// when clerk inicialized and we have a user do a refresh

		if (!isLoaded) return;

		if (user) {
			try {
				const params = new URLSearchParams(window.location.search);

				const target = params.get("redirect_url") || "/";

				// if we are on a target do nothing

				if (
					window.location.pathname ===
					new URL(target, window.location.origin).pathname
				) {
					window.location.replace(target);
					return;
				}

				// force redirect i full refresh

				window.location.replace(target);
			} catch (error) {
				//fallback
				window.location.reload();
			}
		}
	}, [isLoaded, user]);

	return (
		<div className="flex justify-center items-center h-screen">
			<SignIn />
		</div>
	);
}
