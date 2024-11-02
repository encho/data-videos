import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';
import invariant from 'tiny-invariant';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {LastLogoPage} from '../../03-Page/LastLogoPageContentDev/LastLogoPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SparklineLarge} from '../../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {data} from './inflationData';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const apiBasedSparklinesPresentationCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ApiBasedSparklinesPresentationComposition: React.FC<
	z.infer<typeof apiBasedSparklinesPresentationCompositionSchema>
> = ({themeEnum}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	const tickers = ['DJX', 'S&P 500', 'Bitcoin', 'Gold'];

	const singleDuration = Math.floor(fps * 5);
	const remainingDuration = durationInFrames - tickers.length * singleDuration;

	const sequences: {[k: string]: {from: number; durationInFrames: number}} = {
		DJX: {from: 0, durationInFrames: singleDuration},
		'S&P 500': {from: singleDuration * 1, durationInFrames: singleDuration},
		Bitcoin: {from: singleDuration * 2, durationInFrames: singleDuration},
		Gold: {from: singleDuration * 3, durationInFrames: singleDuration},
		LastSlide: {from: singleDuration * 4, durationInFrames: remainingDuration},
	};

	return (
		<>
			{tickers.map((it, i) => {
				const ticker = it;
				const sequence = sequences[ticker];
				invariant(sequence);

				return (
					<Sequence key={ticker} layout="none" {...sequence}>
						<SingleSparklineSlide ticker={it} theme={theme} />;
					</Sequence>
				);
			})}
			<Sequence {...sequences['LastSlide']} layout="none">
				<LastLogoPage theme={theme} />
			</Sequence>
		</>
	);
};

export const SingleSparklineSlide: React.FC<{
	ticker: string;
	theme: ThemeType;
}> = ({ticker, theme}) => {
	// const DEBUG = true;
	const DEBUG = false;

	const {ref, dimensions} = useElementDimensions();

	const {fps} = useVideoConfig();

	const baseline = theme.page.baseline * 2;

	const props = data;

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 2000, // to better show grid rails!
		height: dimensions ? dimensions.height : 1000,
		nrColumns: 1,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 0,
		rowPaddingPixels: 0,
		columnPaddingPixels: theme.page.baseline * 0,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const neonColors = {
		neonGreen: '#39FF14',
		neonPink: '#FF6EC7',
		neonBlue: '#0D98BA',
		neonOrange: '#FF5F1F',
	};

	const ts1Extent = extent(props.sparklines[0].timeseries, (it) => it.value);

	// TODO deprecate for this use case
	const min = Math.min(ts1Extent[0] as number);
	const max = Math.max(ts1Extent[1] as number);
	// TODO deprecate for this use case
	const commonDomain = [min, max] as [number, number];

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
					// showArea={DEBUG}
				>
					<TitleWithSubtitle
						title={ticker}
						subtitle={'Description for Ticker here...'}
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
						<Sequence from={Math.floor(fps * 0.75)} layout="none">
							<div style={{position: 'relative'}}>
								<DisplayGridRails
									{...matrixLayout}
									// stroke={theme.TypographicLayouts.gridLayout.lineColor}
									stroke={DEBUG ? '#292929' : 'transparent'}
								/>
								<HtmlArea area={area_1}>
									<Sequence from={0} layout="none">
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'001'}
												data={props.sparklines[0].timeseries}
												width={area_1.width}
												height={area_1.height}
												theme={theme}
												domain={commonDomain}
												lineColor={neonColors.neonGreen}
												formatString="0.00 %"
												showLayout={DEBUG}
											/>
										</Sequence>
									</Sequence>
								</HtmlArea>
							</div>
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
						<div
							style={{
								maxWidth: '62%',
								textWrap: 'pretty',
							}}
						>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={theme.page.baseline}
							>
								{props.dataSource}
							</TypographyStyle>
						</div>
					</div>
					<PageLogo theme={theme} />
				</PageFooter>
			</div>
		</Page>
	);
};
