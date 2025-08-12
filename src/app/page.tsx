"use client";

import { useEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SelectGroup } from "@radix-ui/react-select";

type Employee = {
	id: number;
	firstName: string;
	lastName: string;
	location: string;
	birthDate: string;
};

const sampleEmployees: Employee[] = [
	{
		id: 1,
		firstName: "Anna",
		lastName: "Kowalska",
		location: "Warsaw",
		birthDate: "1990-08-20",
	},
	{
		id: 2,
		firstName: "Jan",
		lastName: "Nowak",
		location: "Warsaw",
		birthDate: "1985-09-30",
	},
	{
		id: 3,
		firstName: "Marek",
		lastName: "Wiśniewski",
		location: "Gdańsk",
		birthDate: "1978-09-05",
	},
	{
		id: 4,
		firstName: "Zahra",
		lastName: "Table",
		location: "Jakarta",
		birthDate: "1978-09-10",
	},
	{
		id: 5,
		firstName: "Shamus",
		lastName: "Mcter",
		location: "Bangkok",
		birthDate: "1978-10-15",
	},
	{
		id: 6,
		firstName: "Liam",
		lastName: "Anderson",
		location: "London",
		birthDate: "1990-09-02",
	},
	{
		id: 7,
		firstName: "Sophia",
		lastName: "Martinez",
		location: "Madrid",
		birthDate: "1985-09-05",
	},
	{
		id: 8,
		firstName: "Noah",
		lastName: "Schmidt",
		location: "Berlin",
		birthDate: "1992-09-08",
	},
	{
		id: 9,
		firstName: "Ava",
		lastName: "Kowalska",
		location: "Warsaw",
		birthDate: "1998-09-10",
	},
	{
		id: 10,
		firstName: "Ethan",
		lastName: "Dubois",
		location: "Paris",
		birthDate: "1987-09-12",
	},
	{
		id: 11,
		firstName: "Isabella",
		lastName: "Rossi",
		location: "Rome",
		birthDate: "1993-09-15",
	},
	{
		id: 12,
		firstName: "Lucas",
		lastName: "Kim",
		location: "Seoul",
		birthDate: "1989-09-18",
	},
	{
		id: 13,
		firstName: "Mia",
		lastName: "Hansen",
		location: "Copenhagen",
		birthDate: "1995-09-21",
	},
	{
		id: 14,
		firstName: "Oliver",
		lastName: "Singh",
		location: "Delhi",
		birthDate: "1983-09-25",
	},
	{
		id: 15,
		firstName: "Emma",
		lastName: "Peterson",
		location: "Stockholm",
		birthDate: "2000-09-29",
	},
	{
		id: 16,
		firstName: "Emma",
		lastName: "SPY",
		location: "Stockholm",
		birthDate: "2000-11-29",
	},
	{
		id: 17,
		firstName: "Jason",
		lastName: "Heavy",
		location: "Stockholm",
		birthDate: "2000-02-29",
	},
];

