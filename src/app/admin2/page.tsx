import { checkRole } from "../../utils/role";
import { redirect } from "next/navigation";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";

import { ActionButton } from "../../components/ui/ActionButton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";

export default async function AdminDashboard(params: {
	searchParams: Promise<{ search?: string }>;
}) {
	if ((await checkRole("admin")) === false) {
		redirect("/https://birthday-app-chi-indol.vercel.app/api/employees");
	}

	const query = (await params.searchParams).search;
	const client = await clerkClient();

	// Get all users if no search query, or search results if query exists
	const users = query 
		? (await client.users.getUserList({ query })).data 
		: (await client.users.getUserList({ limit: 100 })).data;

	return (
		<div className="min-h-screen  p-4 sm:p-6 lg:p-8">
			<div className="container mx-auto max-w-7xl">
				<div className="space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a.5.5 0 01-.5.5h-1.5a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5H19a.5.5 0 01.5.5v2z" />
							</svg>
						</div>
						<h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
							Admin Dashboard
						</h1>
						<p className="text-lg text-gray-400 max-w-md mx-auto">
							Manage user roles and permissions with ease
						</p>
					</div>

					{/* Search Bar */}
					<div className="flex justify-center">
						<SearchUsers />
					</div>

					{/* Users Table/Cards */}
					<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
						{/* Desktop Table View */}
						<div className="hidden md:block">
							<Table>
								<TableHeader>
									<TableRow className="border-white/10 hover:bg-white/5">
										<TableHead className="text-white font-semibold text-left px-6 py-4">Name</TableHead>
										<TableHead className="text-white font-semibold px-6 py-4">Email</TableHead>
										<TableHead className="text-white font-semibold px-6 py-4">Role</TableHead>
										<TableHead className="text-white font-semibold px-6 py-4">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.length > 0 ? (
										users.map((user) => (
											<TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors duration-200">
												<TableCell className="text-white font-medium px-6 py-4">
													<div className="flex items-center space-x-3">
														<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
															{user.firstName?.[0]}{user.lastName?.[0]}
														</div>
														<span>{user.firstName} {user.lastName}</span>
													</div>
												</TableCell>
												<TableCell className="text-gray-300 px-6 py-4">
													{
														user.emailAddresses.find(
															(email) => email.id === user.primaryEmailAddressId
														)?.emailAddress
													}
												</TableCell>
												<TableCell className="px-6 py-4">
													<span className={`px-3 py-1 rounded-full text-xs font-medium ${
														(user.publicMetadata.role as string) === 'admin' 
															? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
															: (user.publicMetadata.role as string) === 'moderator'
															? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
															: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
													}`}>
														{(user.publicMetadata.role as string) || "user"}
													</span>
												</TableCell>
												<TableCell className="px-6 py-4">
													<div className="flex gap-2 flex-wrap">
														<form action={setRole} className="inline">
															<input type="hidden" value={user.id} name="id" />
															<input type="hidden" value="admin" name="role" />
															<ActionButton
																type="submit"
																className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg">
																Make Admin
															</ActionButton>
														</form>

														<form action={setRole} className="inline">
															<input type="hidden" value={user.id} name="id" />
															<input type="hidden" value="moderator" name="role" />
															<ActionButton
																type="submit"
																className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg">
																Make Moderator
															</ActionButton>
														</form>

														<form action={removeRole} className="inline">
															<input type="hidden" value={user.id} name="id" />
															<ActionButton
																type="submit"
																className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg">
																Remove Role
															</ActionButton>
														</form>
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} className="text-center text-gray-400 py-12">
												<div className="flex flex-col items-center space-y-3">
													<svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
													</svg>
													<p className="text-lg font-medium">No users found</p>
													<p className="text-sm">Try adjusting your search criteria</p>
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						{/* Mobile Card View */}
						<div className="md:hidden space-y-4 p-4">
							{users.length > 0 ? (
								users.map((user) => (
									<div key={user.id} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
										<div className="flex items-center space-x-3">
											<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
												{user.firstName?.[0]}{user.lastName?.[0]}
											</div>
											<div>
												<h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
												<p className="text-gray-400 text-sm">
													{
														user.emailAddresses.find(
															(email) => email.id === user.primaryEmailAddressId
														)?.emailAddress
													}
												</p>
											</div>
										</div>
										
										<div className="flex justify-between items-center">
											<span className={`px-3 py-1 rounded-full text-xs font-medium ${
												(user.publicMetadata.role as string) === 'admin' 
													? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
													: (user.publicMetadata.role as string) === 'moderator'
													? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
													: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
											}`}>
												{(user.publicMetadata.role as string) || "user"}
											</span>
										</div>

										<div className="flex flex-col space-y-2">
											<form action={setRole}>
												<input type="hidden" value={user.id} name="id" />
												<input type="hidden" value="admin" name="role" />
												<ActionButton
													type="submit"
													className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg py-2.5 text-sm font-medium transition-all duration-200 shadow-md">
													Make Admin
												</ActionButton>
											</form>

											<form action={setRole}>
												<input type="hidden" value={user.id} name="id" />
												<input type="hidden" value="moderator" name="role" />
												<ActionButton
													type="submit"
													className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-all duration-200 shadow-md">
													Make Moderator
												</ActionButton>
											</form>

											<form action={removeRole}>
												<input type="hidden" value={user.id} name="id" />
												<ActionButton
													type="submit"
													className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg py-2.5 text-sm font-medium transition-all duration-200 shadow-md">
													Remove Role
												</ActionButton>
											</form>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-12">
									<svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
									</svg>
									<p className="text-gray-400 text-lg font-medium mb-2">No users found</p>
									<p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
								</div>
							)}
						</div>
					</div>

					{/* Results count */}
					<div className="text-center">
						<p className="text-sm text-gray-400 bg-white/5 rounded-full px-4 py-2 inline-block backdrop-blur-sm border border-white/10">
							Showing {users.length} user{users.length !== 1 ? 's' : ''}
							{query && ` matching "${query}"`}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
