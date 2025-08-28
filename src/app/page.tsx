import HomeClient from "@/components/home-client";
import { Employee } from "@/types/employee";

export default async function Page() {
	const res = await fetch(
		"https://birthday-app-chi-indol.vercel.app/users.json",
		{ cache: "no-store" }
	);
	const apiRes = await fetch(
		"https://birthday-app-chi-indol.vercel.app/api/employees",
		{
			cache: "no-store",
		}
	);
	const newData: any[] = await apiRes.json();
	const data: Employee[] = await res.json();
	return <HomeClient newData={newData} />;
}
