'use client'

export default function Success() {
	return (
		<main className="h-screen flex items-center justify-center">
			<div className="bg-white rounded-lg w-1/2 font-sans text-gray-700 p-16">
					<h1 className="text-3xl pb-4">Congrats, you've entered the contest!</h1>
					<p className="text-gray-500">The draw will happen on <i>some date</i>, we will reach out if you've won!</p>
			</div>
		</main>
	)
}