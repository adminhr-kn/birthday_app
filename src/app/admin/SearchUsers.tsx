"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const SearchUsers = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [searchTerm, setSearchTerm] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		startTransition(() => {
			const queryParam = searchTerm.trim()
				? `?search=${encodeURIComponent(searchTerm.trim())}`
				: "";
			router.push(pathname + queryParam);
		});
	};

	const handleClear = () => {
		setSearchTerm("");
		startTransition(() => {
			router.push(pathname);
		});
	};

	return (
		<div className="w-full max-w-2xl">
			

			<form onSubmit={handleSubmit} className="relative">
				<div className="relative">
					{/* Search Icon */}
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg
							className="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>

					{/* Search Input */}
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search users by name or email..."
						className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/15"
					/>

					{/* Action Buttons Container */}
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
						{searchTerm && (
							<button
								type="button"
								onClick={handleClear}
								disabled={isPending}
								className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50">
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}

						<button
							type="submit"
							disabled={isPending}
							className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
							{isPending ? (
								<>
									<svg
										className="animate-spin h-4 w-4"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span className="hidden sm:inline">Searching...</span>
								</>
							) : (
								<>
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									<span className="hidden sm:inline">Search</span>
								</>
							)}
						</button>
					</div>
				</div>

				{/* Search Hints */}
				<div className="mt-3 flex flex-wrap gap-2 justify-center">
					{[
						{ label: "All Users", value: "" },
						{ label: "Admins", value: "admin" },
						{ label: "Moderators", value: "moderator" },
					].map((hint) => (
						<button
							key={hint.label}
							type="button"
							onClick={() => {
								setSearchTerm(hint.value);
								if (hint.value === "") {
									handleClear();
								}
							}}
							className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full border border-white/10 transition-all duration-200">
							{hint.label}
						</button>
					))}
				</div>
			</form>
		</div>
	);
};
