import { sql } from '@vercel/postgres';
import { Entry } from '../../models/definitions'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
	try {
		revalidatePath(request.url)
		console.log("Fetching data")
		const data = await sql<Entry>`SELECT name "Name", ighandle "Instagram Handle", verified "Verified", won "Already Won" FROM entries WHERE contest_date = '2024-06-03'`;

		var colnames = data.fields.map(f => {
			return {
				field: f.name
			}
		});
		return Response.json({
			rows: data.rows,
			columns: colnames
		});
	} catch (error) {
		console.error('Database Error:', error);
		return Response.error();
	}
}