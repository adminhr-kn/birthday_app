import HomeClient from "@/components/home-client";
import { Employee } from "@/types/employee";

export default async function Page() {
	// const res = await fetch(

	// 	"https://birthday-app-chi-indol.vercel.app/users.json",
	// 	{ cache: "no-store" }
	// );
	// "https://birthday-app-chi-indol.vercel.app/api/employees"   ,
	const apiRes = await fetch(
		"https://knemployee.vercel.app/api/employees",
		{
			cache: "no-store",
		}
	);
	const newData: any[] = await apiRes.json();
	// const data: Employee[] = await res.json();
	return <HomeClient newData={newData} />;
}
