const { parseVersionInfo } = require("next/dist/server/dev/parse-version-info")

const users = [
	{
		id: 'e2cf6fe5-170f-40e4-904b-46495ebfd1ed',
		name: 'Admin',
		email: 'admin@lb.com'
	}
]

const entries = [
	{
		id: '90383802-1247-420b-8d73-baedba8dfc74',
		name: 'Contestant1',
		ighandle: 'APerson',
		verified: false,
		won: false,
		contest_date: '2024-06-03'
	},
	{
		id: '2d6d72c0-702c-48eb-814c-75488b9ad5ad',
		name: 'Contestant2',
		ighandle: 'APerson2',
		verified: false,
		won: false,
		contest_date: '2024-06-03'
	},
	{
		id: 'b1124644-1784-4f3d-b00f-e01dcb30a91f',
		name: 'Contestant3',
		ighandle: 'APerson3',
		verified: false,
		won: false,
		contest_date: '2024-06-03'
	},
	{
		id: 'aaf493aa-8727-42fe-8b99-3bc9c8a8e4d3',
		name: 'Contestant4',
		ighandle: 'APerson4',
		verified: false,
		won: false,
		contest_date: '2024-06-03'
	},
	{
		id: '65b2f943-8cd9-4853-9cbc-8143070ef527',
		name: 'Contestant5',
		ighandle: 'APerson5',
		verified: false,
		won: false,
		contest_date: '2024-06-03'
	}
]

module.exports = {
	users,
	entries
}