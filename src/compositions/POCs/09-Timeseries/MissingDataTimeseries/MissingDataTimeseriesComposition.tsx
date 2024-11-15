import {useVideoConfig} from 'remotion';
import {z} from 'zod';

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

const mockTimeseriesDecJan: {date: Date; value: number}[] = [
	{date: new Date('2024-12-01'), value: 99.54},
	{date: new Date('2024-12-02'), value: 99.67},
	{date: new Date('2024-12-03'), value: 97.96},
	{date: new Date('2024-12-04'), value: 96.07},
	{date: new Date('2024-12-05'), value: 98.19},
	{date: new Date('2024-12-06'), value: 101.4},
	{date: new Date('2024-12-07'), value: 101.76},
	{date: new Date('2024-12-08'), value: 104.27},
	{date: new Date('2024-12-09'), value: 105.49},
	{date: new Date('2024-12-10'), value: 104.7},
	{date: new Date('2024-12-11'), value: 105.92},
	{date: new Date('2024-12-12'), value: 109.5},
	{date: new Date('2024-12-13'), value: 109.93},
	{date: new Date('2024-12-14'), value: 113.56},
	{date: new Date('2024-12-15'), value: 108.82},
	{date: new Date('2024-12-16'), value: 110.96},
	{date: new Date('2024-12-17'), value: 111.63},
	{date: new Date('2024-12-18'), value: 111.54},
	{date: new Date('2024-12-19'), value: 112.22},
	{date: new Date('2024-12-20'), value: 108.74},
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
	{date: new Date('2025-01-26'), value: 126.61},
	{date: new Date('2025-01-27'), value: 124.77},
	{date: new Date('2025-01-28'), value: 127.55},
	{date: new Date('2025-01-29'), value: 129.56},
];