export default function HomePage() {
	const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
	const [search, setSearch] = useState("");

	const [months, setMonths] = useState(1);

	// filtering employees by search term, "search" changed in input
	const filteredEmployees = employees.filter((emp) =>
		` ${emp.id} ${emp.firstName} ${emp.lastName} ${emp.location} ${emp.birthDate}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	// filtering employees whose birthday is in the next month
	const filteredEmployeesBirthDayLessThanMont = employees.filter((emp) => {
		const matchesSearch =
			`${emp.id} ${emp.firstName} ${emp.lastName} ${emp.location} ${emp.birthDate}`
				.toLowerCase()
				.includes(search.toLowerCase());

		if (!matchesSearch) return false;

		// checking birthday in a month
		const birthDate = new Date(emp.birthDate);
		const currentDate = new Date();

		const changeInMonths = months;

		const birthMonth = birthDate.getMonth();

		const currentMonth = currentDate.getMonth();

		const monthDiff = (birthMonth - currentMonth + 12) % 12;

		return monthDiff === changeInMonths;
	});

	return (
		<main className="flex min-h-screen h-full w-full  ">
			<div className="flex justify-center items-center h-full w-full">
				<Card className="w-full min-h-screen overflow-hidden ">
					<CardHeader>
						<CardTitle>Birthday App</CardTitle>
						<CardDescription>
							Search an employee by Name, Surname, Location or Birthday
						</CardDescription>

						<div>A list of people whoose birthday is in the next month</div>

						<Select
							defaultValue="1"
							onValueChange={(value) => {
								console.log("Chosen:", value, "=> as a number:", Number(value));
								setMonths(Number(value));
							}}>
							<SelectTrigger className="w-[400px]">
								<SelectValue placeholder="Show users with birthdays in..." />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Months</SelectLabel>
									<SelectItem value="1">In 1 month (default)</SelectItem>
									<SelectItem value="2">In 2 months</SelectItem>
									<SelectItem value="3">In 3 months</SelectItem>
									<SelectItem value="6">In 6 months</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={(e) => e.preventDefault()}
							className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="search">
									Name, Surname, location, BirthDay
								</Label>
								<Input
									id="search"
									type="text"
									placeholder="Write to search..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
						</form>

						<ul className="max-h-120 overflow-y-auto pr-1">
							{filteredEmployees.length > 0 ? (
								filteredEmployeesBirthDayLessThanMont.map((emp) => {
									const birthDateFormatted = new Date(
										emp.birthDate
									).toLocaleDateString();
									return (
										<li key={emp.id} className="border rounded p-4">
											<p>
												<strong>
													{emp.firstName} {emp.lastName}
												</strong>{" "}
												- {emp.location}
											</p>
											<p>Birthday: {birthDateFormatted}</p>
										</li>
									);
								})
							) : (
								<li>No workers with such search conditions</li>
							)}
						</ul>
					</CardContent>
					<CardFooter>
						{/* Możesz tu dodać przyciski jeśli chcesz */}
					</CardFooter>
				</Card>

				<Table>
					<TableCaption>A list of employees.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>First Name</TableHead>
							<TableHead>Last Name</TableHead>
							<TableHead>Location</TableHead>
							<TableHead className="text-right">Birth Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredEmployees.length > 0 ? (
							filteredEmployees.map((emp) => {
								return (
									<TableRow key={emp.id}>
										<TableCell className="font-medium">{emp.id}</TableCell>
										<TableCell>{emp.firstName}</TableCell>
										<TableCell>{emp.lastName}</TableCell>
										<TableCell>{emp.location}</TableCell>
										<TableCell className="text-right">
											{emp.birthDate}
										</TableCell>
									</TableRow>
								);
							})
						) : (
							// <div className=" flex text-center justify-center items-center w-full">
							// 	No workers with such search conditions
							// </div>
							<></>
						)}
					</TableBody>

					{/* employees.map((emp) => (
							<TableRow key={emp.id}>
								<TableCell className="font-medium">{emp.id}</TableCell>
								<TableCell>{emp.firstName}</TableCell>
								<TableCell>{emp.lastName}</TableCell>
								<TableCell>{emp.location}</TableCell>
								<TableCell className="text-right">
									{emp.birthDate}
								</TableCell>
							</TableRow>
						)) */}
				</Table>
			</div>

			{/* <h1 className="flex justify-center items-center mt-[20px]">
				Urodziny pracowników
			</h1>

			<input
				className="flex justify-center items-center "
				type="text"
				placeholder="Szukaj po imieniu, nazwisku lub lokalizacji"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{
					padding: "8px",
					marginBottom: "20px",
					width: "100%",
					maxWidth: "400px",
				}}
			/>

			<ul className="flex flex-col justify-center items-center ">
				{filteredEmployees.length > 0 ? (
					filteredEmployees.map((emp) => (
						<li key={emp.id} style={{ marginBottom: "10px" }}>
							<strong>
								{emp.firstName} {emp.lastName}
							</strong>{" "}
							- {emp.location} | Urodziny:{" "}
							{new Date(emp.birthDate).toLocaleDateString()}
						</li>
					))
				) : (
					<li>Brak pracowników spełniających kryteria</li>
				)}
			</ul>
 */}
		</main>
	);
}
