import { checkRole } from "../../utils/role";
import { redirect } from "next/navigation";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";

import { ActionButton } from "../../components/ui/ActionButton";

export default async function AdminDashboard(params: {
	searchParams: Promise<{ search?: string }>;
}) {
	//redirect("/https://birthday-app-chi-indol.vercel.app/api/employees");

	// reedirect("/localhost:3000");
	if ((await checkRole("admin")) === false) {
		redirect("/https://birthday-app-chi-indol.vercel.app/api/employees");
	}

	const query = (await params.searchParams).search;

	const client = await clerkClient();

	const users = query ? (await client.users.getUserList({ query })).data : [];

	return (
		<>
			<div className="flex flex-col justify-center items-center w-full h-full ">
				<p>
					This is the protected admin dashboard restricted to users with the
					`admin` role.
				</p>

					
					<SearchUsers />

					{users.map((user) => {
						return (
							<div
								key={user.id}
								className=" border border-white mt-10 p-4 rounded-md text-white">
								<div key={user.id} className="flex flex-col gap-3">
									<div>
										{user.firstName} {user.lastName}
									</div>

									<div>
										{
											user.emailAddresses.find(
												(email) => email.id === user.primaryEmailAddressId
											)?.emailAddress
										}
									</div>

									<div>{user.publicMetadata.role as string}</div>

									<form action={setRole}>
										<input type="hidden" value={user.id} name="id" />
										<input type="hidden" value="admin" name="role" />
										<ActionButton
											type="submit"
											className="bg-purple-700 rounded-md p-1 hover:bg-amber-100 hover:text-black transition-colors duration-300">
											Make Admin
										</ActionButton>
										
									</form>

									<form action={setRole}>
										<input type="hidden" value={user.id} name="id" />
										<input type="hidden" value="moderator" name="role" />
										<ActionButton
											type="submit"
											className="bg-purple-700 rounded-md p-1 hover:bg-amber-100 hover:text-black transition-colors duration-300">
											Make Moderator
										</ActionButton>
									</form>

									<form action={removeRole}>
										<input type="hidden" value={user.id} name="id" />
										<ActionButton
											type="submit"
											className="bg-red-700 rounded-md p-1  hover:bg-red-800 hover:text-black transition duration-300">
											Remove Role
										</ActionButton>
									</form>
								</div>
							</div>
						);
					})}
				
			</div>
		</>
	);
}
