import { NextResponse } from "next/server";

export async function GET() {
	// fetching
	const res = await fetch("https://api.clerk.dev/v1/users", {
        // clerk by default wants u to put the secret key in the header
        // and the content type
        // bearer is a token, here a secret key
        // headers are additional info added to the request
		headers: {
			Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
	});

	// checking
	if (!res.ok) {
        const text = await res.text();
		console.error("Clerk API error:", res.status, text);
		throw Error("Filed to fetch data form clerk");
	}

	// parsing
	const users = await res.json();

    // returning json data
	return NextResponse.json(users);
}
