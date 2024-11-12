import {interpolate} from 'remotion';
import {ReactNode} from 'react';

import {usePage} from '../../../../acetti-components/PageContext';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

function roundToTwoDecimals(num: number): number {
	return parseFloat(num.toFixed(2));
}
// // Example usage:
// const input: number = 123.456789;
// const output: number = roundToTwoDecimals(input);
// console.log(output); // Output: 123.46

export const PeriodScaleAnimationContextDebugger: React.FC<
	TPeriodScaleAnimationContext
> = ({
	frame,
	currentSliceInfo,
	currentTransitionInfo,
	periodsScale,
	allTransitionsAndSlicesOverview,
}) => {
	const {theme, contentWidth} = usePage();

	const Row = ({children}: {children: ReactNode}) => {
		return (
			<div
				style={{
					display: 'flex',
					gap: 5,
					backgroundColor: 'rgba(0,0,0,0.3)',
					color: '#00aa99',
					padding: 0,
					fontWeight: 800,
				}}
			>
				{children}
			</div>
		);
	};

	const Value = ({children}: {children: ReactNode}) => {
		return <div style={{color: '#00ffaa'}}>{children}</div>;
	};

	const topLevelListItems = [
		{
			key: 'frame',
			value: JSON.stringify(frame),
		},
		{
			key: 'periodsScale.visibleDomainIndices',
			value: JSON.stringify(periodsScale.visibleDomainIndices),
		},
		{
			key: 'periodsScale.fullPeriodDomainIndices',
			value: JSON.stringify(periodsScale.fullPeriodDomainIndices),
		},
	];

	const currentTransitionInfoListItems = [
		// {
		// 	key: 'Object.keys():',
		// 	value: JSON.stringify(Object.keys(currentTransitionInfo), undefined, 2),
		// },
		{
			key: 'fromDomainIndices',
			value: JSON.stringify(currentTransitionInfo.fromDomainIndices),
		},
		{
			key: 'toDomainIndices',
			value: JSON.stringify(currentTransitionInfo.toDomainIndices),
		},
		{
			key: 'index',
			value: JSON.stringify(currentTransitionInfo.index),
		},
		{
			key: 'numberOfSlices',
			value: JSON.stringify(currentTransitionInfo.numberOfSlices),
		},
		{
			key: 'frameRange',
			value: JSON.stringify(currentTransitionInfo.frameRange),
		},
		{
			key: 'durationInFrames',
			value: JSON.stringify(currentTransitionInfo.durationInFrames),
		},
		{
			key: 'durationInSeconds',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.durationInSeconds)
			),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentTransitionInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.framesPercentage)
			),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.easingPercentage)
			),
		},
		{
			key: 'transitionType',
			value: JSON.stringify(currentTransitionInfo.transitionType),
		},
	];
	const currentSliceInfoListItems = [
		// {
		// 	key: 'Object.keys():',
		// 	value: JSON.stringify(Object.keys(currentSliceInfo), undefined, 2),
		// },
		{key: 'index', value: JSON.stringify(currentSliceInfo.index)},
		{
			key: 'frameRange',
			value: JSON.stringify(currentSliceInfo.frameRange),
		},
		{
			key: 'durationInFrames',
			value: JSON.stringify(currentSliceInfo.durationInFrames),
		},
		{
			key: 'durationInSeconds',
			value: JSON.stringify(currentSliceInfo.durationInSeconds),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentSliceInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentSliceInfo.framesPercentage)
			),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentSliceInfo.easingPercentage)
			),
		},
		{
			key: 'domainIndicesFrom',
			value: JSON.stringify(currentSliceInfo.domainIndicesFrom),
		},
		{
			key: 'domainIndicesTo',
			value: JSON.stringify(currentSliceInfo.domainIndicesTo),
		},
	];

	return (
		<div
			style={
				{
					// position: 'absolute', zIndex: 500
				}
			}
		>
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<div
					id="periodscale-animation-context-debugger__allTransitionsAndSlicesOverview"
					style={{
						backgroundColor: 'rgba(0,100,200,0.5)',
						padding: 20,
						fontSize: 20,
					}}
				>
					<div style={{fontSize: 50}}>
						<div
							style={{
								fontWeight: 700,
								color: theme.typography.textStyles.h1.color,
							}}
						>
							allTransitionsAndSlicesOverview
						</div>
					</div>

					{allTransitionsAndSlicesOverview.map((it) => {
						const isActive = it.transitionIndex === currentTransitionInfo.index;

						if (!isActive) return null;

						return (
							<div
								style={{
									margin: 5,
									border: isActive ? '3px yellow solid' : undefined,
								}}
							>
								<Row>
									<div>{'transitionIndex'}</div>
									<Value>{it.transitionIndex}</Value>
								</Row>
								<Row>
									<div>{'frameRange'}</div>
									<Value>{JSON.stringify(it.frameRange)}</Value>
								</Row>
								<Row>
									<div>{'numberOfSlices'}</div>
									<Value>{JSON.stringify(it.numberOfSlices)}</Value>
								</Row>
								<Row>
									<div>{'domainIndicesFrom'}</div>
									<Value>{JSON.stringify(it.domainIndicesFrom)}</Value>
								</Row>
								<Row>
									<div>{'domainIndicesTo'}</div>
									<Value>{JSON.stringify(it.domainIndicesTo)}</Value>
								</Row>
								<Row>
									<div>{'slices'}</div>
									<Value>
										{it.slices.map((sliceInfo) => {
											const isActiveSlice =
												sliceInfo.sliceIndex === currentSliceInfo.index;
											return (
												<div
													style={{
														margin: 5,

														border: isActiveSlice
															? '3px yellow solid'
															: undefined,
													}}
												>
													<Row>
														<div>{'sliceIndex'}</div>
														<Value>
															{JSON.stringify(sliceInfo.sliceIndex)}
														</Value>
													</Row>
													<Row>
														<div>{'frameRange'}</div>
														<Value>
															{JSON.stringify(sliceInfo.frameRange)}
														</Value>
													</Row>
												</div>
											);
										})}
										{/* {JSON.stringify(it.slices)} */}
									</Value>
								</Row>
							</div>
						);
					})}
				</div>
				<div id="left-panel">
					<div
						id="periodscale-animation-context-debugger__topLevel"
						style={{
							backgroundColor: 'rgba(0,100,200,0.5)',
							padding: 20,
							fontSize: 20,
						}}
					>
						<div style={{fontSize: 50}}>
							<div
								style={{
									fontWeight: 700,
									color: theme.typography.textStyles.h1.color,
								}}
							>
								topLevel
							</div>
						</div>
						<div
							style={{
								backgroundColor: 'rgba(0,0,0,0.2)',
								padding: 20,
								fontSize: 20,
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 5,
								}}
							>
								{topLevelListItems.map((it) => {
									return (
										<Row>
											<div>{it.key}</div>
											<Value>{it.value}</Value>
										</Row>
									);
								})}
							</div>

							<PeriodScaleZoomVisualizer
								visibleDomainIndices={periodsScale.visibleDomainIndices}
								fullDomainIndices={periodsScale.fullPeriodDomainIndices}
								fromDomainIndices={
									currentSliceInfo.periodsScaleFrom.visibleDomainIndices
								}
								toDomainIndices={
									currentSliceInfo.periodsScaleTo.visibleDomainIndices
								}
								width={contentWidth / 2}
							/>
						</div>
					</div>
					<div style={{display: 'flex', flexDirection: 'row'}}>
						<div
							id="periodscale-animation-context-debugger__currentTransitionInfo"
							style={{
								backgroundColor: 'rgba(0,0,200,0.5)',
								padding: 20,
								fontSize: 20,
							}}
						>
							<div style={{fontSize: 50}}>
								<div
									style={{
										fontWeight: 700,
										color: theme.typography.textStyles.h1.color,
									}}
								>
									currentTransitionInfo
								</div>
							</div>
							<div
								style={{
									backgroundColor: 'rgba(0,0,0,0.2)',
									padding: 20,
									fontSize: 20,
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 5,
									}}
								>
									{currentTransitionInfoListItems.map((it) => {
										return (
											<Row>
												<div>{it.key}</div>
												<Value>{it.value}</Value>
											</Row>
										);
									})}
								</div>
							</div>
						</div>

						<div
							id="periodscale-animation-context-debugger__currentSliceInfo"
							style={{
								backgroundColor: 'rgba(200,0,0,0.5)',
								padding: 20,
								fontSize: 20,
							}}
						>
							<div style={{fontSize: 50}}>
								<div
									style={{
										fontWeight: 700,
										color: theme.typography.textStyles.h1.color,
									}}
								>
									currentSliceInfo
								</div>
							</div>
							<div
								style={{
									backgroundColor: 'rgba(0,0,0,0.2)',
									padding: 20,
									fontSize: 20,
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 5,
									}}
								>
									{currentSliceInfoListItems.map((it) => {
										return (
											<Row>
												<div>{it.key}</div>
												<Value>{it.value}</Value>
											</Row>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const PeriodScaleZoomVisualizer: React.FC<{
	visibleDomainIndices: [number, number];
	fullDomainIndices: [number, number];
	fromDomainIndices: [number, number];
	toDomainIndices: [number, number];
	width: number;
}> = ({
	visibleDomainIndices,
	fullDomainIndices,
	fromDomainIndices,
	toDomainIndices,
	width,
}) => {
	const {theme} = usePage();

	const mapToX = (x: number) => {
		return interpolate(x, fullDomainIndices, [0, width]);
	};

	return (
		<div style={{color: theme.typography.colors.title.main, fontSize: 30}}>
			<div
				style={{
					backgroundColor: 'gray',
					width: mapToX(fullDomainIndices[1] - fullDomainIndices[0]),
					height: 50,
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						height: 30,
						width: mapToX(visibleDomainIndices[1] - visibleDomainIndices[0]),
						top: 10,
						left: mapToX(visibleDomainIndices[0]),
						backgroundColor: 'white',
					}}
				></div>
				{/* from: red */}
				<div
					style={{
						position: 'absolute',
						height: 10,
						width: mapToX(fromDomainIndices[1] - fromDomainIndices[0]),
						top: 0,
						left: mapToX(fromDomainIndices[0]),
						backgroundColor: 'red',
					}}
				></div>
				{/* to: green */}
				<div
					style={{
						position: 'absolute',
						height: 10,
						width: mapToX(toDomainIndices[1] - toDomainIndices[0]),
						top: 40,
						left: mapToX(toDomainIndices[0]),
						backgroundColor: 'green',
					}}
				></div>
			</div>
		</div>
	);
};
