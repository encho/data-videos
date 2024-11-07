import React, {useEffect} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {Box, Environment} from '@react-three/drei';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {useThree} from '@react-three/fiber';

const DynamicScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {camera} = useThree();

	// Interpolate Z position based on the current frame
	const xPosition = interpolate(frame, [0, 100], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const yPosition = interpolate(frame, [0, 100], [0, 5], {
		extrapolateRight: 'clamp',
	});
	const zPosition = interpolate(frame, [0, 100], [10, 10], {
		extrapolateRight: 'clamp',
	});

	// Interpolate the rotation angle based on the frame
	const rotationAngle = interpolate(frame, [0, 150], [0, 2 * Math.PI]);

	const MAX_HEIGHT = 8;

	// Interpolate the height of the blue bar based on the current frame
	const blueBarHeight = interpolate(frame, [0, 100], [0, MAX_HEIGHT], {
		extrapolateRight: 'clamp',
	});
	const bar2_height = interpolate(frame, [0, 50], [0, MAX_HEIGHT / 2], {
		extrapolateRight: 'clamp',
	});
	const bar3_height = interpolate(frame, [0, 50], [0, MAX_HEIGHT / 1.5], {
		extrapolateRight: 'clamp',
	});

	useEffect(() => {
		const radius = 15; // Fixed distance from the center of the scene

		// Calculate new camera position (orbiting around Y-axis)
		const x = radius * Math.sin(rotationAngle);
		const z = radius * Math.cos(rotationAngle);

		// Set new position while keeping Y constant
		camera.position.set(x, 5, z);

		// Make the camera look at the center of the scene (or any target point)
		camera.lookAt(0, 3, 0);
		camera.updateProjectionMatrix();
	}, [rotationAngle, camera]);

	// useEffect(() => {
	// 	camera.position.set(xPosition, yPosition, zPosition);
	// 	camera.updateProjectionMatrix();
	// }, [xPosition, yPosition, zPosition, rotationAngle, camera]);

	return (
		<>
			<ambientLight intensity={0.5} />
			<hemisphereLight
				intensity={0.5}
				// skyColor="white"
				groundColor="darkgrey"
			/>

			{/* Add an Environment Light for full scene lighting */}
			<Environment preset="sunset" />
			{/* <ambientLight intensity={0.3} />
			<directionalLight position={[5, 10, 5]} intensity={3} castShadow />
			<spotLight
				position={[-5, 5, 5]}
				angle={0.3}
				penumbra={1}
				intensity={5}
				castShadow
			/> */}

			{/* First Box */}
			{/* <Box args={[1, 3, 1]} position={[-3, 0, 0]}>
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box> */}

			{/* Second Box */}
			{/* <Box args={[1, blueBarHeight, 1]} position={[-1, 0, 0]}>
				<meshStandardMaterial color="blue" />
			</Box> */}

			{/* Dynamic Second Box (Blue) */}
			<Box
				args={[1, 1, 1]} // Base size is 1x1x1, height scaled dynamically
				// scale={[1, blueBarHeight / 6, 1]} // Dynamically scale the height
				// position={[-1, (blueBarHeight - 6) / 2, 0]} // Keep the base fixed
				scale={[1, blueBarHeight, 1]} // Dynamically scale the height
				position={[-1, blueBarHeight / 2, 0]} // Keep the base fixed
			>
				{/* <meshStandardMaterial color="blue" /> */}
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box>

			<Box
				args={[1, 1, 1]} // Base size is 1x1x1, height scaled dynamically
				// scale={[1, blueBarHeight / 6, 1]} // Dynamically scale the height
				// position={[-1, (blueBarHeight - 6) / 2, 0]} // Keep the base fixed
				scale={[1, bar2_height, 1]} // Dynamically scale the height
				position={[1, bar2_height / 2, 0]} // Keep the base fixed
			>
				{/* <meshStandardMaterial color="blue" /> */}
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box>

			<Box
				args={[1, 1, 1]} // Base size is 1x1x1, height scaled dynamically
				// scale={[1, blueBarHeight / 6, 1]} // Dynamically scale the height
				// position={[-1, (blueBarHeight - 6) / 2, 0]} // Keep the base fixed
				scale={[1, bar3_height, 1]} // Dynamically scale the height
				position={[3, bar3_height / 2, 0]} // Keep the base fixed
			>
				{/* <meshStandardMaterial color="blue" /> */}
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box>

			{/* Third Box */}
			{/* <Box args={[1, 2, 1]} position={[1, -0.5, 0]}>
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box> */}

			{/* Fourth Box */}
			{/* <Box args={[1, 4, 1]} position={[3, 0, -0.5]}>
				<meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.8} />
			</Box> */}
		</>
	);
};

const DynamicBars: React.FC<{width: number; height: number}> = ({
	width,
	height,
}) => {
	return (
		<ThreeCanvas width={width} height={height}>
			<DynamicScene />
		</ThreeCanvas>
	);
};

export default DynamicBars;
