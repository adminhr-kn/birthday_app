// Pobranie danych po zamontowaniu komponentu
// useEffect(() => {
//     fetch("/users.json") // jeśli plik jest w public/
//         .then((res) => res.json())
//         .then((data: Employee[]) => setEmployees(data))
//         .catch((err) => console.error("Error while fetching:", err));
// }, []);
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/ui/select";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Employee = {
	avatar: string;
	branch: string; // branch is location!
	email: string;
	gender: string;
	job_level: string;
	user_id: number;
	first_name: string;
	last_name: string;
	birth_date: string;
	employee_id: string;
	resign_date: string;
	mobile_phone: string;
};

export default function HomePage({ newData }: { newData: Employee[] }) {
	const [employees, setEmployees] = useState<Employee[]>(newData);
	const [search, setSearch] = useState("");

	const actualDate = new Date();
	const actualDatesMonth = actualDate.getMonth() + 1;
	console.log(actualDatesMonth + " POOOOTIS");
	const [monthsv2, setMonthsv2] = useState(actualDatesMonth);

	// newData is API from Talenta, fetched
	useEffect(() => {
		console.log("initialEmployees", newData);
		// make new set from job_levels and console log
		const job_levels = new Set(
			newData.map((emp) => emp.job_level.toLowerCase())
		);
		console.log("job_levels", job_levels);
	}, [newData]);

	// destructuring a setTheme from useTheme hook
	const { setTheme } = useTheme();

	// Opening the data about user
	const [isopen, setOpen] = useState<number | null>(null);

	const filteredEmployees = employees?.filter(
		(emp) =>
			`${emp.user_id} ${emp.first_name} ${emp.last_name} ${emp.branch} ${emp.birth_date} ${emp.email} ${emp.gender}  ${emp.avatar} ${emp.job_level}`
				.toLowerCase()
				.includes(search.toLowerCase()) &&
			!emp.email.includes("resign.") &&
			(emp.resign_date === "" || emp.resign_date === null)
	);

	// filtering employees whose birthday is in the next month
	// filter creates new array, if true smth is in the arrayif false then not
	// sort sorts things out
	const filteredEmployeesBirthDayLessThanMont = employees
		?.filter((emp) => {
			const matchesSearch =
				`${emp.user_id} ${emp.first_name} ${emp.last_name} ${emp.branch} ${emp.birth_date} ${emp.email} ${emp.gender}  ${emp.avatar} ${emp.job_level}`
					.toLowerCase()
					.includes(search.toLowerCase()) &&
				!emp.email.includes("resign.") &&
				(emp.resign_date === "" || emp.resign_date === null);

			if (!matchesSearch) return false;

			const birthDatesArray = [];

			// checking birthday in a month
			const birthDate = new Date(emp.birth_date);
			const currentDate = new Date();

			const monthwerelookingfor = monthsv2;

			const birthMonth = birthDate.getMonth();

			return birthMonth == monthwerelookingfor - 1;
		})
		?.sort((a, b) => {
			// sorting by day of month
			const dateA = new Date(a.birth_date).getDate();
			const dateB = new Date(b.birth_date).getDate();
			return dateA - dateB; // going up
		});

	return (
		<main className="flex flex-col lg:flex-row flex-1 min-h-0 w-full p-4 lg:p-6 gap-4 lg:gap-6 bg-background text-foreground">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Birthday list */}
			<Card className="flex flex-col w-full lg:w-1/2 min-w-0 h-full shadow-lg">
				<CardHeader className="space-y-2">
					<CardTitle>Birthday App</CardTitle>
					<CardDescription>
						Search an employee by Name, Surname, Location or Birthday
					</CardDescription>

					<div className="text-sm text-muted-foreground">
						A list of people whose birthday is in the selected month
					</div>

					<div className="flex gap-3">
						<Select
							defaultValue={monthsv2.toString()}
							onValueChange={(value) => {
								console.log("Chosen:", value, "=> as a number:", Number(value));
								setMonthsv2(Number(value));
							}}>
							<SelectTrigger>
								<SelectValue placeholder="Show users with birthdays in..." />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Months</SelectLabel>
									<SelectItem value="1">January</SelectItem>
									<SelectItem value="2">February</SelectItem>
									<SelectItem value="3">March</SelectItem>
									<SelectItem value="4">April</SelectItem>
									<SelectItem value="5">May</SelectItem>
									<SelectItem value="6">June</SelectItem>
									<SelectItem value="7">July</SelectItem>
									<SelectItem value="8">August</SelectItem>
									<SelectItem value="9">September</SelectItem>
									<SelectItem value="10">October</SelectItem>
									<SelectItem value="11">November</SelectItem>
									<SelectItem value="12">December</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className="flex flex-col gap-4 min-w-0 overflow-hidden flex-1 ">
					<div className="grid gap-2">
						<Label htmlFor="search">Search</Label>
						<Input
							id="search"
							type="text"
							placeholder="Name, Surname, Location, Birthday..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{/* // closing when we scrolled down the list*/}
					<ul
						className="space-y-3  overflow-y-auto pr-2 flex flex-col flex-1  "
						onScroll={() => setOpen(null)}>
						{filteredEmployees?.length > 0 ? (
							filteredEmployeesBirthDayLessThanMont?.map((emp) => {
								const birthDateFormatted = new Date(
									emp.birth_date
								).toLocaleDateString();
								return (
									<Popover
										// const [open, setOpen] = useState<number | null>(null);
										key={emp.user_id}
										// if it is opened we open the popoverContent, but only for this exact user
										open={isopen === emp.user_id}
										// when we click on PopoverTrigger the onOpenChange will be called with the value, we set the "isopen" value hook by setOpen() and the
										onOpenChange={(isOpen) =>
											setOpen(isOpen ? emp.user_id : null)
										}>
										<PopoverTrigger asChild>
											<li
												key={emp.user_id}
												// flex, things in a row, items-center. making them vertically in the same line!, gap between them. now it looks good!
												className="flex items-center gap-3 border rounded-lg p-4 bg-card shadow-sm">
												<Avatar className="relative w-30 h-30 overflow-hidden">
													<AvatarImage
														className="
													w-full h-full object-cover block
													"
														src={emp.avatar}
														alt="@shadcn"
													/>
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
												<div className="flex flex-col ">
													<p className="font-semibold">
														{emp.first_name} {emp.last_name}
													</p>
													<p className="text-sm text-muted-foreground">
														{emp.branch}
													</p>
													<p className="text-sm">
														Birthday: {birthDateFormatted}
													</p>
												</div>
											</li>
										</PopoverTrigger>
										<PopoverContent className="w-72" side="top">
											<div className="flex justify-between items-center mb-2">
												<p className="font-semibold">User details</p>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setOpen(null)}>
													<X className="h-4 w-4" />
												</Button>
											</div>
											<p>Name: {emp.first_name}</p>
											<p>Surname: {emp.last_name}</p>
											<p>Email: {emp.email}</p>
											<p>Phone: {emp.mobile_phone}</p>
											<p>Location: {emp.branch}</p>
											<p>Birthday: {birthDateFormatted}</p>
										</PopoverContent>
									</Popover>
								);
							})
						) : (
							<li className="text-sm text-muted-foreground italic">
								No workers with such search conditions
							</li>
						)}
					</ul>
				</CardContent>
			</Card>

			{/* Employee table */}
			<Card className="hidden lg:flex lg:flex-col min-w-0 w-3/4 h-full shadow-lg mt-4 lg:mt-0">
				<CardHeader className="space-y-2">
					<CardTitle>Employee List</CardTitle>
					<CardDescription>
						A list of employees with their details
					</CardDescription>
				</CardHeader>

				<CardContent className="flex-1 min-h-0 flex flex-col gap-4">
					<div className="flex min-h-0 flex-1 flex-col">
						{/* Fixed header */}
						<Table className="table-fixed">
							<TableHeader>
								<TableRow>
									<TableHead className="w-16">ID</TableHead>
									<TableHead className="w-40 text-center">First Name</TableHead>
									<TableHead className="w-40 text-center">Last Name</TableHead>
									<TableHead className="w-40 text-center">Location</TableHead>
									<TableHead className="w-32 text-right pr-7">
										Birth Date
									</TableHead>
								</TableRow>
							</TableHeader>
						</Table>
						{/* Scrollable body */}
						<div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
							<Table className="table-fixed">
								<TableBody>
									{filteredEmployees?.length > 0 ? (
										filteredEmployees?.map((emp, index) => {
											return (
												<TableRow key={`${emp.employee_id} ${index}`}>
													<TableCell className="w-16 font-medium">
														{emp.user_id}
													</TableCell>
													<TableCell className="w-40 text-center">
														{emp.first_name}
													</TableCell>
													<TableCell className="w-40 text-center">
														{emp.last_name}
													</TableCell>
													<TableCell className="w-40 text-center">
														{emp.branch}
													</TableCell>
													<TableCell className="w-32 text-right">
														{emp.birth_date}
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
					</div>
				</CardContent>
			</Card>

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
