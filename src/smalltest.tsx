// fetching datat

"https://birthday-app-chi-indol.vercel.app/api/employees";

import { error } from "console";
import { parse } from "path";
// export default async function fetchingData() {
// 	const fetched_data = await fetch(
// 		"https://birthday-app-chi-indol.vercel.app/api/employees"
// 	);

//     if(!fetched_data.ok)
//         return;

//     const parsed_data = await fetched_data.json();

//     return <p>{parsed_data.name}</p>;
// }

import { useEffect, useState } from "react";

interface Employee {
	bzz: string; // dostosuj do faktycznych danych z API
}

export default function Employees() {
	const [emps, setemps] = useState<Employee[]>([]);

	useEffect(() => {
		// lub async function fetchData()
		const fetchData = async () => {
			const fetched_data = await fetch(
				"https://birthday-app-chi-indol.vercel.app/api/employees"
			);

			if (!fetched_data.ok) {
				throw error("error message");
			}

			const parsedData = await fetched_data.json();
			setemps(parsedData);
		};

		fetchData();
	}, []);

	return (
		<div>
			<p>{emps.map((scout) => scout.bzz)}</p>
		</div>
	);
}
