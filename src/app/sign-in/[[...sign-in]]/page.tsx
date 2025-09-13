"use client";

import { SignIn, useUser } from "@clerk/nextjs";

import { useEffect } from "react";

// were in folder [[...sign-in]] so this file takes all /sign-in and sign-in/anything routes

export default function Page() {
	// useUser hook is from clerk and gives the user data about logged user

	// isLoaded gives info about the session is loaded or not
	// user is just an object with various info about the user
	const { user, isLoaded } = useUser();

	useEffect(() => {
		// when clerk inicialized and we have a user do a refresh

		// untill the clerk is loaded we do nothing
		// the rest will show when this is done, the loaded is true
		if (!isLoaded) return;

		// if user exists we proceed, which means if user is logged in
		// if not logged in we just stay on the sign in page
		if (user) {
			try {
				// EXAMPLE https://moja-aplikacja.com/sign-in?redirect_url=/contracts

				// everything after ? in url

				// redirect_url=/contracts
				const params = new URLSearchParams(window.location.search);

				// we take the value from redirect_url or if not present just /

				// params.get("redirect_url"); => "/contracts"

				// if there is no redirect_url in params we just go to homepage
				// everything after redirect_url if nothing then homepahge
				const target = params.get("redirect_url") || "/";

				// we check if current page is the same as target
				if (
					//URL: https://moja-aplikacja.com/sign-in?redirect_url=/contracts

					// here window.location.pathname is /sign-in
					window.location.pathname ===
					// URL: https://moja-aplikacja.com/sign-in?redirect_url=/contracts
					// window.location.origin === "https://moja-aplikacja.com"

					//new URL("/contracts", "https://moja-aplikacja.com")

					// pathname gives us just the path to contracts
					// so here it return /contracts
					new URL(target, window.location.origin).pathname
				) {
					// if we are not on the target page we do a complete refresh and redirect to target
					window.location.replace(target);
					return;
				}

				// force redirect and full refresh anyway

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
