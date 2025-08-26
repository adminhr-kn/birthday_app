import { Contract } from "@/types/contracts";
export async function GET() {

    const apiRes = await fetch("http://localhost:3000/api/employees", {
            cache: "no-store",
        });
    
    
        const newData: Contract[] = await apiRes.json();
        const contracts: Contract[] = newData.map(
            // duration in months from calculating end_date - join_date
            (contract: Contract) => {
                const duration =
                    Math.floor((new Date(contract.end_date).getTime() -
                        new Date(contract.join_date).getTime()) /
                    (1000 * 3600 * 24 * 30));
    
                return { ...contract, durationMonths: duration };
            }
        );
        

	let differenceInDays: Contract[] = [];
	const today = new Date();
	if (contracts?.length > 0) {
		contracts.map((conts) => {
			const endDate = new Date(conts.end_date);

			const diffDays = Math.ceil(
				(endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
			);

			diffDays > 0 && diffDays < 30 ? differenceInDays.push(conts) : null;
		});

		console.log(differenceInDays);

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contracts: differenceInDays }),
			});

			const data = await res.json();

			console.log("API response:", data);
			if (res.ok) {
				console.log("✅ Email sent!");
			} else {
				console.error("❌ Email error:", data);
			}
		} catch (error) {
			console.error("Error while sending email:", error);
		}
	}
}
