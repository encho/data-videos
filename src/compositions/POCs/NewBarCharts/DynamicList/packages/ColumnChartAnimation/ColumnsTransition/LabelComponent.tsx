import {memo, forwardRef} from 'react';

import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';
import {TColumnChartItem} from '../useColumnChartTransition/useColumnChartTransition';

type TLabelComponentProps = {
	label: string;
	id: string;
	animateExit: boolean;
	animateEnter: boolean;
	baseline: number;
	theme: ThemeType;
};

export type TBarChartLabelComponent = React.ComponentType<TLabelComponentProps>;

export const DefaultLabelComponent = memo(
	({
		// eslint-disable-next-line
		// id,
		label,
		animateExit,
		animateEnter,
		baseline,
		theme,
	}: {
		label: string;
		id: string;
		baseline: number;
		theme: ThemeType;
		// eslint-disable-next-line
		animateEnter?: boolean;
		// eslint-disable-next-line
		animateExit?: boolean;
	}) => {
		return (
			<div
				style={{
					display: 'flex',
					// justifyContent: 'flex-end',
					justifyContent: 'center',
					alignItems: 'center',
					// height: '100%',
					// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
					textWrap: 'nowrap',
					backgroundColor: 'rgba(255,0,255,0.2)',
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizLabel}
					baseline={baseline}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
						animateExit={animateExit}
						animateEnter={animateEnter}
					>
						{label}
					</TextAnimationSubtle>
				</TypographyStyle>
			</div>
		);
	}
);

interface LabelsDivProps {
	data: TColumnChartItem[];
	theme: ThemeType;
	baseline: number;
	Component: TBarChartLabelComponent;
}

export const MeasureLabels = forwardRef<HTMLDivElement, LabelsDivProps>(
	({data, theme, baseline, Component}, ref) => {
		return (
			<div
				ref={ref}
				style={{
					position: 'fixed',
					left: '-9999px', // Move off-screen
					top: '-9999px',
					whiteSpace: 'nowrap', // Prevent labels from wrapping
					visibility: 'hidden',
				}}
			>
				<div style={{display: 'flex', flexDirection: 'row'}}>
					{data.map((it, i) => (
						<Component
							key={it.id + i}
							id={it.id}
							label={it.label}
							theme={theme}
							baseline={baseline}
							animateEnter={false}
							animateExit={false}
						/>
					))}
				</div>
			</div>
		);
	}
);
