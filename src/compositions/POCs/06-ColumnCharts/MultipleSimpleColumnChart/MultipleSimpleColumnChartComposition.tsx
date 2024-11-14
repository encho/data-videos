import {z} from 'zod';
import {Sequence} from 'remotion';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleColumnChart} from '../../../../acetti-flics/SimpleColumnChart/SimpleColumnChart';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';

export const multipleSimpleColumnChartCompositionSchema = z.object({
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

export const MultipleSimpleColumnChartComposition: React.FC<
	z.infer<typeof multipleSimpleColumnChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);

	const baseline = 20;

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
			<TitleWithSubtitle
				title="Multiple Simple Column Chart"
				subtitle="Display Multiple Categorical Data Horizontally"
				theme={theme}
				baseline={20}
			/>

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
						theme={theme}
						data={columnChartData}
						height={300}
						baseline={baseline}
						valueDomain={[0, 2000] as [number, number]}
						delayInFrames={90 * 1}
					/>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.body}
						baseline={baseline}
					>
						<WaterfallTextEffect>Brandenburg Wahl</WaterfallTextEffect>
					</TypographyStyle>
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
							theme={theme}
							data={columnChartData2}
							height={300}
							baseline={baseline}
							valueDomain={[0, 2000] as [number, number]}
							delayInFrames={90 * 1}
							// TODO
							// delay or from
						/>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							<WaterfallTextEffect>Brandenburg Wahl</WaterfallTextEffect>
						</TypographyStyle>
					</Sequence>
				</div>
			</div>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
