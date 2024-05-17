import {createContext, useContext} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

type TGlobalVideoContext = {
	globalCurrentFrame: number;
	globalDurationInFrames: number;
	globalAnimationPercentage: number;
	globalFramesPerSecond: number;
};

export const GlobalVideoContext = createContext<TGlobalVideoContext>({
	globalCurrentFrame: 0,
	globalDurationInFrames: 0,
	globalAnimationPercentage: 0,
	globalFramesPerSecond: 0,
});

export const GlobalVideoContextWrapper: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const currentFrame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	return (
		<GlobalVideoContext.Provider
			value={{
				globalCurrentFrame: currentFrame,
				globalDurationInFrames: durationInFrames,
				globalAnimationPercentage: currentFrame / durationInFrames,
				globalFramesPerSecond: fps,
			}}
		>
			{children}
		</GlobalVideoContext.Provider>
	);
};

export const useGlobalVideoContext = () => {
	const contextValue = useContext(GlobalVideoContext);
	return contextValue;
};
