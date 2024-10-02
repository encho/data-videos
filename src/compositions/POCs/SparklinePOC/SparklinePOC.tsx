import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {SparklineLarge} from '../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';

const timeSeries = [
	// {value: 50, date: new Date('2010-12-31')},
	{value: 150, date: new Date('2010-12-31')},
	{value: 57, date: new Date('2011-12-31')},
	{value: 58, date: new Date('2012-12-31')},
	{value: 65, date: new Date('2013-12-31')},
	{value: 77, date: new Date('2014-12-31')},
	{value: 94, date: new Date('2015-12-31')},
	{value: 91, date: new Date('2016-12-31')},
	{value: 65, date: new Date('2017-12-31')},
	{value: 114, date: new Date('2018-12-31')},
	{value: 60, date: new Date('2019-12-31')},
	{value: 64, date: new Date('2020-12-31')},
	{value: 118, date: new Date('2021-12-31')},
	{value: 94, date: new Date('2022-12-31')},
	{value: 127, date: new Date('2023-12-31')},
	{value: 68, date: new Date('2024-12-31')},
	{value: 40, date: new Date('2025-12-31')},
	{value: 88, date: new Date('2026-12-31')},
];

export const sparklinePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SparklinePOC: React.FC<z.infer<typeof sparklinePOCSchema>> = ({
	themeEnum,
}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const CHART_WIDTH = 900;
	const CHART_HEIGHT = 280;

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
						<FadeInAndOutText>SparklinePOC</FadeInAndOutText>
					</div>
				</div>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 200}}>
				<SparklineLarge
					data={timeSeries}
					width={CHART_WIDTH}
					height={CHART_HEIGHT}
					theme={theme}
				/>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
