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

import { Badge } from "@/components/ui/badge";

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

import {
	Check,
	ChevronDownIcon,
	ChevronsUpDown,
	Moon,
	Sun,
	X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { getDate, set } from "date-fns";
import { Contract } from "@/types/contracts";
// type Contract = {
// 	id: number;
// 	employeeName: string;
// 	startDate: Date;
// 	endDate: Date;
// 	durationMonths: number;
// 	location: string;
// 	isLeader: boolean;
// };

type ContractFilter = {
	name: string;
	endDate: DateRange;
	monthDuration: number;
	location: string;
};

export default function Contracts_Page({
	contracts,
}: {
	contracts: Contract[];
}) {
	const [contract, setContract] = useState<Contract[]>(contracts);
	const [search, setSearch] = useState("");
	const [months, setMonths] = useState(1);

	//hooks for UX clicking on a user
	const [isopen, setisOpen] = useState<number | null>(null);

	// destructuring a setTheme from useTheme hook
	const { setTheme } = useTheme();

	const [filters, setFilter] = useState<ContractFilter>({
		name: "",
		// the "to" date is exceptional
		endDate: {
			from: new Date(),
		},
		monthDuration: 0,
		location: "",
	});

	// hooks for combobox
	const [open, setOpen] = useState(false); // is combobox open
	const [value, setValue] = useState("");

	// hooks for date picker
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [date, setDate] = useState<DateRange | undefined>(undefined);

	// hook for duration in months
	const [duration, setDuration] = useState("");

	// all locations possible
	// Array.form makes a table
	const filteredLocations = Array.from(
		new Set(contracts.map((c) => c.branch)) // new Set to get unique locations
	).map((loc) => ({
		value: loc,
		label: loc,
	}));
	console.log(filteredLocations);

	console.log(filters);

	const [filteredConts, setFilteredConts] = useState(contracts);

	// when our filters change we do a filtration
	useEffect(() => {
		const result = contract.filter(
			(x) =>
				// if name from filters is as the one from contract (we search every contract)
				// if names match we go on and check next filter, if all are true we return the contract
				// if something isnt right the 1 thing will return false and we wont have the contract in the filteredConts
				(filters.name
					? x.first_name.toLowerCase().includes(filters.name.toLowerCase())
					: true) &&
				(filters.location
					? x.branch.toLowerCase() === filters.location.toLowerCase()
					: true) &&
				(filters.endDate.to
					? //if we have a date we have to check if its before the ending contract date
						new Date(x.end_date) < new Date(filters.endDate.to || new Date()) &&
						// and after the starting contract date
						new Date(x.end_date) > new Date(filters.endDate.from || new Date())
					: true) &&
				(filters.monthDuration
					? x.durationMonths === filters.monthDuration
					: true) &&
				!x.email.includes("resign.") &&
				(x.resign_date === "" || x.resign_date === null)
		);
		console.log("Filtered Contracts:", result);
		// if smth changes we change the filteredConts, and sort it by the durationDaysLeft
		setFilteredConts(
			[...result].sort((a, b) => {
				const diffA = a.durationDaysLeft;
				const diffB = b.durationDaysLeft;

				return diffA - diffB;
			})
		);
	}, [filters]);

	return (
		<main className="flex flex-col lg:flex-row flex-1 min-h-0 w-full p-4 lg:p-6 gap-4 lg:gap-6 bg-background text-foreground">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
						{/* This span is for accessibility, it will be read by screen readers */}
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

			<Card className="flex flex-col w-full lg:w-1/2 shadow-lg h-full min-w-0">
				<CardHeader className="space-y-2">
					<CardTitle>Birthday App</CardTitle>
					<CardDescription>
						Search for a contract by an employee's name, surname, location, or
						the contract's duration. You can also search by date
					</CardDescription>

					<div className="flex items-center gap-4 flex-wrap">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								className="w-[300px]"
								onChange={(e) => {
									const value = e.target.value;
									const temp = filters;
									temp["name"] = value;
									setFilter({ ...temp });
									console.log(filters);
								}}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="location">Location</Label>
							{/* <Input id="location" /> */}

							{/* Popover a container for the window */}
							{/* open tells if it open or not, onOpenChange tells if someones opens/closes update open  */}
							{/* onOpenChange is built in */}
							<Popover open={open} onOpenChange={setOpen}>
								{/* PopoverTrigger is an element that user clicks to open/close Popover */}
								{/*  */}
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										// role combox a screen reader thing for blind ppl
										role="combobox"
										// screen reader also for blind ppl tells if its open
										aria-expanded={open}
										className="w-[200px] justify-between">
										{/* find  the element with this value and show his label */}
										{/* if there is none show Choose instead */}
										{value
											? filteredLocations.find((o) => o.value === value)?.label
											: "Choose..."}
										{/* little symbol on the right side */}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>

								{/* Shows only when popover is true, our list of locations */}
								<PopoverContent className="w-[200px] p-0">
									{/* command is based on the library cmdk, filtering is done by the library */}
									<Command>
										{/* a text field to enter the searchParams */}
										<CommandInput placeholder="Search..." />
										{/* what to show when there are no records */}
										<CommandEmpty>Nothing found.</CommandEmpty>
										{/* group of command items */}
										<CommandGroup>
											{filteredLocations.map((o) => (
												// a single option
												<CommandItem
													key={o.value}
													value={o.value}
													onSelect={(currentValue) => {
														const temp1 = { ...filters };
														// if the clicks the current value, set it to empty string
														// so its not selected anymore

														const newValue =
															currentValue === value ? "" : currentValue;
														setValue(newValue);

														setFilter({
															...temp1,
															location: newValue,
														});

														// close the popover after selection
														setOpen(false);
													}}>
													{/* an icon if the value is selected the bird shows */}
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															value !== o.value && "opacity-0"
														)}
													/>
													{o.label}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						<div className="flex flex-col gap-2">
							{/* a input for range when employee finishes contract */}
							<Label htmlFor="startDate">End of contract</Label>

							{/* Once more open or not we have a date picker amd build in onOpenChange */}
							<Popover
								open={datePickerOpen}
								onOpenChange={() => {
									setDate(undefined);
									const filterData = { ...filters };
									setFilter({
										...filterData,
										endDate: {
											from: new Date(),
										},
									});

									setDatePickerOpen(!datePickerOpen);
								}}>
								{/* PopoverTrigger is the thing that user clicks and opens the popover content */}
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										id="date"
										className="w-48 justify-between font-normal">
										{date
											? `${date?.from?.toLocaleDateString()} - ${date?.to?.toLocaleDateString()}`
											: "Select date"}
										<ChevronDownIcon />
									</Button>
								</PopoverTrigger>

								{/* PopoverContent is the content of the popover, in our case a calendar */}
								<PopoverContent
									className="w-auto overflow-hidden p-0"
									align="start">
									{/* Calendar is a component from react-day-picker library */}
									<Calendar
										// mode="range", range mode allows to select a range of dates
										mode="range"
										// selected date is the date state
										selected={date}
										//  numberOfMonths shows us a number of months in the calendar
										numberOfMonths={2}
										endMonth={new Date(2100, 11)}
										captionLayout="dropdown"
										onSelect={(selected) => {
											// reset every time
											setDate(selected);

											const temp = filters;
											temp["endDate"] = selected
												? selected
												: { to: new Date(), from: new Date() };
											setFilter({ ...temp });
											console.log(filters);

											// close popover when dates are not the same, works only first time because of the reference value, when we change and click again we can select the same date
											if (
												selected?.from &&
												selected?.to &&
												selected.from !== selected.to
											) {
												setDatePickerOpen(false);
											}
										}}
									/>
								</PopoverContent>
							</Popover>

							{/* <Button
								onClick={() => {
									const filterData = { ...filters };
									setFilter({
										...filterData,
										endDate: {
											from: new Date(),
										},
									});
									setDate(undefined);
								}}>
								Reset Date
							</Button> */}
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="duration">Duration (months)</Label>
							<Input
								type="number"
								id="duration"
								min="0"
								onChange={(e) => {
									const valuetaken = e.target.value;
									if (valuetaken === "" || Number(valuetaken) >= 0) {
										setDuration(valuetaken);
										console.log(valuetaken);

										const temp = filters;
										temp["monthDuration"] = Number(valuetaken);
										setFilter({ ...temp });
										console.log(filters);
									}
								}}
							/>
						</div>
					</div>
				</CardHeader>

				<CardContent className="flex flex-col gap-4 min-w-0 min-h-0 overflow-hidden">
					<ul
						className=" flex flex-col space-y-3 max-h-96 overflow-y-auto pr-2  lg:max-h-145 "
						onScroll={() => setisOpen(null)}>
						{filteredConts?.length > 0 ? (
							filteredConts.map((contract) => {
								const endDateFormatted = new Date(
									contract.end_date
								).toLocaleDateString();

								return (
									<Popover
										key={contract.user_id}
										open={isopen === contract.user_id}
										onOpenChange={(isOpen) =>
											setisOpen(isOpen ? contract.user_id : null)
										}>
										<PopoverTrigger asChild>
											<li
												key={contract.user_id}
												className=" flex items-center gap-3 border rounded-lg p-3 bg-card shadow-sm">
												<Avatar className="relative w-30 h-30 overflow-hidden">
													<AvatarImage
														className="
													w-full h-full object-cover block
													"
														src={contract.avatar}
														alt="@shadcn"
													/>
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
												<div className="flex flex-col  ">
													<p className="font-semibold">{contract.first_name}</p>
													<p className="text-sm text-muted-foreground">
														{contract.branch}
													</p>
													<p className="text-sm text-muted-foreground">
														{endDateFormatted != "Invalid Date"
															? endDateFormatted
															: "No end date"}
													</p>
													<p className="text-sm text-neutral-50">
														{contract.durationMonths != null &&
														!Number.isNaN(contract.durationMonths)
															? contract.durationMonths + " months"
															: null}
													</p>
												</div>
											</li>
										</PopoverTrigger>
										<PopoverContent className="w-72">
											<div className="flex justify-between items-center mb-2">
												<p className="font-semibold">Contract details</p>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setisOpen(null)}>
													<X className="h-4 w-4" />
												</Button>
											</div>
											<p>Name: {contract.first_name}</p>
											<p>
												Position: {contract.organization_name}{" "}
												{contract.job_level}
											</p>
											<p>Email: {contract.email}</p>
											<p>Phone: {contract.mobile_phone}</p>
											<p>
												Start Date:{" "}
												{new Date(contract.join_date).toLocaleDateString()}
											</p>
											<p>
												End Date:{" "}
												{new Date(contract.end_date).toLocaleDateString()}
											</p>
											<p>Location: {contract.branch}</p>
										</PopoverContent>
									</Popover>
								);
							})
						) : (
							<li className="text-center font-semibold text-muted-foreground">
								No contracts found
							</li>
						)}
					</ul>
				</CardContent>
			</Card>

			{/* LIST OF ALL EMPLOYEES AND THEIR CONTRACTS! */}
			<Card className="hidden lg:flex lg:flex-col w-3/4 shadow-lg h-full">
				{/* <Button
					onClick={async () => {
						let differenceInDays: Contract[] = [];
						const today = new Date();

						if (filteredConts?.length > 0) {
							filteredConts.map((conts) => {
								const endDate = new Date(conts.end_date);

								const diffDays = Math.ceil(
									(endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
								);

								diffDays > 0 && diffDays < 30
									? differenceInDays.push(conts)
									: null;
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
					}}>
					BZZ
				</Button> */}

				<CardHeader className="space-y-2">
					<CardTitle>Employee List</CardTitle>
					<CardDescription>
						A list of employees with their details
					</CardDescription>
				</CardHeader>

				<CardContent className="flex-1 min-h-0  flex flex-col gap-4">
					<div className="flex min-h-0 flex-1 flex-col">
						<Table>
							<TableHeader>
								<TableRow className="sticky top-0 bg-black">
									<TableHead className="w-1/5 px-4 pl-1 py-3 text-left">
										Employee Name
									</TableHead>
									<TableHead className="w-1/5 px-4 pl-1 py-3 text-center">
										Department
									</TableHead>
									<TableHead className="w-1/5 px-4 py-3 text-center">
										Duration (months)
									</TableHead>
									<TableHead className="w-1/5 px-4 py-3 text-center">
										Duration <br />
										(days left)
									</TableHead>
									<TableHead className="w-1/5 px-4 py-3 text-center">
										Start Date
									</TableHead>
									<TableHead className="w-1/5 px-4 py-3 text-center">
										End Date
									</TableHead>
									<TableHead className="w-1/5 px-4 pr-1 py-3 text-right">
										Location
									</TableHead>
								</TableRow>
							</TableHeader>
							{/* <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"> */}

							<TableBody>
								{filteredConts?.length > 0 ? (
									filteredConts.map((contract) => {
										const today = new Date();
										const endDate = new Date(contract.end_date);

										// difference in days between dates

										const diffDays = Math.ceil(
											(endDate.getTime() - today.getTime()) /
												(1000 * 60 * 60 * 24)
										);

										// if the contract ended we give a 0 number
										const remainingDays = diffDays > 0 ? diffDays : 0;

										const startDateFormatted = new Date(
											contract.join_date
										).toLocaleDateString();
										const endDateFormatted = new Date(
											contract.end_date
										).toLocaleDateString();

										return (
											<TableRow key={contract.user_id}>
												<TableCell>
													{contract.job_level !== "Staff" &&
													contract.job_level !== "Non Staff" ? (
														<Badge variant="destructive">
															{contract.first_name}
														</Badge>
													) : (
														contract.first_name
													)}
												</TableCell>

												<TableCell className="text-center">
													{contract.organization_name}
												</TableCell>
												<TableCell className="text-center">
													{Number.isNaN(contract.durationMonths)
														? "Untouchable"
														: contract.durationMonths}
												</TableCell>

												<TableCell className="text-center">
													{remainingDays}
												</TableCell>

												<TableCell className="text-center">
													{startDateFormatted}
												</TableCell>

												<TableCell className="text-center">
													{endDateFormatted}
												</TableCell>

												<TableCell className="text-right">
													{contract.branch}
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<></>
								)}
							</TableBody>
							{/* </div> */}
						</Table>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

// some stuff that we might use later
/*
const filteredContracts = contracts.filter((contract) => {
		` ${contract.employeeName} ${contract.startDate}  ${contract.endDate} ${contract.durationMonths} `
			.toLowerCase()
			.includes(search.toLowerCase());
	});

	// filtering employees whose birthday is in the next month
	const filteredContractsEndingMonths = contract?.filter((contract) => {
		const matchesSearch =
			`${contract.id} ${contract.employeeName} ${contract.startDate} ${contract.endDate} ${contract.durationMonths}`
				.toLowerCase()
				.includes(search.toLowerCase());

		if (!matchesSearch) return false;

		// checking birthday in a month
		const birthDate = new Date(contract.startDate);
		const currentDate = new Date();

		const changeInMonths = months;

		const birthMonth = birthDate.getMonth();

		const currentMonth = currentDate.getMonth();

		const monthDiff = (birthMonth - currentMonth + 12) % 12;

		return monthDiff === changeInMonths;
	});

*/
