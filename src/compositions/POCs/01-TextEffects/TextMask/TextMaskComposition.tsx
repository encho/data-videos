import {z} from 'zod';
import React, {useState} from 'react';

import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const textMaskCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TextMaskComposition: React.FC<
	z.infer<typeof textMaskCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Text Mask</SlideTitle>
			<div
				style={{
					display: 'flex',
					// justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				{/* <MaskedText
					imageSrc="https://gssc.esa.int/navipedia/images/a/a9/Example.jpg"
					text="Encho"
				/> */}
				<MaskedText2
					imageSrc="https://img.freepik.com/free-photo/green-paint-wall-background-texture_53876-23269.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1728518400&semt=ais_hybrid"
					text="encho."
					fontSize={300}
				/>
				<MaskedText2
					imageSrc="https://img.freepik.com/free-photo/green-paint-wall-background-texture_53876-23269.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1728518400&semt=ais_hybrid"
					text="encho."
					fontSize={300}
				/>
			</div>
			{/* <Position position={{top: 100, left: 100}}></Position> */}
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

interface MaskedTextProps {
	imageSrc: string;
	text: string;
	fontSize: number;
}

const MaskedText2: React.FC<MaskedTextProps> = ({imageSrc, text, fontSize}) => {
	const {
		// fps,
		durationInFrames,
	} = useVideoConfig();
	const frame = useCurrentFrame();

	const animatedYShift = interpolate(
		frame,
		[0, durationInFrames - 1],
		// [0, 100]
		[0, 30]
	);

	const containerStyle: React.CSSProperties = {
		position: 'relative',
		display: 'inline-block',
	};

	const textStyle: React.CSSProperties = {
		fontSize,
		fontWeight: 'bold',
		backgroundImage: `url(${imageSrc})`,
		backgroundRepeat: 'no-repeat',
		// backgroundSize: 'cover',
		backgroundSize: '150%',
		backgroundPosition: `${animatedYShift}% ${animatedYShift}%`,
		//
		// color: 'red',
		//
		color: 'transparent',
		WebkitBackgroundClip: 'text', // For Safari and Chrome
		backgroundClip: 'text',
		//
		display: 'inline-block',
	};

	return (
		<div style={containerStyle}>
			<h1 style={textStyle}>{text}</h1>
			{/* <h1 style={textStyle}>{'heheheheheheeh'}</h1> */}
		</div>
	);
};