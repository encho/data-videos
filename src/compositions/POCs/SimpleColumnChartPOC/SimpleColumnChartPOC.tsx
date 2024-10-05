import {z} from 'zod';
// import {Sequence} from 'remotion';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {SimpleColumnChart} from './SimpleColumnChart';

export const simpleColumnChartPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

// function formatPercentage(value: number): string {
// 	return (
// 		(value * 100).toLocaleString(undefined, {
// 			minimumFractionDigits: 1,
// 			maximumFractionDigits: 1,
// 		}) + '%'
// 	);
// }
// Example usage:
// console.log(formatPercentage(0.12)); // Output: "12.0%"

const timeSeries = [
	{value: 1135, date: new Date('2018-12-31')},
	{value: 1160, date: new Date('2019-12-31')},
	{value: 1185, date: new Date('2020-12-31')},
	{value: 1210, date: new Date('2021-12-31')},
	{value: 1250, date: new Date('2022-12-31')},
];

// const timeSeries = [
// 	{value: 91, date: new Date('2016-12-31')},
// 	{value: 65, date: new Date('2017-12-31')},
// 	{value: 114, date: new Date('2018-12-31')},
// 	{value: 60, date: new Date('2019-12-31')},
// 	{value: 64, date: new Date('2020-12-31')},
// ];

export const SimpleColumnChartPOC: React.FC<
	z.infer<typeof simpleColumnChartPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const columnChartData = timeSeries.map((it) => ({
		label: `${it.date.getFullYear()}`,
		value: it.value,
		columnColor: '#fff',
		valueLabel: `$${it.value}`,
	}));

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 60,
							marginTop: 50,
							fontFamily: 'Arial',
							fontWeight: 700,
						}}
					>
						<FadeInAndOutText>SimpleColumnChartPOC</FadeInAndOutText>
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 50,
					marginTop: 120,
				}}
			>
				<SimpleColumnChart
					data={columnChartData}
					height={600}
					baseFontSize={30}
				/>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
