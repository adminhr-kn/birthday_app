"use client";

import { useEffect, useState } from "react";

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

import {
	Check,
	ChevronDownIcon,
	ChevronsUpDown,
	Moon,
	Sun,
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
import { set } from "date-fns";

type Contract = {
	id: number;
	employeeName: string;
	startDate: Date;
	endDate: Date;
	durationMonths: number;
	location: string;
};

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

	// destructuring a setTheme from useTheme hook
	const { setTheme } = useTheme();

	const [filters, setFilter] = useState<ContractFilter>({
		name: "",
		endDate: {
			from: new Date()
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
		new Set(contracts.map((c) => c.location)) // new Set to get unique locations
	).map((loc) => ({
		value: loc,
		label: loc,
	}));
	console.log(filteredLocations);

	console.log(filters);

	// const filteredByObjectValues=Object.entries(filters).filter(value=>{

	//     if(value. === "" || value === 0) return false;

	//     //const matchedNames= `${value.}`
	// })

	useEffect(() => {
		const filteredConts = contract.filter(
			(x) =>
				(filters.name
					? x.employeeName.toLowerCase() === filters.name.toLowerCase()
					: true) &&
				(filters.location
					? x.location.toLowerCase() === filters.location.toLowerCase()
					: true) &&
				(filters.endDate.to
					? new Date(x.endDate) < new Date(filters.endDate.to || new Date())
					: true) &&
				(filters.monthDuration
					? x.durationMonths === filters.monthDuration
					: true)
		);
		console.log("Filtered Contracts:", filteredConts);
	}, [filters]);

	return (
		<main className="flex h-screen w-full p-6 gap-6 bg-background text-foreground">
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
			{/* Birthday list */}
			<Card className="flex flex-col w-1/2 shadow-lg">
				<CardHeader className="space-y-2">
					<CardTitle>Birthday App</CardTitle>
					<CardDescription>
						Search an employee by Name, Surname, Location or Birthday
					</CardDescription>

					<div className="text-sm text-muted-foreground">
						A list of people whose birthday is in the selected month
					</div>

					<Select
						defaultValue="1"
						onValueChange={(value) => {
							console.log("Chosen:", value, "=> as a number:", Number(value));
							setMonths(Number(value));
						}}>
						<SelectTrigger>
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
														// if the clicks the current value, set it to empty string
														// so its not selected anymore
														setValue(
															currentValue === value ? "" : currentValue
														);

														const temp = filters;
														temp["location"] = currentValue;
														setFilter({ ...temp });
														console.log(filters);

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
							<Label htmlFor="startDate">Start Date</Label>

							{/* Once more open or not we have a date picker amd build in onOpenChange */}
							<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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
