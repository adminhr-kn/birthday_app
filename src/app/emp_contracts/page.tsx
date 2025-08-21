import Contracts_Page from "@/components/contracts-client";
import HomeClient from "@/components/home-client";

import { Contract } from "@/types/contracts";

export default async function Fetching() {
	// Fetching Data from API,
	// cache: "no-store" means that the data will not be cached and will be fetched fresh every time
	const fetched_data = await fetch("http://localhost:3000/contracts.json", {
		cache: "no-store",
	});

	const apiRes = await fetch("http://localhost:3000/api/employees", {
		cache: "no-store",
	});

	// Parsing the data to JSON format
	// and storing it in a variable called data
	const data: Contract[] = await fetched_data.json();

	const newData: Contract[] = await apiRes.json();
	const newDataWithDuration: Contract[] = newData.map(
		// duration in months from calculating end_date - join_date
		(contract: Contract) => {
			const duration =
				Math.floor((new Date(contract.end_date).getTime() -
					new Date(contract.join_date).getTime()) /
				(1000 * 3600 * 24 * 30));

			return { ...contract, durationMonths: duration };
		}
	);

	return <Contracts_Page contracts={newDataWithDuration} />;
}
