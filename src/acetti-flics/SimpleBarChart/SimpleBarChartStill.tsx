import {useVideoConfig} from 'remotion';

import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {useBarChartLayout} from './useBarChartLayout';
import {useAnimatedBarChartLayout} from './useAnimatedBarChartLayout';

export type TSimpleBarChartData = {
	label: string;
	value: number;
	barColor?: string;
	valueLabel: string;
	id: string;
}[];

type TSimpleBarChartLayoutProps = {
	theme: ThemeType;
	data: TSimpleBarChartData;
	width: number;
	baseline: number;
	labelWidth?: number;
	valueLabelWidth?: number;
	showLayout?: boolean;
};

export const SimpleBarChartLayout: React.FC<TSimpleBarChartLayoutProps> = ({
	theme,
	data,
	width,
	baseline,
	showLayout = false,
	labelWidth,
	valueLabelWidth,
}) => {
	// @ts-ignore: have to have this otherwise we have "a bug in react" error message
	const {fps, durationInFrames} = useVideoConfig();

	const barChartLayout = useBarChartLayout({
		baseline,
		theme,
		data,
		width,
		labelWidth,
		valueLabelWidth,
	});

	const zeroLineArea = barChartLayout.getZeroLineArea();

	return (
		<div
			style={{
				position: 'relative',
				width: barChartLayout.width,
				height: barChartLayout.height,
			}}
		>
			{showLayout ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...barChartLayout.gridLayout} stroke="#555" />
				</div>
			) : null}

			<HtmlArea area={zeroLineArea} fill="cyan"></HtmlArea>

			{data.map((it) => {
				const barArea = barChartLayout.getBarArea(it.id);
				const labelArea = barChartLayout.getLabelArea(it.id);
				const valueLabelArea = barChartLayout.getValueLabelArea(it.id);

				// TODO better colors
				return (
					<>
						<HtmlArea area={labelArea} fill="yellow"></HtmlArea>
						<HtmlArea area={barArea} fill="magenta"></HtmlArea>
						<HtmlArea area={valueLabelArea} fill="green"></HtmlArea>
					</>
				);
			})}
		</div>
	);
};

export const SimpleBarChartStill: React.FC<
	TSimpleBarChartLayoutProps & {valueDomain: [number, number]}
> = ({
	theme,
	data,
	width,
	baseline,
	showLayout = false,
	labelWidth,
	valueLabelWidth,
	valueDomain,
}) => {
	// @ts-ignore: have to have this otherwise we have "a bug in react" error message
	const {fps, durationInFrames} = useVideoConfig();

	const barChartLayout = useAnimatedBarChartLayout({
		baseline,
		theme,
		data,
		width,
		labelWidth,
		valueLabelWidth,
		valueDomain,
	});

	const zeroLineArea = barChartLayout.getZeroLineArea();

	return (
		<div
			style={{
				position: 'relative',
				width: barChartLayout.width,
				height: barChartLayout.height,
			}}
		>
			{showLayout ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...barChartLayout.gridLayout} stroke="#555" />
				</div>
			) : null}

			<HtmlArea area={zeroLineArea} fill="#fff" opacity={0.2}></HtmlArea>

			{data.map((it) => {
				const barArea = barChartLayout.getBarArea(it.id);
				const labelArea = barChartLayout.getLabelArea(it.id);
				const valueLabelArea = barChartLayout.getValueLabelArea(it.id);

				// TODO better colors
				return (
					<>
						<HtmlArea area={labelArea} fill="#fff" opacity={0.5}></HtmlArea>
						<HtmlArea area={barArea} fill="#fff" opacity={0.5}></HtmlArea>
						<HtmlArea
							area={valueLabelArea}
							fill="#fff"
							opacity={0.5}
						></HtmlArea>
					</>
				);
			})}

			<HtmlArea
				area={{
					...zeroLineArea,
					x1: barChartLayout.zeroLineX - 10 / 2,
					width: 10,
				}}
				fill="#fff"
				opacity={0.5}
			></HtmlArea>
		</div>
	);
};
