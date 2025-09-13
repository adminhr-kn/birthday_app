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
			<div className="flex flex-col gap-3 justify-center lg:items-center lg:w-full lg:h-full  ">
				<p className="text-center mt-3 ml-3 mr-3">
					This is the protected admin dashboard restricted to users with the
					`admin` role.
				</p>

				<SearchUsers>
					{users.map((user) => {
						return (
							<div
								key={user.id}
								className=" border border-white m-3 lg:max-h-[240px] lg:mt-10 p-4 rounded-md text-white text-center">
								<div key={user.id} className="flex flex-col gap-2 text-center">
									<div>
										{user.firstName} {user.lastName}
									</div>

									<div className=" lg:truncate max-w-[140px] mx-auto text-center">
										{
											user.emailAddresses.find(
												(email) => email.id === user.primaryEmailAddressId
											)?.emailAddress
										}
									</div>

									<div>{user.publicMetadata.role as string}</div>

									{/* after clicking next.js will fire function setRole we send the info about id and role of a user */}
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

									{/* when we click on this button we will remove the role of a user, the form will set the removeRole function */}
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
				</SearchUsers>
			</div>
		</>
	);
}
