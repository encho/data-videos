import {Sequence, useVideoConfig} from 'remotion';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	SimpleBarChart,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const NegativeBarChartPage: React.FC<{
	theme: ThemeType;
	title: string;
	subtitle: string;
	data: TSimpleBarChartData;
}> = ({theme, title, subtitle, data}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	return (
		<Page theme={theme}>
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
					<TitleWithSubtitle title={title} subtitle={subtitle} theme={theme} />
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
						<Sequence from={Math.floor(fps * 0.75)} layout="none">
							<SimpleBarChart
								data={data}
								width={dimensions.width}
								height={dimensions.height}
								theme={theme}
								// showLayout
							/>
						</Sequence>
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
								baseline={theme.page.baseline}
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
	{parteiName: 'Grüne', change: 0, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
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
