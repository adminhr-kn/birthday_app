"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchUsers = () => {
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

	return (
		<>
			<div className="flex flex-col w-auto lg:flex-row lg:justify-between lg:mt-10 lg:p-4 lg:w-[70%]">
				<div className=" flex flex-col text-white ml-3 mr-3 mt-7 p-4  rounded-md border border-white">
					<form
						// on submit we can search 4 users
						onSubmit={(e) => {
							e.preventDefault();
							const form = e.currentTarget;
							const formData = new FormData(form);
							const queryTerm = formData.get("search") as string;
							router.push(pathname + "?search=" + queryTerm);
						}}>
						<div className="flex flex-col gap-2">
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
				</div>

				<div className="flex flex-col mt-2 justify-center items-center text-center lg:gap-2 lg:mt-4">
					<p>A list of users</p>
					{users.length > 0 ? (
						<ul>
							{users.map((user: any) => (
								<li key={user.id}>
									{user.email_addresses?.[0]?.email_address}
								</li>
							))}
						</ul>
					) : (
						<p>Loading users...</p>
					)}
				</div>
			</div>
		</>
	);
};
