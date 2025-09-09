import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(
	async (auth, req) => {
		// jeśli to nie public route -> wymuś auth
		if (!isPublicRoute(req)) {
			// najprostsze i zgodne z dokumentacją:
			await auth.protect();
			// ALBO (jawny redirect na sign-in, jeśli wolisz):
			//const { userId, redirectToSignIn } = await auth();
			//if (!userId) return redirectToSignIn();
			// redirectToSignIn() wykorzysta NEXT_PUBLIC_CLERK_SIGN_IN_URL z .env
		}
	},
	{ debug: process.env.NODE_ENV === "development" }
);

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
