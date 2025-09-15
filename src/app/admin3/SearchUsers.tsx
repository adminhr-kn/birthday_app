"use client";

import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export const SearchUsers = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();

	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchedUsers = async () => {
			// fetching data from clerkUsers
			const res = await fetch("/api/clerkUsers");

			// need to do this like that since res is a promise and we need to wait for it to resolve ENITRELY
			//  before we can use it
			const data = await res.json();

			setUsers(data);
		};

		fetchedUsers();
	}, []);

	// we made a component out of it for reusability
	// when the fucntion is simple and we dont need props we use this
	function SearchForm() {
		return (
			<form
				// on submit we can search 4 users
				onSubmit={(e) => {
					// we dont do refresh of the page
					e.preventDefault();
					//we have access to all the infos in the form
					const form = e.currentTarget;
					//helper in js, gets all the inputs from the form
					// and makes an object out of it key value, here search-> whatever user typed
					const formData = new FormData(form);
					//we take the value from the form data
					const queryTerm = formData.get("search") as string;
					// now we push it to the url
					router.push(pathname + "?search=" + queryTerm);
				}}>
				<div className="flex flex-col gap-3">
					<label htmlFor="search" className="text-center ">
						Search for users
					</label>
					<input
						id="search"
						name="search"
						type="text"
						className="border-2 border-white"
					/>
					<button
						type="submit"
						className="bg-purple-700 rounded-md p-1 hover:bg-amber-100 hover:text-black transition duration-300">
						Submit
					</button>
				</div>
			</form>
		);
	}

	// when we need props we normally use this
	const DisplayUsers: React.FC<{ users: any[] }> = ({ users }) => {
		if (!users || users.length === 0) {
			return <p>Loading users...</p>;
		}

		return (
			<ul className="flex flex-col gap-2 ml-3 mr-3">
				{users.map((user: any) => (
					<li key={user.id}>{user.email_addresses?.[0]?.email_address}</li>
				))}
			</ul>
		);
	};

	return (
		<>
			<div className="flex flex-col w-auto lg:h-screen lg:flex-row lg:justify-between lg:mt-10 lg:p-4 lg:w-[70%]">
				{/* VERSION FOR MOBILE PHONES */}
				<div className=" lg:hidden">
					<div className=" flex flex-col text-white ml-3 mr-3 mt-7 p-4  rounded-md border border-white">
						<SearchForm />
					</div>
				</div>

				<div className="lg:hidden">
					<div className="flex flex-col mt-2 justify-center items-center text-center lg:gap-2 lg:mt-4">
						<p className="mb-2">A list of users</p>
						<DisplayUsers users={users} />
					</div>
				</div>

				<div className=" lg:hidden flex flex-col ">{children}</div>

				{/* VERSION FOR BIG SCREENS */}
				<div className="hidden lg:block">
					<Card>
						<div className=" flex flex-col text-white ml-3 mr-3 mt-7 p-4">
							<SearchForm />
						</div>
					</Card>
				</div>

				<div className="hidden lg:flex lg:h-auto lg:flex-row lg:flex-wrap lg:gap-4">
					{children}
				</div>

				<div className="hidden lg:block">
					<Card>
						<div className="flex flex-col mt-2 justify-center items-center text-center lg:gap-2 lg:mt-4">
							<p>A list of users</p>
							<DisplayUsers users={users} />
						</div>
					</Card>
				</div>
			</div>
		</>
	);
};
