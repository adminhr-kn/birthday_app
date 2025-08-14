import Contracts_Page from "@/components/contracts-client";
import HomeClient from "@/components/home-client";

import {Contract} from "@/types/contracts";


export default async function Fetching(){

    // Fetching Data from API, 
    // cache: "no-store" means that the data will not be cached and will be fetched fresh every time
    const fetched_data= await fetch("http://localhost:3000/contracts.json",{cache: "no-store"});

    // Parsing the data to JSON format
    // and storing it in a variable called data
    const data: Contract[] = await fetched_data.json();

    return(
        <Contracts_Page contracts={data}/>
    )

}