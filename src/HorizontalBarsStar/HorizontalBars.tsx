import {max} from 'd3-array';
import {scaleBand, scaleLinear} from 'd3-scale';
import {
	Img,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

const zBarColors = z.object({
	background: zColor(),
	border: zColor(),
	text: zColor(),
});

export const zBarItem = z.object({
	label: z.string(),
	description: z.string(),
	imageSource: z.string(), // TODO rather url here?
	value: z.number(),
	colors: zBarColors,
});

export const horizontalBarsSchema = z.object({
	dataItems: z.array(zBarItem),
});

export const HorizontalBars: React.FC<z.infer<typeof horizontalBarsSchema>> = ({
	dataItems,
}) => {
	const {width, height} = useVideoConfig();

	// TODO titleHeight from config, dependent on horiz/vertical/square layout and resolution
	const titleHeight = 150;
	const availableHeight = height - titleHeight;

	const barsScaleBand = scaleBand()
		.domain(dataItems.map((it) => it.label))
		.range([0, availableHeight])
		.paddingInner(0.05)
		.paddingOuter(0);

	const valuesScaleLinear = scaleLinear()
		.domain([0, max(dataItems.map((it) => it.value))] as [number, number])
		.range([0, width - 20]);

	return (
		<div
			style={{
				position: 'absolute',
				top: titleHeight,
				bottom: 0,
				left: 0,
				right: 0,
			}}
		>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
				}}
			>
				{dataItems.map((it, i) => {
					const y1 = barsScaleBand(it.label) as number;
					const bandwidth = barsScaleBand.bandwidth();
					return (
						<Sequence from={(i + 1) * 5}>
							<HorizontalBar
								key={it.label}
								// isActive
								height={bandwidth}
								width={valuesScaleLinear(it.value)}
								label={it.label}
								description={it.description}
								imageSource={it.imageSource}
								top={y1}
								colors={it.colors}
							/>
						</Sequence>
					);
				})}
			</div>
		</div>
	);
};

type THorizontalBarProps = {
	// isActive: boolean;
	width: number;
	height: number;
	top: number;
	label: string;
	description: string;
	colors: {background: string; border: string; text: string};
	imageSource: string;
};

const HorizontalBar = ({
	label,
	description,
	imageSource,
	height,
	width,
	top,
	colors,
}: THorizontalBarProps) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeInOutExpo(barProgress);

	const BORDER_WIDTH = 8;

	return (
		<div
			style={{
				position: 'absolute',
				top,
				height,
				width: width * zero_to_1,
				left: 0,
				backgroundColor: colors.background,
				borderRightStyle: 'solid',
				borderRightWidth: BORDER_WIDTH,
				borderRightColor: colors.border,
				fontSize: 30,
				borderRadius: 4,
			}}
		>
			<Sequence>
				<BarDescription
					textColor={colors.text}
					label={label}
					text={description}
					imageSource={imageSource}
				/>
			</Sequence>
		</div>
	);
};

const BarDescription = ({
	imageSource,
	textColor,
	label,
	text,
}: {
	imageSource: string;
	label: string;
	textColor: string;
	text: string;
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const percentageProgress = frame / durationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeInOutExpo(barProgress);

	// const VERTICAL_GAP = -20;
	const TITLE_FONT_SIZE = 24;
	const DESCRIPTION_FONT_SIZE = 22;

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				opacity: zero_to_1,
				color: textColor,
				fontFamily: 'sans-serif',
				marginLeft: 40 - 20 * (1 - zero_to_1),
			}}
		>
			<div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
				<Img
					style={{
						borderRadius: '50%',
						width: 50,
						height: 50,
					}}
					src={imageSource}
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 0,
					}}
				>
					<div style={{fontSize: TITLE_FONT_SIZE, fontWeight: 600}}>
						{label}
					</div>
					<div style={{fontSize: DESCRIPTION_FONT_SIZE, fontWeight: 300}}>
						{text}
					</div>
				</div>
			</div>
		</div>
	);
};

// https://easings.net/
function easeInOutExpo(x: number): number {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5
		? 2 ** (20 * x - 10) / 2
		: (2 - 2 ** (-20 * x + 10)) / 2;
}

function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - x ** 2);
}

function easeOutQuint(x: number): number {
	return 1 - (1 - x) ** 5;
}

const easings = {
	easeInCirc,
	easeInOutExpo,
	easeOutQuint,
};
