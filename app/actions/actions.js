'use server'
import { sql } from '@vercel/postgres';

export async function saveEntry(formData) {
	console.log('Saving entry')

	let verified = false;
	let won = false;
	let contest_date = '2024-06-03'
	await sql`
 		INSERT INTO entries (name, ighandle, verified, won, contest_date)
 		VALUES (${formData.name}, ${formData.ighandle}, ${verified}, ${won}, ${contest_date})
	`;
}