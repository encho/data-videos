import React from 'react';
import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';
import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const simpleBarChartPerfectSizingCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChartPerfectSizingComposition: React.FC<
	z.infer<typeof simpleBarChartPerfectSizingCompositionSchema>
> = ({themeEnum}) => {
	const {width, height} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum);
	const {ref: divRef, dimensions} = useElementDimensions();

	const barChartData = wahlergebnis2024.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		id: it.id,
		barColor: colorPalettes.Indigo[500],
		valueLabel: formatPercentage(it.prozent),
	}));

	return (
		<PageContext
			margin={50}
			nrBaselines={60}
			width={width}
			height={height}
			theme={theme}
		>
			<Page show>
				{({baseline}) => {
					return (
						<>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									position: 'relative',
								}}
							>
								<PageHeader
									theme={theme}
									// showArea={showAreas}
								>
									<TitleWithSubtitle
										title="AfD: Vormarsch in Brandenburg mit eigenen Feuerwerkskoerpern"
										subtitle="Wahlergebnisse Brandenburg 2024"
										theme={theme}
									/>
								</PageHeader>

								<div
									ref={divRef}
									style={{
										flex: 1,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									{dimensions ? (
										<div>
											<SimpleBarChart
												data={barChartData}
												width={dimensions.width}
												height={dimensions.height}
												// showLayout
												// baseline={getBarChartBaseline(dimensions.height, barChartData)}
												theme={theme}
											/>
										</div>
									) : null}
								</div>

								{/* TODO introduce evtl. also absolute positioned footer */}
								<PageFooter
									theme={theme}
									// showArea={showAreas}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'flex-end',
										}}
									>
										<div style={{maxWidth: '62%'}}>
											<TypographyStyle
												typographyStyle={theme.typography.textStyles.dataSource}
												baseline={baseline}
											>
												Data Source: German Bundesbank 2024 Paper on Evolutional
												Finance
											</TypographyStyle>
										</div>
									</div>
								</PageFooter>
							</div>
							<PageLogo theme={theme} />
						</>
					);
				}}
			</Page>
		</PageContext>
	);
};

function formatPercentage(value: number): string {
	return (
		(value * 100).toLocaleString(undefined, {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1,
		}) + '%'
	);
}
// Example usage:
// console.log(formatPercentage(0.12)); // Output: "12.0%"

const wahlergebnis2024: {
	parteiName: string;
	prozent: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 30.9 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 29.2 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', prozent: 13.5 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', prozent: 4.1 / 100, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', prozent: 3.0 / 100, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB/Freie Wähler',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];
