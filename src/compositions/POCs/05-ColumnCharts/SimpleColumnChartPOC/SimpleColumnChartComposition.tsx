import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleColumnChart} from '../../../../acetti-flics/SimpleColumnChart/SimpleColumnChart';
import {EconomistTitleWithSubtitle} from '../../04-BarCharts/EconomistTitleWithSubtitle';
import {EconomistDataSource} from '../../04-BarCharts/EconomistDataSource';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';

export const simpleColumnChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

const timeSeries = [
	{value: 1135, date: new Date('2018-12-31')},
	{value: 1160, date: new Date('2019-12-31')},
	{value: 1185, date: new Date('2020-12-31')},
	{value: 1210, date: new Date('2021-12-31')},
	{value: 1250, date: new Date('2022-12-31')},
];

export const SimpleColumnChartComposition: React.FC<
	z.infer<typeof simpleColumnChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const columnChartData = timeSeries.map((it) => ({
		label: `${it.date.getFullYear()}`,
		value: it.value,
		columnColor: '#fff',
		valueLabel: `$${it.value}`,
	}));

	const baseline = 28;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<EconomistTitleWithSubtitle
				title={'Simple Column Chart'}
				subtitle={'Display Categorical Data Horizontally'}
				theme={theme}
			/>

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
					baseline={baseline}
					theme={theme}
				/>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
