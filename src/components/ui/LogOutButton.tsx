"use client";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";

// taking styles 
export default function LogOutButton({className=""}:{className?:string}) {
	//const params = new URLSearchParams(window.location.search);

	const { signOut } = useClerk();
	return (

        
		<Button
            className={cn(className)}
			onClick={() => signOut({ redirectUrl: '/' })} // redirect to a sign in page
		>
			Log Out
		</Button>
	);
}
