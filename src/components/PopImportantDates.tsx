"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button>Important dates!</Button>
			</PopoverTrigger>
			<PopoverContent>
				{dates.length === 0 ? (
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
								(nextEvent.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
							);
							return (
								<li key={index} className="mt-[10px] mb-[10px]">
									<strong>{cnt.name}</strong>
									<div className="flex flex-col">
										<div>
											{cnt.date} {cnt.type}
										</div>
										<div> In {daysprecise} day{daysprecise !== 1 ? "s" : ""}</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</PopoverContent>
		</Popover>
	);
}
