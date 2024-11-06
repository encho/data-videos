import {useVideoConfig} from 'remotion';
import React from 'react';
import invariant from 'tiny-invariant';

import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {SimpleBarChart, TSimpleBarChartData} from './SimpleBarChart';
import {SimpleBarChartTransition} from './SimpleBarChartTransition';
import {useBarChartRaceKeyframes} from '../../compositions/POCs/05-BarCharts/BarChartRace_CustomLabel/useBarChartRaceKeyframes';
import {KeyFramesSequence} from '../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {TBarChartLabelComponent} from './SimpleBarChart';
import {TKeyFramesGroup} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';

type TBarChartRaceData = {
	index: string;
	data: TSimpleBarChartData;
	valueDomain: [number, number];
}[];

type TBarChartRaceProps = {
	theme: ThemeType;
	data: TBarChartRaceData;
	width: number;
	height: number;
	keyframes?: TKeyFramesGroup;
	CustomLabelComponent?: TBarChartLabelComponent;
};

export const BarChartRace: React.FC<TBarChartRaceProps> = ({
	theme,
	data,
	width,
	height,
	keyframes: keyframesProp,
	CustomLabelComponent,
}) => {
	const {fps, durationInFrames} = useVideoConfig();

	const dataIds = data.map((it) => it.index);
	const transitionPairs = getPairs(dataIds);

	const keyframes = useBarChartRaceKeyframes({
		fps,
		durationInFrames,
		dataIds,
		keyframes: keyframesProp,
	});

	const BARCHARTRACE_HEIGHT = height;
	const BARCHARTRACE_WIDTH = width;

	const dataStart = data[0].data;
	const valueDomainStart = data[0].valueDomain;
	invariant(dataStart);
	invariant(valueDomainStart);

	const dataEnd = data[data.length - 1].data;
	const valueDomainEnd = data[data.length - 1].valueDomain;
	invariant(dataEnd);
	invariant(valueDomainEnd);

	return (
		<div>
			<KeyFramesSequence
				exclusive
				name={`enter-${dataIds[0]}`}
				from={`DATA_ENTER_START__${dataIds[0]}`}
				to={`DATA_ENTER_END__${dataIds[0]}`}
				keyframes={keyframes}
			>
				{/* <TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={20}
					marginBottom={3}
				>
					{dataIds[0]}
				</TypographyStyle> */}

				<SimpleBarChart
					data={dataStart}
					width={BARCHARTRACE_WIDTH}
					height={BARCHARTRACE_HEIGHT}
					theme={theme}
					animateExit={false}
					valueDomain={valueDomainStart}
					CustomLabelComponent={CustomLabelComponent}
				/>
			</KeyFramesSequence>

			{transitionPairs.map(([fromId, toId]) => {
				const startKeyframe = `TRANSITION_START__${fromId}_${toId}`;
				const endKeyframe = `TRANSITION_END__${fromId}_${toId}`;

				const itemFrom = data.find((it) => it.index === fromId);
				const itemTo = data.find((it) => it.index === toId);

				invariant(itemFrom);
				invariant(itemTo);

				const dataFrom = itemFrom.data;
				const valueDomainFrom = itemFrom.valueDomain;

				const dataTo = itemTo.data;
				const valueDomainTo = itemTo.valueDomain;

				return (
					<div>
						<KeyFramesSequence
							exclusive
							name={`${fromId}-${toId}`}
							from={startKeyframe}
							to={endKeyframe}
							keyframes={keyframes}
						>
							{/* <TypographyStyle
								typographyStyle={theme.typography.textStyles.h1}
								baseline={20}
								marginBottom={3}
							>
								{toId}
							</TypographyStyle> */}

							{/* TODO here we need the  */}
							<SimpleBarChartTransition
								height={BARCHARTRACE_HEIGHT}
								dataFrom={dataFrom}
								valueDomainFrom={valueDomainFrom}
								dataTo={dataTo}
								valueDomainTo={valueDomainTo}
								width={BARCHARTRACE_WIDTH}
								theme={theme}
								CustomLabelComponent={CustomLabelComponent}
							/>
						</KeyFramesSequence>
					</div>
				);
			})}

			<KeyFramesSequence
				exclusive
				name={`enter-${dataIds[dataIds.length - 1]}`}
				from={`DATA_EXIT_START__${dataIds[dataIds.length - 1]}`}
				to={`DATA_EXIT_END__${dataIds[dataIds.length - 1]}`}
				keyframes={keyframes}
			>
				{/* <TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={20}
					marginBottom={3}
				>
					{dataIds[dataIds.length - 1]}
				</TypographyStyle> */}

				<SimpleBarChart
					data={dataEnd}
					width={BARCHARTRACE_WIDTH}
					height={BARCHARTRACE_HEIGHT}
					theme={theme}
					animateEnter={false}
					valueDomain={valueDomainEnd}
					CustomLabelComponent={CustomLabelComponent}
					// showLayout
					// hideLabels={HIDE_LABELS}
				/>
			</KeyFramesSequence>
		</div>
	);
};

function getPairs(dataIds: string[]): [string, string][] {
	return dataIds
		.map((id, index) =>
			index < dataIds.length - 1 ? [id, dataIds[index + 1]] : null
		)
		.filter((pair): pair is [string, string] => pair !== null);
}
// Example usage:
// const dataIds = ['2020', '2021', '2022', '2023'];
// const result = getPairs(dataIds);
// console.log(result); // Output: [["2020", "2021"], ["2021", "2022"], ["2022", "2023"]]
