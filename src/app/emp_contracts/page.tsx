import Contracts_Page from "@/components/contracts-client";
import HomeClient from "@/components/home-client";
import { redirect } from "next/navigation";

import { Contract } from "@/types/contracts";
import { checkRole } from "@/utils/role";

export default async function Fetching() {
	// Fetching Data from API,
	// cache: "no-store" means that the data will not be cached and will be fetched fresh every time

	// EVERYWHERE IT HAS TO BE AN HTTPS! IF IT WILL BE AN HTTP IT WILL WORK FOR SOME TIME BUT THEN THE WHOLE APP WILL CRASH
	const fetched_data = await fetch(
		"https://birthday-app-chi-indol.vercel.app/contracts.json",
		{
			cache: "no-store",
		}
	);

	const apiRes = await fetch(
		"https://birthday-app-chi-indol.vercel.app/api/employees",
		{
			cache: "no-store",
		}
	);

	if ((await checkRole("admin")) === false) {
		redirect("/");
	}

	// Parsing the data to JSON format
	// and storing it in a variable called data
	// const data: Contract[] = await fetched_data.json();

	const newData: Contract[] = await apiRes.json();
	console.log(newData);

	// we add some additional things
	const newDataWithDuration: Contract[] = newData.map(
		// duration in months from calculating end_date - join_date

		// we also calculate the remainingDays
		(contract: Contract) => {
			const duration = Math.floor(
				(new Date(contract.end_date).getTime() -
					new Date(contract.join_date).getTime()) /
					(1000 * 3600 * 24 * 30)
			);

			const today = new Date();
			// if the contract ended we give a 0 number
			const durationDaysLeft = Math.ceil(
				(new Date(contract.end_date).getTime() - today.getTime()) /
					(1000 * 60 * 60 * 24)
			);
			// we calculate and keep in remainingDays
			const remainingDays = durationDaysLeft > 0 ? durationDaysLeft : 0;

			// we add it to the contract
			return {
				...contract,
				durationMonths: duration,
				durationDaysLeft: remainingDays,
			};
		}
	);

	return <Contracts_Page contracts={newDataWithDuration} />;
}
