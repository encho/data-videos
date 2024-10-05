import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {SimpleColumnChart} from '../../../acetti-flics/SimpleColumnChart/SimpleColumnChart';
import {useFontFamiliesLoader} from '../../../acetti-typography/useFontFamiliesLoader';

export const multipleSimpleColumnChartPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

const timeSeries = [
	{value: 1135, date: new Date('2018-12-31')},
	{value: 1160, date: new Date('2019-12-31')},
	{value: 1185, date: new Date('2020-12-31')},
	{value: 1210, date: new Date('2021-12-31')},
	{value: 1250, date: new Date('2022-12-31')},
];

const timeSeries2 = [
	{value: 1000, date: new Date('2018-12-31')},
	{value: 2000, date: new Date('2019-12-31')},
	{value: 500, date: new Date('2020-12-31')},
	{value: 800, date: new Date('2021-12-31')},
	{value: 1200, date: new Date('2022-12-31')},
];

// const timeSeries = [
// 	{value: 91, date: new Date('2016-12-31')},
// 	{value: 65, date: new Date('2017-12-31')},
// 	{value: 114, date: new Date('2018-12-31')},
// 	{value: 60, date: new Date('2019-12-31')},
// 	{value: 64, date: new Date('2020-12-31')},
// ];

export const MultipleSimpleColumnChartPOC: React.FC<
	z.infer<typeof multipleSimpleColumnChartPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(['Inter-Regular']);

	const columnChartData = timeSeries.map((it) => ({
		label: `${it.date.getFullYear()}`,
		value: it.value,
		columnColor: '#fff',
		valueLabel: `$${it.value}`,
	}));

	const columnChartData2 = timeSeries2.map((it) => ({
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
						<FadeInAndOutText>
							{/* Multiple Simple Column Chart POC */}
							{/* Multiple Simple Column Chart */}
							{/* Multiple Simple Column Ch. */}
							Multi. Smpl. Column Ch.
							{/* POC */}
						</FadeInAndOutText>
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 70,
					marginTop: 120,
				}}
			>
				<SimpleColumnChart
					data={columnChartData}
					height={260}
					baseFontSize={20}
				/>
				<SimpleColumnChart
					data={columnChartData2}
					height={260}
					baseFontSize={20}
				/>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
