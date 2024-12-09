import {useVideoConfig} from 'remotion';
import {z} from 'zod';

import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';

export const missingDataTimeseriesCompositionSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const MissingDataTimeseriesComposition: React.FC<
	z.infer<typeof missingDataTimeseriesCompositionSchema>
> = ({themeEnum}) => {
	const {height, width} = useVideoConfig();

	const theme = useThemeFromEnum(themeEnum);

	const timeSeries = mockTimeseriesDecJan;

	return (
		<GlobalVideoContextWrapper>
			<PageContext
				width={width}
				height={height}
				margin={80}
				nrBaselines={40}
				theme={theme}
			>
				<Page>
					<TimeseriesAnimation timeSeries={timeSeries} />
				</Page>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};

const mockTimeseriesDecJan: TimeSeries = [
	{date: new Date('2024-12-01'), value: null},
	{date: new Date('2024-12-02'), value: null},
	{date: new Date('2024-12-03'), value: null},
	{date: new Date('2024-12-04'), value: null},
	{date: new Date('2024-12-05'), value: null},
	{date: new Date('2024-12-06'), value: null},
	{date: new Date('2024-12-07'), value: null},
	{date: new Date('2024-12-08'), value: null},
	{date: new Date('2024-12-09'), value: null},
	{date: new Date('2024-12-10'), value: null},
	{date: new Date('2024-12-11'), value: null},
	{date: new Date('2024-12-12'), value: null},
	{date: new Date('2024-12-13'), value: null},
	{date: new Date('2024-12-14'), value: null},
	{date: new Date('2024-12-15'), value: null},
	{date: new Date('2024-12-16'), value: null},
	{date: new Date('2024-12-17'), value: null},
	{date: new Date('2024-12-18'), value: null},
	{date: new Date('2024-12-19'), value: null},
	{date: new Date('2024-12-20'), value: null},
	{date: new Date('2024-12-21'), value: 108.8},
	{date: new Date('2024-12-22'), value: 110.02},
	{date: new Date('2024-12-23'), value: 113.47},
	{date: new Date('2024-12-24'), value: 112.94},
	{date: new Date('2024-12-25'), value: 111.82},
	{date: new Date('2024-12-26'), value: 111.32},
	{date: new Date('2024-12-27'), value: 113.65},
	{date: new Date('2024-12-28'), value: 114.81},
	{date: new Date('2024-12-29'), value: 114.25},
	{date: new Date('2024-12-30'), value: 115.77},
	{date: new Date('2024-12-31'), value: 116.47},
	{date: new Date('2025-01-01'), value: 118.9},
	{date: new Date('2025-01-02'), value: 118.0},
	{date: new Date('2025-01-03'), value: 117.85},
	{date: new Date('2025-01-04'), value: 117.56},
	{date: new Date('2025-01-05'), value: 115.13},
	{date: new Date('2025-01-06'), value: 116.23},
	{date: new Date('2025-01-07'), value: 117.25},
	{date: new Date('2025-01-08'), value: 117.76},
	{date: new Date('2025-01-09'), value: 117.79},
	{date: new Date('2025-01-10'), value: 115.46},
	{date: new Date('2025-01-11'), value: 115.12},
	{date: new Date('2025-01-12'), value: 114.93},
	{date: new Date('2025-01-13'), value: 113.83},
	{date: new Date('2025-01-14'), value: 114.0},
	{date: new Date('2025-01-15'), value: 115.31},
	{date: new Date('2025-01-16'), value: 119.59},
	{date: new Date('2025-01-17'), value: 120.43},
	{date: new Date('2025-01-18'), value: 121.45},
	{date: new Date('2025-01-19'), value: 121.8},
	{date: new Date('2025-01-20'), value: 118.46},
	{date: new Date('2025-01-21'), value: 118.91},
	{date: new Date('2025-01-22'), value: 119.53},
	{date: new Date('2025-01-23'), value: 124.96},
	{date: new Date('2025-01-24'), value: 125.07},
	{date: new Date('2025-01-25'), value: 126.18},
	{date: new Date('2025-01-26'), value: null},
	{date: new Date('2025-01-27'), value: null},
	{date: new Date('2025-01-28'), value: 127.55},
	{date: new Date('2025-01-29'), value: 129.56},
];
