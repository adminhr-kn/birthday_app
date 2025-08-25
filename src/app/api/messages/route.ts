import { NextResponse } from "next/server";
// import { EmailTemplate } from "../../../components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
	try {
		// taking data from front request
		const body = await req.json();

		console.log("Body from client", body);

		const { contracts } = body;

		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: ["kodingstuff899@gmail.com", "nicholas@kodingnext.com"],
			subject: "Hello world",
			html: `
				<h1>Contracts expiring soon</h1>
				<div>
					${contracts.map(
						(c: any) =>
							`<div key="${c.user_id}" style="margin:20px;">
							<div>
								<h1>
									<b>
										${c.first_name} ${c.last_name}
									</b>
								</h1>
								<p>📍 ${c.branch}</p>
								<p>📅 End: ${new Date(c.end_date).toLocaleDateString()}</p>
								<p>📱 ${c.mobile_phone}</p>
								<p>✉️ ${c.email}</p>
							</div>
						</div>`
					)}
				</div>
			`
		});

		console.log("response", { data, error });
		if (error) {
			return Response.json({ error });
		}

		return Response.json(data);
	} catch (err) {
		console.error("api crashed!!!", err);
		return NextResponse.json({ error: "Something went wrong" });
	}
}
