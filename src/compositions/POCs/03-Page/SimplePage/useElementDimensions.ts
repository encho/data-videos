import {useRef, useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

export function useElementDimensions() {
	// Create a ref to the div you want to measure
	const ref = useRef<HTMLDivElement>(null);

	// State to store dimensions
	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	// Handle to delay rendering
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const waitFirstTime = async () => {
			// ***********************************************************
			// TODO bring these waiting checks into the fonts loader!!!!!
			// ***********************************************************
			// await for when the fonts are loaded in the browser
			await document.fonts.ready;

			// Introduce an additional delay to ensure styles are applied
			// await new Promise((resolve) => setTimeout(resolve, 2000));
			await new Promise((resolve) => setTimeout(resolve, 1000));
		};

		const measure = async () => {
			// const handle = delayRender();
			// ***********************************************************
			// TODO bring these waiting checks into the fonts loader!!!!!
			// ***********************************************************
			// await for when the fonts are loaded in the browser
			// await document.fonts.ready;

			// Introduce an additional delay to ensure styles are applied
			// await new Promise((resolve) => setTimeout(resolve, 2000));
			// await new Promise((resolve) => setTimeout(resolve, 200));
			// ***********************************************************

			if (ref.current) {
				const {offsetWidth, offsetHeight} = ref.current;
				setDimensions({width: offsetWidth, height: offsetHeight});
				// Once measurement is done, continue rendering
				continueRender(handle);
			}
		};

		// Measure after the component has mounted and rendered
		waitFirstTime().then(() => measure());
		// measure();

		// Optionally, add a resize listener if dimensions might change
		// window.addEventListener('resize', measure);

		// Cleanup on unmount
		return () => {
			// window.removeEventListener('resize', measure);
		};
	}, [handle]);

	return {ref, dimensions};
}
