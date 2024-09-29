import {z} from 'zod';
import {measureText} from '@remotion/layout-utils';
import {Sequence} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {useHorizontalBarLayout} from './useHorizontalBarLayout';
import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {WaterfallTextEffect} from '../../SimpleStats/WaterfallTextEffect';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, Area, HtmlArea} from '../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../acetti-layout/hooks/useMatrixLayout';

export const simpleBarChartPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChartPOC: React.FC<
	z.infer<typeof simpleBarChartPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const barChartData = [
		{label: 'CDU', value: 32.4, barColor: '#444444', valueLabel: '32.40%'},
		{label: 'AFD', value: 30.1, barColor: '#0044aa', valueLabel: '30.10%'},
		{label: 'SPD', value: 10.1, barColor: '#ff0000', valueLabel: '10.10%'},
		{label: 'Gruene', value: 5.5, barColor: '#22dd77', valueLabel: '5.50%'},
	];

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 50,
							marginTop: 50,
						}}
					>
						SimpleBarChartPOC
					</div>
				</div>

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 30,
							marginTop: 50,
						}}
					>
						{JSON.stringify(barChartData, undefined, 2)}
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 50,
					marginTop: 100,
				}}
			>
				<SimpleBarChartHtml data={barChartData} width={800} height={300} />
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const SimpleBarChartHtml: React.FC<{
	data: {
		label: string;
		value: number;
		barColor?: string;
		valueLabel: string;
	}[];
	width: number;
	height: number;
}> = ({data, width, height}) => {
	const nrColumns = 1;
	const nrRows = data.length;

	const matrixLayout = useMatrixLayout({
		width,
		height,
		nrColumns,
		nrRows,
		rowSpacePixels: 20,
	});

	// labelWidth for each dataitem
	// determine labelWidth from all labelWidth's

	const labelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		fontSize: 36,
		// letterSpacing: 1,
	};

	const labelWidths = data.map(
		(it) => measureText({...labelTextProps, text: it.label}).width
	);
	const labelWidth = Math.max(...labelWidths) * 1.05; // safety width bump

	// valueLabelWidth for each dataitem
	// determine valueLabelWidth from all valueLabelWidth's
	const valueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 700,
		fontSize: 24,
		// letterSpacing: 1,
	};

	const valueLabelWidths = data.map(
		(it) => measureText({...valueLabelTextProps, text: it.valueLabel}).width
	);
	const valueLabelWidth = Math.max(...valueLabelWidths);

	const values = data.map((it) => it.value);
	const valueDomain = [0, Math.max(...values)] as [number, number];

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					position: 'relative',
					width: matrixLayout.width,
					height: matrixLayout.height,
				}}
			>
				{false ? (
					<div style={{position: 'absolute', top: 0, left: 0}}>
						<DisplayGridRails {...matrixLayout} />
					</div>
				) : null}
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<div style={{position: 'relative'}}>
						{data.map((it, i) => {
							const BAR_DELAY = Math.floor(90 * 0.8);
							const barArea = getMatrixLayoutCellArea({
								layout: matrixLayout,
								row: i,
								column: 0,
							});
							return (
								<Sequence from={i * BAR_DELAY}>
									<HtmlArea area={barArea}>
										<HorizontalBar
											width={barArea.width}
											height={barArea.height}
											labelWidth={labelWidth}
											valueLabelWidth={valueLabelWidth}
											label={it.label}
											valueLabel={it.valueLabel}
											labelTextProps={labelTextProps}
											valueLabelTextProps={valueLabelTextProps}
											valueDomain={valueDomain}
											value={it.value}
											// domain
											// ...
										/>
									</HtmlArea>
								</Sequence>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

const LABEL_TEXT_COLOR = '#fff';

export const HorizontalBar: React.FC<{
	width: number;
	height: number;
	labelWidth: number;
	valueLabelWidth: number;
	label: string;
	valueLabel: string;
	valueLabelTextProps: {
		fontFamily: string;
		fontWeight: number;
		fontSize: number;
	};
	labelTextProps: {
		fontFamily: string;
		fontWeight: number;
		fontSize: number;
	};
	value: number;
	valueDomain: [number, number];
}> = ({
	width,
	height,
	labelWidth,
	valueLabelWidth,
	label,
	valueLabel,
	valueLabelTextProps,
	labelTextProps,
	valueDomain,
	value,
}) => {
	const horizontalBarLayout = useHorizontalBarLayout({
		width,
		height,
		valueLabelWidth,
		labelWidth,
		spaceWidth: 20,
	});

	const barWidthScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, horizontalBarLayout.areas.bar.width]);

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<HtmlArea area={horizontalBarLayout.areas.label}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<div style={{...labelTextProps, color: LABEL_TEXT_COLOR}}>
						<WaterfallTextEffect>{label}</WaterfallTextEffect>
					</div>
				</div>
			</HtmlArea>
			<HtmlArea area={horizontalBarLayout.areas.bar} fill="blue">
				{/* <div>bar</div> */}
				<div>{JSON.stringify(valueDomain)}</div>
				<div>{JSON.stringify(barWidthScale(value))}</div>
			</HtmlArea>
			<HtmlArea area={horizontalBarLayout.areas.valueLabel} fill="red">
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<div style={{...valueLabelTextProps}}>{valueLabel}</div>
				</div>
			</HtmlArea>
		</div>
	);
};
