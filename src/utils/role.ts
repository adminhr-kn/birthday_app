import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
	const { sessionClaims } = await auth();
  // make sure it is fresh
  
	console.log("sessionclaims:", sessionClaims);
	return sessionClaims?.metadata.role === role;
};
