// Define the DataItem type
export type DataItem = {
	name: string;
	age: number;
	profession: 'Business' | 'IT' | 'Upper_Management' | 'Consultant';
	income: number;
	gender: 'M' | 'F' | 'X';
	tenureInMonths: number;
};

// Define the array of DataItem
export const data: Array<DataItem> = [
	{
		name: 'Alice',
		age: 30,
		profession: 'IT',
		income: 70000,
		gender: 'F',
		tenureInMonths: 24,
	},
	{
		name: 'Bob',
		age: 45,
		profession: 'Business',
		income: 85000,
		gender: 'M',
		tenureInMonths: 120,
	},
	{
		name: 'Carol',
		age: 39,
		profession: 'Upper_Management',
		income: 150000,
		gender: 'F',
		tenureInMonths: 96,
	},
	{
		name: 'Dave',
		age: 28,
		profession: 'Consultant',
		income: 60000,
		gender: 'M',
		tenureInMonths: 36,
	},
	{
		name: 'Eve',
		age: 50,
		profession: 'Business',
		income: 90000,
		gender: 'X',
		tenureInMonths: 180,
	},
];
