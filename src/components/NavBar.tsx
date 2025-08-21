"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function NavBar() {
	// a hook that lets you read the current URL'S pathname
	const pathname = usePathname();

	const linkStyle = (path: string) => {
		return pathname === path ? "font-bold text-blue-500" : "text-gray-300";
	};

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink className={linkStyle("/")} asChild>
						<Link href="/" passHref>
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						className={linkStyle("/emp_contracts")}
						asChild>
						<Link href="/emp_contracts" passHref>
							Employee Contracts
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>

		// <nav className='flex flex-col items-center justify0between p-4 border-b bg-white dark:bg-gray-900'>

		//     <div className='flex gap-4'>

		//         <Link href="/" className={linkStyle("/")}>Home</Link>
		//         <Link href="/fetched_data" className={linkStyle("/fetched_data")}>Fetched Data</Link>

		//     </div>

		// </nav>
	);
}
