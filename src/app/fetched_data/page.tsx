import HomeClient from "@/components/home-client";
import { Employee } from "@/types/employee";

export default async function Page() {
	const res = await fetch("http://localhost:3000/users.json", {
		cache: "no-store",
	});
	const data: Employee[] = await res.json();
	return <HomeClient initialEmployees={data} />;
}
