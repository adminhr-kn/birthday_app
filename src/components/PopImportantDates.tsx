"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import LogOutButton from "@/components/ui/LogOutButton";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Content } from "next/font/google";
import { useEffect, useState } from "react";

interface ImportantDate {
	type: string;
	name: string;
	date: string;
}

export default function PoppingImportantDates() {
	const [dates, setDates] = useState<ImportantDate[]>([]);
	useEffect(() => {
		fetch("/importantdates.json")
			.then((res) => res.json())
			.then((data) => setDates(data));
	}, []);

	const actualdate = new Date();

	// we got rid of important dates, idea was basically not useful, instead we hib logout button
	// checking etc stays for the future if needed and showing how to operate on such things
	return (
		<div className="flex flex-col gap-2">
			<Popover>
				{/* <PopoverTrigger asChild>
					<Button>Important dates!</Button>
				</PopoverTrigger> */}
				<PopoverContent
					align="start"
					sideOffset={8}
					className="w-auto max-w-xs p-4 flex flex-col gap-2">
					{/* {dates.length === 0 ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : (
						<ul>
							{dates.map((cnt, index) => {
								const eventdate = new Date(cnt.date);

								const today = new Date();

								// we take month and a day
								const month = eventdate.getMonth();
								const day = eventdate.getDate();

								// we make an event this year
								let nextEvent = new Date(today.getFullYear(), month, day);

								// if event has passed we set timer for a next year
								if (nextEvent < today) {
									nextEvent.setFullYear(nextEvent.getFullYear() + 1);
								}

								const daysprecise = Math.ceil(
									(nextEvent.getTime() - today.getTime()) /
										(1000 * 60 * 60 * 24)
								);
								return (
									<li key={index} className="mt-[10px] mb-[10px]">
										<strong>{cnt.name}</strong>
										<div className="flex flex-col">
											<div>
												{cnt.date} {cnt.type}
											</div>
											<div>
												{" "}
												In {daysprecise} day{daysprecise !== 1 ? "s" : ""}
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)} */}
				</PopoverContent>

			</Popover>
				
					{/* we put log out button here so its after the important dates button */}
					<LogOutButton className=" ml-0 sm:-ml-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
				
		</div>
	);
}
