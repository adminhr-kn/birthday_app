import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


// NEXT .JS ALWAYS CHECKS MIDDLEWARE FIRST

// every path like that will be public - no need 
// for every request that goes through matcher next.js start clerkMiddleware
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)","/api(.*)"]);

export default clerkMiddleware(


	// auth is an object that can check session, make smth protected, do redirect etc
	// req is a request object, we can check pathname, headers, cookies etc
	async (auth, req) => {
		
		// if the route is not public we need to protect it so the user is redirect to the sign in page
		
		if (!isPublicRoute(req)) {
			
			// redirect to sign-in if there is no authorisation, made by clerk
			// if user wants to go to /admin auth,protect will automaticalyy add the redirect_url/admin 
			// same with other pages redirects by itself based on what user clicked
			await auth.protect();
			
		}
	},
	// debugging process in clerk middleware, allows to see what is going on in terminal
	{ debug: process.env.NODE_ENV === "development" }
);

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
