"use client"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import { ColDef, GridApi, ModuleRegistry, RefreshCellsParams } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import { useState } from 'react';
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);
let gridApi: GridApi;

function isForceRefreshSelected() {
  return (document.querySelector("#forceRefresh") as HTMLInputElement).checked;
}

function isSuppressFlashSelected() {
  return (document.querySelector("#suppressFlash") as HTMLInputElement).checked;
}

const onChangeHandler = (event) => {
	console.log(event.data)
	console.log(`New value: ${event.value}`)
}

function selectRandomWinner(data) {
	console.log(data)
	let validEntries = data.rows.filter(item => {
		return !item.Won;
	})
	let count = validEntries.length;

	let idxWinner = Math.floor(Math.random() * count);

	let winner = validEntries[idxWinner]
	winner.Won = true

	console.log("Selected winner: " + winner.Name)
	console.log(winner)
	console.log(data)

	return winner.Name;
}

export default function Admin() {
	const {data, error} = useSWR('/api/data', fetcher)

	const [winner, setWinner] = useState(null)

	if (error) return (
		<main>
			<h1 className='text-3xl'>Admin Portal</h1>
			<div>Failed to load data...</div>
		</main>
	)
	if (!data) return (
		<main>
			<h1 className='text-3xl'>Admin Portal</h1>
			<div>Loading...</div>
		</main>
	)

	const onClickHandler = () => {
		console.log("Getting new winner!")
		let results = selectRandomWinner(data)
		if (results) {
			console.log("Winner: " + results)
			setWinner(results)
			gridApi.refreshCells()
		}
	}

	return (
		<main className="h-screen flex items-center justify-center">
			<div className="bg-white flex rounded-lg w-3/4 h-3/4 font-sans">
				<div className="flex-1 text-gray-700 p-16">
					<h1 className='text-3xl mb-2'>Manage Contest Entries</h1>
					<p>{winner != null ? "Winner selected: " + winner : ""}</p>
					<button
						type="button"
						className='bg-gray-500 font-bold text-sm text-white py-3 mt-6 rounded-lg w-full'
						onClick={onClickHandler}
					>
						Randomly select next winner!
					</button>
					<div className="mt-4 h-3/4">
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
										type: 'fitGridWidth'
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