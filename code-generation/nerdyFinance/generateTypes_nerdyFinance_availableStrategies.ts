// import {z} from 'zod';
import {writeFileSync} from 'fs';

import {fetchAvailableStrategiesInfo} from '../../src/acetti-http/nerdy-finance/fetchAvailableStrategiesInfo';

console.log('building nerdy.finance zod-types...');

const nerdyFinanceEnv = 'DEV'; // local machine

const fetchAndCreateTypes = async () => {
	const strategies = await fetchAvailableStrategiesInfo(nerdyFinanceEnv);

	console.log(JSON.stringify(strategies));

	// Extract tickers
	const tickers = strategies.map((strategy) => strategy.ticker);

	// Generate Zod enum as a string
	const zodEnumCode = `
import { z } from "zod";

export const zNerdyFinance_availableStrategies = z.enum(${JSON.stringify(
		tickers
	)});

export type TNerdyFinance_availableStrategies = z.infer<typeof zNerdyFinance_availableStrategies>;
`;

	const nerdyFinanceTypesFolder = './src/acetti-http/nerdy-finance/types';

	// Write the Zod enum to a file
	writeFileSync(
		`${nerdyFinanceTypesFolder}/nerdyFinance_types_availableStrategies.ts`,
		zodEnumCode,
		{
			encoding: 'utf-8',
		}
	);

	console.log(
		'nerdyFinance_types_availableStrategies.ts file created successfully.'
	);
};

fetchAndCreateTypes();
