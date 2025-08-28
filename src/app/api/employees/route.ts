import crypto from "crypto";

// client id from the site
const MEKARI_CLIENT_ID = process.env.MEKARI_CLIENT_ID || "";
// secret our key
const MEKARI_CLIENT_SECRET = process.env.MEKARI_CLIENT_SECRET || "";

// the url we are taking stuff from
const MEKARI_BASE_URL = "https://api.mekari.com";

// we need to generate it, so then we can pass it to the get function
function generateHmacHeaders(method: string, pathWithQuery: string) {
	// dateTime rquired for the API
	const datetime = new Date().toUTCString();

	// where we are trying to send our request and with what method(post/get)
	const requestLine = `${method} ${pathWithQuery} HTTP/1.1`;

	// payload which is a string containing the date and the request line
	const payload = [`date: ${datetime}`, requestLine].join("\n");

	// signature, we encrypt with sha256 (enctypting method) we encrypt our client secret
	// we also encrypt the payload containing the date and the request line
	// and then we change the formatting to the base64 format
	const signature = crypto
		.createHmac("sha256", MEKARI_CLIENT_SECRET)
		.update(payload)
		.digest("base64");

	// we create the authorization header with the username, algorithm, headers, and signature
	// we also add the date, authorization, and accept headers
	// basically our key to get the data, connected with API
	const authHeader = `hmac username="${MEKARI_CLIENT_ID}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`;

	// and then we return the header object
	//  accept tells we accept json and receive json
	return {
		Date: datetime,
		Authorization: authHeader,
		Accept: "application/json",
		"Content-Type": "application/json",
	};
}

export async function GET() {
	try {
		// we tell what method, what path we are taking the data from
		const method = "GET";
		const path = "/v2/talenta/v3/employees";

		// creating serach params, after ? in url
		const params = new URLSearchParams();

		// we set the limit to 100, because we want to get all the data
		params.set("limit", "100");

		// we create the header for the API
		const headers = generateHmacHeaders(method, path);

		//if last page is more than 1(from first request result{employees:[], pagination:[]}), keep fetching data and combine into one
		let pagesLeft = 1;
		let employees = <any>[];
		let pagination = <any>[];
		// 1 page we are on
		let page = 1;
		while (pagesLeft > 0) {
			// we create the query string with the params we created
			params.set("page", `${page}`);

			// our query is created
			const query = params.toString();

			// we combine it with the pah
			const pathWithQuery = `${path}?${query}`;

			// we fetch the data from the API
			const res = await fetch(`${MEKARI_BASE_URL}${pathWithQuery}`, {
				method,
				headers,
			});

			// if not okay the f off
			if (!res.ok) {
				const errorData = await res.text();
				return new Response(
					JSON.stringify({ error: errorData, status: res.status }),
					{ status: res.status }
				);
			}

			// we change the data to json type and return it
			const data = await res.json();

			console.log(data);
			// if we are on the last page, we stop
			// there is no more data to fetch
			if (data.data.pagination.last_page === page) {
				pagesLeft = 0;
			}
			// else we move to the next page and keep fetching
			else {
				page += 1;
				// we get the actual number of pages left to fetch
				pagesLeft = data.data.pagination.last_page;
			}
			// we combine the employees fetched with the previous ones
			// we add to employees the things we fetched
			employees = [...employees, ...data.data.employees];
			// we get the pagination to show nhow much more
			pagination = data.data.pagination;
		}

		// the returning partis
		return Response.json(employees);
		//return Response.json([employees, pagination]);

		// if issue then return the error
	} catch (err: any) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
		});
	}
}
