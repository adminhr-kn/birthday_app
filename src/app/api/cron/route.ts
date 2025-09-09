import { Contract } from "@/types/contracts";
import { NextResponse } from "next/server";
export async function GET() {
	// getting all the info about employees from the api
	const apiRes = await fetch(

		"https://birthday-app-chi-indol.vercel.app/api/employees",

		{
			cache: "no-store",
		}
	);

	// adding duration to the contracts
	const newData: Contract[] = await apiRes.json();
	const contracts: Contract[] = newData.map(
		// duration in months from calculating end_date - join_date
		(contract: Contract) => {
			const duration = Math.floor(
				(new Date(contract.end_date).getTime() -
					new Date(contract.join_date).getTime()) /
					(1000 * 3600 * 24 * 30)
			);

			return { ...contract, durationMonths: duration };
		}
	);

	// doing the filtration
	let differenceInDays: Contract[] = [];
	const today = new Date();
	if (contracts?.length > 0) {
		contracts.map((conts) => {
			const endDate = new Date(conts.end_date);

			const diffDays = Math.ceil(
				(endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
			);

			diffDays > 0 && (diffDays === 30 || diffDays === 14 || diffDays <= 7)
				? differenceInDays.push(conts)
				: null;
		});

		console.log(differenceInDays);

		// trying 2 send the data to api/messages
		try {
			if (differenceInDays) {
				const res = await fetch(

					"https://birthday-app-chi-indol.vercel.app/api/messages",

					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ contracts: differenceInDays }),
					}
				);

				const data = await res.json();

				console.log("API response:", data);
				if (res.ok) {
					console.log("✅ Email sent!");
					return Response.json({ message: "Email sent!", status: 200 });
				} else {
					console.error("❌ Email error:", data);
					return Response.json({ message: "Email error!", status: 500 });
				}
			}
		} catch (error) {
			console.error("Error while sending email:", error);
			return Response.json({
				message: "Error while sending email!",
				status: 500,
			});
		}
	}
}
