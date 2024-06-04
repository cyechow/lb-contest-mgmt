"use client"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import { ColDef, GridApi, ModuleRegistry, RefreshCellsParams } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { CellValueChangedEvent } from 'ag-grid-community';

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);
let gridApi: GridApi;

function isForceRefreshSelected() {
  return (document.querySelector("#forceRefresh") as HTMLInputElement).checked;
}

function isSuppressFlashSelected() {
  return (document.querySelector("#suppressFlash") as HTMLInputElement).checked;
}

const onChangeHandler = (event: CellValueChangedEvent<any, any>) => {
	console.log(event.data)
	console.log(`New value: ${event.value}`)
}

function selectRandomWinner(data: { rows: any[]; columns: any[] }) {
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

const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

export default function Admin() {
	const {data, error} = useSWR('/api/data', fetcher)
	// const [data, setData] = useState(null)
	// const [loading, setLoading] = useState(true)
	const [winner, setWinner] = useState(null)

	// useEffect(() => {
	// 	fetch('/api/data')
	// 		.then(res => res.json())
	// 		.then(data => {
	// 				setData(data)
	// 				setLoading(false)
	// 			}
	// 		)
	// })

	if (error) return (
		<main className="h-screen flex items-center justify-center">
			<div className="bg-white flex rounded-lg w-3/4 h-3/4 font-sans">
				<div className="flex-1 text-gray-700 p-16">
					<h1 className='text-3xl mb-2'>Manage Contest Entries</h1>
					<div className="mt-4 h-3/4">Failed to load data...</div>
				</div>
			</div>
		</main>
	)
	if (!data) return (
		<main className="h-screen flex items-center justify-center">
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