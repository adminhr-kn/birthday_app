"use server";

import { checkRole } from "../../utils/role";

import { clerkClient } from "@clerk/nextjs/server";

// we take the data from the form 
// the id and the role of a user
export async function setRole(formData: FormData) {

	// we connect with client
	const client = await clerkClient();

	// Check that the user trying to set the role is an admin
	if (!checkRole("admin")) {
		// return { message: "Not Authorized" };
	}

	try {
		//we update the user based on the id, change his role
		const res = await client.users.updateUserMetadata(
			formData.get("id") as string,
			{
				publicMetadata: { role: formData.get("role") },
			}
		);
		// return { message: res.publicMetadata };
	} catch (err) {
		// return { message: err };
	}
}

export async function removeRole(formData: FormData) {
	const client = await clerkClient();

	try {
		const res = await client.users.updateUserMetadata(
			formData.get("id") as string,
			{
				publicMetadata: { role: null },
			}
		);
		// return { message: res.publicMetadata };
	} catch (err) {
		// return { message: err };
	}
}
