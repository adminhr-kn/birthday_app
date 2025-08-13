import HomePage from "../page";


function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function FetchedData() {
    // Symulacja wolnego serwera (2 sekundy)
    await delay(2000);

    const res = await fetch("http://localhost:3000/users.json", { cache: "no-store" });
    const data = await res.json();

    return <HomePage initialEmployees={data} />;
}
