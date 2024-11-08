import {usePage} from '../../../../acetti-components/PageContext';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/NewPage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {
	SimpleBarChart,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';

export const ComposedSimpleBarChartFlic: React.FC<{
	theme: ThemeType;
	leftData: TSimpleBarChartData;
	rightData: TSimpleBarChartData;
}> = ({theme, leftData, rightData}) => {
	const {ref, dimensions} = useElementDimensions();
	const page = usePage();

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 20000, // to better show grid rails!
		height: dimensions ? dimensions.height : 20000,
		nrColumns: 2,
		nrRows: 1,
		columnSizes: [
			{type: 'fr', value: 2},
			{type: 'fr', value: 1},
		],
		rowSpacePixels: 80,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
	});

	const leftArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const rightArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});

	return (
		<Page show theme={theme}>
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
						title={'Composed Simple Bar Chart'}
						subtitle={'Wahlergebnisse Brandenburg 2024'}
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
					{dimensions &&
					Math.round(matrixLayout.width) === Math.round(dimensions.width) ? (
						<div style={{position: 'relative'}}>
							<DisplayGridRails
								{...matrixLayout}
								// stroke={'#252525'}
								stroke={'transparent'}
							/>

							<HtmlArea area={leftArea}>
								<SimpleBarChart
									theme={theme}
									data={leftData}
									width={leftArea.width}
									height={leftArea.height}
									// hideLabels
									// showLayout
								/>
							</HtmlArea>

							<HtmlArea area={rightArea}>
								<SimpleBarChart
									theme={theme}
									data={rightData}
									width={rightArea.width}
									height={rightArea.height}
									hideLabels
									// showLayout
								/>
							</HtmlArea>
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
								baseline={page.baseline}
							>
								Data Source: German Bundesbank 2024 Paper on Evolutional Finance
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
			<PageLogo theme={theme} />
		</Page>
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
		parteiName: 'BVB',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];

const wahlergebnis2024_percChange: {
	parteiName: string;
	change: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', change: -0.1, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', change: -0.3, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', change: 0.5, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', change: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', change: 0.2, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', change: -0.05, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', change: 0.1, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB',
		change: 0.02,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', change: -0.8, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', change: 0.9, farbe: '#808080', id: 'SON'}, // Others Gray
];
