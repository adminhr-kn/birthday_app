"use client";

import { useState } from "react";

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
    <main className="flex min-h-screen w-full p-6 gap-6 bg-gray-50">
      {/* Birthday list */}
      <Card className="flex flex-col w-1/2 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle>Birthday App</CardTitle>
          <CardDescription>
            Search an employee by Name, Surname, Location or Birthday
          </CardDescription>

          <div className="text-sm text-gray-600">
            A list of people whose birthday is in the selected month
          </div>

          <Select
            defaultValue="1"
            onValueChange={(value) => {
              console.log("Chosen:", value, "=> as a number:", Number(value));
              setMonths(Number(value));
            }}
          >
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
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
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

          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredEmployees.length > 0 ? (
              filteredEmployeesBirthDayLessThanMont.map((emp) => {
                const birthDateFormatted = new Date(
                  emp.birthDate
                ).toLocaleDateString();
                return (
                  <li
                    key={emp.id}
                    className="border rounded-lg p-3 bg-white shadow-sm"
                  >
                    <p className="font-semibold">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{emp.location}</p>
                    <p className="text-sm">Birthday: {birthDateFormatted}</p>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-500 italic">
                No workers with such search conditions
              </li>
            )}
          </ul>
        </CardContent>
        <CardFooter>{/* Możesz tu dodać przyciski jeśli chcesz */}</CardFooter>
      </Card>

      {/* Employee table */}
      <Card className="flex flex-col w-1/2 shadow-lg h-[75vh]">
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
                  <TableHead className="w-40">First Name</TableHead>
                  <TableHead className="w-40">Last Name</TableHead>
                  <TableHead className="w-40">Location</TableHead>
                  <TableHead className="w-32 text-right">Birth Date</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
              <Table className="table-fixed">
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => {
                      return (
                        <TableRow key={emp.id}>
                          <TableCell className="w-16 font-medium">
                            {emp.id}
                          </TableCell>
                          <TableCell className="w-40">
                            {emp.firstName}
                          </TableCell>
                          <TableCell className="w-40">{emp.lastName}</TableCell>
                          <TableCell className="w-40">{emp.location}</TableCell>
                          <TableCell className="w-32 text-right">
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
