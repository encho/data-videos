import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
}) => {
	return (
		<AbsoluteFill style={{backgroundColor}}>
			<h1 style={{color: textColor, fontSize: 50}}>hello axis transition</h1>
		</AbsoluteFill>
	);
};
