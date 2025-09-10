"use client";

import { SignIn, useUser } from "@clerk/nextjs";

import { useEffect } from "react";

export default function Page() {
	const { user, isLoaded } = useUser();

	useEffect(() => {
		// kiedy Clerk zainicjalizuje się i mamy usera -> wykonaj redirect/refresh
		if (!isLoaded) return;

		if (user) {
			try {
				const params = new URLSearchParams(window.location.search);
				// Clerk middleware zwykle dołącza redirect_url (np. /admin)
				const target = params.get("redirect_url") || "/";

				// jeśli już jesteśmy na target, nic nie rób
				if (
					window.location.pathname ===
					new URL(target, window.location.origin).pathname
				) {
					// opcjonalnie: replace żeby nie dodawać entry do historii
					window.location.replace(target);
					return;
				}

				// wymuś przejście (i pełne odświeżenie) — usuwa problem z brakiem sesji w klientach
				window.location.replace(target);
			} catch (e) {
				// fallback: zwykły refresh
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
