"use client"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import { useState } from 'react';
import useSWR from 'swr'
import { CellValueChangedEvent } from 'ag-grid-community';

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);

const onChangeHandler = (event: CellValueChangedEvent<any, any>) => {
}

function selectRandomWinner(data: { rows: any[]; columns: any[] }) {
	console.log(data)
	let validEntries = data.rows.filter(item => {
		return !item['Already Won'];
	})
	let count = validEntries.length;
	if (count == 0) return "No one to choose from!";

	let idxWinner = Math.floor(Math.random() * count);

	let winner = validEntries[idxWinner]
	winner['Already Won'] = true

	return winner.Name;
}

const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

export default function Admin() {
	const {data, error} = useSWR('/api/data', fetcher)
	const [winner, setWinner] = useState(null)

	if (error) return (
		<main className="flex flex-row min-h-screen justify-center items-center">
			<div className="bg-white flex rounded-lg w-3/4 h-3/4 font-sans">
				<div className="flex-1 text-gray-700 p-16">
					<h1 className='text-3xl mb-2'>Manage Contest Entries</h1>
					<div className="mt-4 h-3/4">Failed to load data...</div>
				</div>
			</div>
		</main>
	)
	if (!data) return (
		<main className="flex flex-row min-h-screen justify-center items-center">
			<div className="bg-white flex rounded-lg w-3/4 h-3/4 font-sans">
				<div className="flex-1 text-gray-700 p-16">
					<h1 className='text-3xl mb-2'>Manage Contest Entries</h1>
					<div className="mt-4 h-3/4">Loading...</div>
				</div>
			</div>
		</main>
	)

	const onClickHandler = () => {
		console.log("Getting new winner!")
		let results = selectRandomWinner(data)
		if (results) {
			console.log("Winner: " + results)
			setWinner(results)
		}
	}

	return (
		<main className="bg-white font-sans items-center justify-center">
			<div>
				<div className=" text-gray-700 p-10">
					<h1 className='text-3xl mb-2 text-center'>Manage Contest Entries</h1>
					<p>{winner != null ? "Winner selected: " + winner : ""}</p>
					<button
						type="button"
						className='bg-gray-500 font-bold text-sm text-white py-3 mt-6 rounded-lg w-full'
						onClick={onClickHandler}
					>
						Randomly select next winner!
					</button>
					<div className="mt-4 h-screen">
						<div className='ag-theme-material grid-container'>
							<AgGridReact
								className='ag-grid'
								rowData={data.rows}
								columnDefs={data.columns}
								defaultColDef={
									{
										editable: true,
										resizable: false
									 }
								}
								pagination={true}
								paginationPageSize={20}
								onCellValueChanged={event => onChangeHandler(event)}
								gridOptions={{
									autoSizeStrategy: {
										type: "fitCellContents"
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}