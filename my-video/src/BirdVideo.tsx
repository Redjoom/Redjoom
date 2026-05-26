import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const Cloud: React.FC<{cx: number; cy: number; s: number; drift: number}> = ({
	cx,
	cy,
	s,
	drift,
}) => (
	<g transform={`translate(${cx + drift}, ${cy})`} opacity={0.88}>
		<ellipse rx={88 * s} ry={44 * s} fill="white" />
		<ellipse cx={-54 * s} cy={12 * s} rx={58 * s} ry={34 * s} fill="white" />
		<ellipse cx={60 * s} cy={9 * s} rx={63 * s} ry={36 * s} fill="white" />
		<ellipse cy={18 * s} rx={96 * s} ry={30 * s} fill="white" />
	</g>
);

const BirdShape: React.FC<{wingPhase: number}> = ({wingPhase}) => {
	const wY = Math.sin(wingPhase) * 52;
	const wMid = Math.sin(wingPhase) * 28;

	return (
		<g>
			{/* Shadow wing (back) */}
			<path
				d={`M 0 -8 C 18 ${wY - 12} 52 ${wY - 4} 74 ${wMid + 6}`}
				stroke="#1565c0"
				strokeWidth={14}
				strokeLinecap="round"
				fill="none"
				opacity={0.55}
			/>
			{/* Tail */}
			<path d="M -30 -3 L -58 -24 L -50 0 L -58 24 L -30 3 Z" fill="#1976d2" />
			{/* Body */}
			<ellipse rx={34} ry={20} fill="#2196f3" />
			{/* Chest */}
			<ellipse cx={10} cy={13} rx={17} ry={11} fill="#e07820" />
			{/* Head */}
			<circle cx={30} cy={-16} r={18} fill="#2196f3" />
			{/* Beak */}
			<path d="M 42 -19 L 63 -16 L 42 -12 Z" fill="#f39c12" />
			{/* Eye */}
			<circle cx={35} cy={-19} r={6} fill="white" />
			<circle cx={36} cy={-19} r={3.5} fill="#111" />
			<circle cx={34.5} cy={-20.5} r={1.2} fill="white" />
			{/* Front wing */}
			<path
				d={`M 0 -8 C 16 ${wY} 50 ${wY + 6} 72 ${wMid + 9}`}
				stroke="#1e88e5"
				strokeWidth={18}
				strokeLinecap="round"
				fill="none"
			/>
			{/* Wing feather accent */}
			<path
				d={`M 14 ${-7 + wY * 0.25} C 34 ${wY * 0.65} 54 ${wY * 0.88} 72 ${wMid + 9}`}
				stroke="#0d47a1"
				strokeWidth={5}
				strokeLinecap="round"
				fill="none"
				opacity={0.45}
			/>
		</g>
	);
};

export const BirdVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, durationInFrames} = useVideoConfig();

	const birdX = interpolate(frame, [0, durationInFrames], [-120, width + 160]);
	const birdY = height * 0.36 + Math.sin(frame * 0.11) * 44;
	const tilt = Math.cos(frame * 0.11) * 5;
	const wingPhase = frame * 0.38;
	const birdScale = interpolate(
		frame,
		[0, durationInFrames * 0.45, durationInFrames],
		[0.8, 1.3, 0.85],
	);

	const drift = frame * 0.22;

	return (
		<AbsoluteFill>
			<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#1565c0" />
						<stop offset="40%" stopColor="#42a5f5" />
						<stop offset="75%" stopColor="#90caf9" />
						<stop offset="100%" stopColor="#e3f2fd" />
					</linearGradient>
				</defs>

				{/* Sky */}
				<rect width={width} height={height} fill="url(#sky)" />

				{/* Sun */}
				<circle cx={width * 0.9} cy={120} r={140} fill="#fff9c4" opacity={0.18} />
				<circle cx={width * 0.9} cy={120} r={105} fill="#fff176" opacity={0.32} />
				<circle cx={width * 0.9} cy={120} r={75} fill="#ffd740" />

				{/* Clouds */}
				<Cloud cx={180} cy={155} s={1.1} drift={drift * 0.8} />
				<Cloud cx={720} cy={95} s={0.82} drift={drift * 0.6} />
				<Cloud cx={1260} cy={175} s={1.15} drift={drift * 0.7} />
				<Cloud cx={1680} cy={120} s={0.9} drift={drift * 0.5} />
				<Cloud cx={-50} cy={240} s={0.72} drift={drift * 0.9} />

				{/* Far hills */}
				<path
					d={`M 0 ${height * 0.82} Q ${width * 0.25} ${height * 0.7} ${width * 0.55} ${height * 0.78} Q ${width * 0.8} ${height * 0.85} ${width} ${height * 0.75} L ${width} ${height} L 0 ${height} Z`}
					fill="#558b2f"
					opacity={0.75}
				/>
				{/* Near ground */}
				<path
					d={`M 0 ${height * 0.9} Q ${width * 0.35} ${height * 0.84} ${width * 0.7} ${height * 0.88} Q ${width * 0.88} ${height * 0.91} ${width} ${height * 0.88} L ${width} ${height} L 0 ${height} Z`}
					fill="#33691e"
				/>

				{/* Bird */}
				<g
					transform={`translate(${birdX}, ${birdY}) scale(${birdScale}) rotate(${tilt})`}
				>
					<BirdShape wingPhase={wingPhase} />
				</g>
			</svg>
		</AbsoluteFill>
	);
};
