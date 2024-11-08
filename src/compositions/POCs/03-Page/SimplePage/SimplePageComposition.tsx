import React from 'react';
import {z} from 'zod';

import {PageContext} from '../../../../acetti-components/PageContext';
import {useElementDimensions} from './useElementDimensions';
import {Page, PageFooter, PageLogo, PageHeader} from './NewPage';
import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {BaselineGrid} from '../../02-TypographicLayouts/BaselineGrid/BaselineGrid';
import {VerticalBaselineGrid} from '../../02-TypographicLayouts/BaselineGrid/VerticalBaselineGrid';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {useVideoConfig} from 'remotion';

export const simplePageCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

const showAreas = true;
const showGrid = true;

export const SimplePageComposition: React.FC<
	z.infer<typeof simplePageCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();
	const {width, height} = useVideoConfig();

	return (
		<PageContext margin={50} nrBaselines={40} width={width} height={height}>
			<Page theme={theme} show>
				{({contentWidth, contentHeight, baseline}) => {
					return (
						<>
							<PageLogo theme={theme} />
							{showGrid ? (
								<>
									<BaselineGrid
										width={contentWidth}
										height={contentHeight}
										baseline={baseline}
										{...theme.TypographicLayouts.baselineGrid}
										lineColor="rgba(90,60,0,1.0)"
										strokeWidth={2}
									/>
									<VerticalBaselineGrid
										width={contentWidth}
										height={contentHeight}
										baseline={baseline}
										{...theme.TypographicLayouts.baselineGrid}
										lineColor="rgba(90,60,0,1.0)"
										strokeWidth={2}
									/>
								</>
							) : null}

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									position: 'relative',
								}}
							>
								<PageHeader theme={theme} showArea={showAreas}>
									<TitleWithSubtitle
										title={
											'Simple Page Composition. This will be great stuff...'
										}
										subtitle={'This is a subtitle. Lol...'}
										theme={theme}
									/>
								</PageHeader>

								<div
									ref={ref}
									style={{
										flex: 1,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									{dimensions ? (
										<div>
											<SimpleBarChart
												data={data}
												width={dimensions.width}
												height={dimensions.height}
												// showLayout
												theme={theme}
											/>
										</div>
									) : null}
								</div>

								{/* TODO introduce evtl. also absolute positioned footer */}
								<PageFooter theme={theme} showArea={showAreas}>
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

// TODO from centralilzed location/ fake data generator
const data = wahlergebnis2024.map((it) => ({
	label: it.parteiName,
	value: it.prozent,
	id: it.id,
	barColor: '#fff',
	valueLabel: formatPercentage(it.prozent),
}));
