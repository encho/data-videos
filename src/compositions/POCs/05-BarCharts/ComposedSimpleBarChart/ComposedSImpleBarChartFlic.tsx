import {usePage} from '../../../../acetti-components/PageContext';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';
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
		<Page show>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader>
					<TitleWithSubtitle
						title="Composed Simple Bar Chart"
						subtitle="Wahlergebnisse Brandenburg 2024"
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
								stroke="transparent"
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
									hideLabels
									theme={theme}
									data={rightData}
									width={rightArea.width}
									height={rightArea.height}
								/>
							</HtmlArea>
						</div>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter>
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
			<PageLogo />
		</Page>
	);
};
