import {z} from 'zod';
import {Sequence} from 'remotion';

import {CapSizeTextNew} from '../02-TypographicLayouts/BaselineGrid/CapSizeTextNew';
import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../../acetti-typography/TextEffects/FadeInAndOutText';
import {SimpleColumnChart} from '../../../acetti-flics/SimpleColumnChart/SimpleColumnChart';
import {useFontFamiliesLoader} from '../../../acetti-typography/useFontFamiliesLoader';
import {WaterfallTextEffect} from '../../../acetti-typography/TextEffects/WaterfallTextEffect';

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

	const labelTextProps = {
		fontFamily: 'Inter' as const,
		fontWeight: 600,
		capHeight: 28,
		color: 'white', // TODO from theme
	};

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
							fontSize: 70,
							marginTop: 80,
							fontFamily: 'Arial',
							fontWeight: 700,
						}}
					>
						<FadeInAndOutText>Multiple Column Chart</FadeInAndOutText>
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 100,
					marginTop: 80,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 40,
					}}
				>
					<SimpleColumnChart
						data={columnChartData}
						height={300}
						baseFontSize={20}
						valueDomain={[0, 2000] as [number, number]}
						delayInFrames={90 * 1}
					/>
					<CapSizeTextNew
						fontFamily={labelTextProps.fontFamily}
						fontWeight={labelTextProps.fontWeight}
						color={labelTextProps.color}
						capHeight={labelTextProps.capHeight}
						lineGap={0}
					>
						<WaterfallTextEffect>Stuttgart</WaterfallTextEffect>
					</CapSizeTextNew>
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 40,
					}}
				>
					<Sequence layout="none" from={90 * 10}>
						<SimpleColumnChart
							data={columnChartData2}
							height={300}
							baseFontSize={20}
							valueDomain={[0, 2000] as [number, number]}
							delayInFrames={90 * 1}
							// TODO
							// delay or from
						/>
						<CapSizeTextNew
							fontFamily={labelTextProps.fontFamily}
							fontWeight={labelTextProps.fontWeight}
							color={labelTextProps.color}
							capHeight={labelTextProps.capHeight}
							lineGap={0}
						>
							<WaterfallTextEffect>Berlin</WaterfallTextEffect>
						</CapSizeTextNew>
					</Sequence>
				</div>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
