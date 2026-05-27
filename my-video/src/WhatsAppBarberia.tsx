import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
	bg: '#070707',
	gold: '#C9A84C',
	goldL: '#F0D080',
	goldD: '#7A5C10',
	goldXD: '#2E2200',
	botBg: '#0E0A00',
	botBorder: '#3A2E00',
	botText: '#F0D080',
	userBg: '#1C1C1C',
	userBorder: '#2E2E2E',
	userText: '#CCB898',
	time: '#6A5828',
	headerBg: '#0A0800',
} as const;

// ─── Timing ───────────────────────────────────────────────────────────────────
const FPM = 52;  // frames per message
const TR  = 20;  // cross-fade frames
const EXT = 60;  // reading frames after last msg

const I_END = 90;
const S1    = I_END + TR;                         // 110
const S1E   = S1  + 10 * FPM + EXT;              // 690
const S2    = S1E + TR;                            // 710
const S2E   = S2  + 6  * FPM + EXT;              // 1082
const S3    = S2E + TR;                            // 1102
const S3E   = S3  + 8  * FPM + EXT;              // 1578
export const TOTAL_FRAMES = S3E + 90;             // 1668 → use 1680

// ─── Data ────────────────────────────────────────────────────────────────────
type Rol = 'cliente' | 'asistente';
interface Msg { rol: Rol; texto: string; hora?: string }

const msgs1: Msg[] = [
	{ rol: 'cliente',    texto: 'Hola, quiero agendar un corte', hora: '10:30' },
	{ rol: 'asistente', texto: '👋 ¡Hola! Bienvenido a Barbería El Estilo.\nSoy tu asistente virtual.\n\n¿Qué servicio deseas?\n• Corte — $200\n• Barba — $150\n• Combo — $300', hora: '10:30' },
	{ rol: 'cliente',    texto: 'Un combo por favor', hora: '10:31' },
	{ rol: 'asistente', texto: 'Perfecto ✓  Combo.\n¿Para qué fecha?\n(Ej: "mañana", "pasado mañana")', hora: '10:31' },
	{ rol: 'cliente',    texto: 'Mañana', hora: '10:31' },
	{ rol: 'asistente', texto: '⏰ ¿A qué hora?\nHorarios disponibles:\n10:00 · 10:30 · 11:00\n14:00 · 14:30 · 15:00\n16:30 · 17:00\n¿Cuál prefieres?', hora: '10:31' },
	{ rol: 'cliente',    texto: 'A las 3', hora: '10:32' },
	{ rol: 'asistente', texto: '📋 Confirma tu cita:\n• Servicio: Combo\n• Fecha: Martes 27 de mayo\n• Hora: 15:00\n• Total: $300 MXN\n\n¿Confirmas? (sí/no)', hora: '10:32' },
	{ rol: 'cliente',    texto: 'Sí', hora: '10:32' },
	{ rol: 'asistente', texto: '✅ ¡Cita agendada!\n• Martes 27 de mayo — 15:00\n• Combo — $300 MXN\n\nTe esperamos en Barbería El Estilo 😊\n¿Necesitas algo más?', hora: '10:32' },
];

const msgs2: Msg[] = [
	{ rol: 'cliente',    texto: 'Buenas noches, ¿a qué hora cierran?' },
	{ rol: 'asistente', texto: '🌙 ¡Hola! Buenas noches.\nAtendemos lunes a sábado\nde 10:00 a 20:00 hrs.\nSolo con cita previa.\n¿Te gustaría agendar?' },
	{ rol: 'cliente',    texto: '¿Cuánto cuesta el corte y la barba?' },
	{ rol: 'asistente', texto: '💈 Nuestros servicios:\n• Corte — $200\n• Barba — $150\n• Combo — $300\n• Cejas — $80\n• Tinte — $400\n\n30 min por servicio\n¿Cuál te interesa?' },
	{ rol: 'cliente',    texto: 'El combo suena bien. ¿Tienen hora para el viernes?' },
	{ rol: 'asistente', texto: '📅 ¡Claro! Viernes 30 de mayo.\nHorarios disponibles:\n10:00 · 10:30 · 11:00\n14:00 · 14:30 · 15:00\n16:30 · 17:00 · 17:30\n\n¿Cuál prefieres?' },
];

const msgs3: Msg[] = [
	{ rol: 'cliente',    texto: 'Hola, necesito cancelar mi cita de mañana', hora: '18:20' },
	{ rol: 'asistente', texto: '👋 ¡Hola! Claro, te ayudo.\nCita pendiente:\n• Cita #142 — Combo\n• Martes 27 de mayo — 15:00\n• $300 MXN\n\n¿Confirmas la cancelación? (sí/no)', hora: '18:20' },
	{ rol: 'cliente',    texto: 'Sí por favor', hora: '18:21' },
	{ rol: 'asistente', texto: '❌ Cita cancelada correctamente.\nTu lugar quedó liberado.\n\n¿Deseas agendar en otra fecha?', hora: '18:21' },
	{ rol: 'cliente',    texto: 'Sí, para el jueves a las 5', hora: '18:22' },
	{ rol: 'asistente', texto: '📋 Confirma tu nueva cita:\n• Combo\n• Jueves 29 de mayo — 17:00\n• $300 MXN\n\n¿Confirmas? (sí/no)', hora: '18:22' },
	{ rol: 'cliente',    texto: 'Sí', hora: '18:22' },
	{ rol: 'asistente', texto: '✅ ¡Cita reagendada con éxito!\n• Jueves 29 de mayo — 17:00\n• Combo — $300 MXN\n\n¡Te esperamos! 😊', hora: '18:22' },
];

// ─── Height estimation (for scroll) ──────────────────────────────────────────
const CPL = 28; // chars per line at font-size 28px
const LH  = 42; // line height px
const BPV = 36; // bubble vertical padding total
const GAP = 18; // gap between bubbles

function estimateH(text: string): number {
	const parts = text.split('\n');
	let lines = 0;
	for (const p of parts) {
		lines += p.trim() === '' ? 0.4 : Math.max(1, Math.ceil(p.length / CPL));
	}
	return Math.ceil(lines) * LH + BPV + GAP;
}

function cumH(msgs: Msg[]): number[] {
	let acc = 0;
	return msgs.map((m) => {
		acc += estimateH(m.texto);
		return acc;
	});
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ease = Easing.bezier(0.16, 1, 0.3, 1);

function fi(
	frame: number,
	keyframes: [number, number, number, number],
	values: [number, number, number, number],
): number {
	return interpolate(frame, keyframes, values, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

// ─── WhatsApp Header ──────────────────────────────────────────────────────────
const WHeader: React.FC = () => (
	<div
		style={{
			background: C.headerBg,
			borderBottom: `1.5px solid ${C.goldD}`,
			padding: '20px 28px',
			display: 'flex',
			alignItems: 'center',
			gap: 18,
			flexShrink: 0,
		}}
	>
		<div
			style={{
				width: 74,
				height: 74,
				borderRadius: '50%',
				background: `linear-gradient(135deg, ${C.goldXD}, ${C.goldD}, ${C.gold})`,
				border: `2px solid ${C.gold}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 36,
				flexShrink: 0,
				boxShadow: `0 0 16px ${C.goldD}88`,
			}}
		>
			✂️
		</div>
		<div>
			<div
				style={{
					color: C.goldL,
					fontSize: 32,
					fontWeight: 700,
					letterSpacing: 0.5,
					textShadow: `0 0 20px ${C.goldD}`,
				}}
			>
				Barbería El Estilo
			</div>
			<div style={{color: C.goldD, fontSize: 21, marginTop: 4}}>
				🤖 Asistente Virtual · En línea
			</div>
		</div>
	</div>
);

// ─── Section Banner ───────────────────────────────────────────────────────────
const Banner: React.FC<{title: string}> = ({title}) => (
	<div
		style={{
			background: `linear-gradient(90deg, transparent, ${C.goldXD}DD, transparent)`,
			borderTop: `1px solid ${C.goldD}55`,
			borderBottom: `1px solid ${C.goldD}55`,
			padding: '11px 28px',
			flexShrink: 0,
		}}
	>
		<div
			style={{
				color: C.gold,
				fontSize: 28,
				fontWeight: 700,
				textAlign: 'center',
				letterSpacing: 2,
				textTransform: 'uppercase',
			}}
		>
			{title}
		</div>
	</div>
);

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
interface BubbleP {
	msg: Msg;
	opacity: number;
	slideX: number;
}

const Bubble: React.FC<BubbleP> = ({msg, opacity, slideX}) => {
	const isU = msg.rol === 'cliente';
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: isU ? 'flex-end' : 'flex-start',
				marginBottom: GAP,
				opacity,
				transform: `translateX(${slideX}px)`,
				paddingLeft: isU ? 130 : 0,
				paddingRight: isU ? 0 : 130,
			}}
		>
			<div
				style={{
					background: isU ? C.userBg : C.botBg,
					border: `1.5px solid ${isU ? C.userBorder : C.botBorder}`,
					borderRadius: isU ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
					padding: '16px 22px',
					color: isU ? C.userText : C.botText,
					fontSize: 28,
					lineHeight: 1.55,
					whiteSpace: 'pre-line',
					boxShadow: isU
						? '0 2px 8px rgba(0,0,0,0.5)'
						: `0 0 18px rgba(201,168,76,0.1), 0 2px 10px rgba(0,0,0,0.6)`,
				}}
			>
				{msg.texto}
				{msg.hora != null && (
					<div
						style={{
							fontSize: 19,
							color: C.time,
							textAlign: 'right',
							marginTop: 8,
						}}
					>
						{msg.hora} ✓
					</div>
				)}
			</div>
		</div>
	);
};

// ─── Chat Scene ───────────────────────────────────────────────────────────────
interface SceneP {
	msgs: Msg[];
	sceneStart: number;
	frame: number;
	chatH: number;
}

const ChatScene: React.FC<SceneP> = ({msgs, sceneStart, frame, chatH}) => {
	if (frame < sceneStart) return <div style={{flex: 1}} />;

	const heights = cumH(msgs);
	const visibleIdx = Math.min(
		Math.floor((frame - sceneStart) / FPM),
		msgs.length - 1,
	);

	// Smooth scroll to keep latest message in view
	let scrollY = 0;
	if (visibleIdx >= 0) {
		const target = Math.max(0, heights[visibleIdx] - chatH + 80);
		if (target > 0) {
			const prev = Math.max(0, heights[Math.max(0, visibleIdx - 1)] - chatH + 80);
			const sf = sceneStart + visibleIdx * FPM;
			const t = interpolate(frame, [sf, sf + 28], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
				easing: ease,
			});
			scrollY = prev + (target - prev) * t;
		}
	}

	return (
		<div style={{flex: 1, overflow: 'hidden', position: 'relative'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					transform: `translateY(-${scrollY}px)`,
					padding: '18px 22px 0',
				}}
			>
				{msgs.map((msg, i) => {
					const af = sceneStart + i * FPM;
					if (frame < af) return null;
					const opacity = interpolate(frame, [af, af + 14], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					const slideX = interpolate(
						frame,
						[af, af + 22],
						[msg.rol === 'cliente' ? 70 : -70, 0],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease},
					);
					return <Bubble key={i} msg={msg} opacity={opacity} slideX={slideX} />;
				})}
			</div>
		</div>
	);
};

// ─── Intro ────────────────────────────────────────────────────────────────────
const Intro: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => (
	<AbsoluteFill
		style={{
			background: C.bg,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 34,
			opacity,
			transform: `scale(${scale})`,
		}}
	>
		<div
			style={{
				width: 200,
				height: 200,
				borderRadius: '50%',
				border: `3px solid ${C.gold}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 90,
				boxShadow: `0 0 50px ${C.gold}44, 0 0 100px ${C.gold}1A`,
			}}
		>
			✂️
		</div>
		<div
			style={{
				color: C.goldL,
				fontSize: 68,
				fontWeight: 800,
				textAlign: 'center',
				lineHeight: 1.15,
				textShadow: `0 0 40px ${C.gold}66`,
				fontFamily: 'Georgia, "Times New Roman", serif',
				letterSpacing: 2,
			}}
		>
			Barbería
			<br />
			El Estilo
		</div>
		<div
			style={{
				width: 220,
				height: 1.5,
				background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
			}}
		/>
		<div
			style={{
				color: C.goldD,
				fontSize: 27,
				letterSpacing: 4,
				textTransform: 'uppercase',
				textAlign: 'center',
			}}
		>
			Asistente Virtual WhatsApp
		</div>
		<div
			style={{
				color: `${C.gold}CC`,
				fontSize: 30,
				textAlign: 'center',
				lineHeight: 1.9,
				marginTop: 8,
			}}
		>
			📅 Agendar · 💬 Consultar · 🔄 Reagendar
		</div>
	</AbsoluteFill>
);

// ─── Outro ────────────────────────────────────────────────────────────────────
const Outro: React.FC<{opacity: number}> = ({opacity}) => (
	<AbsoluteFill
		style={{
			background: C.bg,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 30,
			opacity,
		}}
	>
		<div style={{fontSize: 86}}>✨</div>
		<div
			style={{
				color: C.goldL,
				fontSize: 58,
				fontWeight: 800,
				textAlign: 'center',
				lineHeight: 1.2,
				fontFamily: 'Georgia, serif',
				textShadow: `0 0 40px ${C.gold}55`,
			}}
		>
			¡Agenda tu cita
			<br />
			hoy mismo!
		</div>
		<div
			style={{
				width: 200,
				height: 1.5,
				background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
			}}
		/>
		<div
			style={{
				color: `${C.gold}EE`,
				fontSize: 29,
				textAlign: 'center',
				lineHeight: 1.95,
			}}
		>
			💇 Corte · Barba · Combo · Cejas · Tinte
			<br />
			📍 Solo con cita previa
			<br />
			🕐 Lun–Sáb de 10:00 a 20:00 hrs
		</div>
		<div
			style={{
				marginTop: 16,
				background: `linear-gradient(135deg, ${C.goldD}, ${C.gold})`,
				borderRadius: 60,
				padding: '20px 56px',
				color: '#060600',
				fontSize: 32,
				fontWeight: 800,
				letterSpacing: 1,
				boxShadow: `0 0 30px ${C.gold}44`,
			}}
		>
			Escríbenos por WhatsApp →
		</div>
	</AbsoluteFill>
);

// ─── Main composition ─────────────────────────────────────────────────────────
export const WhatsAppBarberia: React.FC = () => {
	const frame = useCurrentFrame();
	const {height} = useVideoConfig();

	const CHAT_H = height - 140 - 68 - 20;

	// Intro
	const introOp = fi(frame, [0, 20, I_END - 20, I_END], [0, 1, 1, 0]);
	const introScale = interpolate(frame, [0, 30], [0.94, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Scene opacities
	const s1Op = fi(frame, [S1, S1 + TR, S1E - TR, S1E], [0, 1, 1, 0]);
	const s2Op = fi(frame, [S2, S2 + TR, S2E - TR, S2E], [0, 1, 1, 0]);
	const s3Op = fi(frame, [S3, S3 + TR, S3E, S3E + TR], [0, 1, 1, 0]);

	// Chrome (header) fades with scenes
	const chromeOp = fi(frame, [S1, S1 + TR, S3E, S3E + TR], [0, 1, 1, 0]);

	// Outro
	const outroOp = interpolate(frame, [S3E, S3E + 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: C.bg,
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
			}}
		>
			{/* Intro */}
			{frame < I_END + TR && <Intro opacity={introOp} scale={introScale} />}

			{/* Chat UI */}
			{frame >= S1 && frame < S3E + TR && (
				<AbsoluteFill
					style={{opacity: chromeOp, display: 'flex', flexDirection: 'column'}}
				>
					<WHeader />
					<div style={{flex: 1, position: 'relative'}}>
						{/* Scene 1 */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								opacity: s1Op,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Banner title="✂️  Agendar Cita" />
							<ChatScene
								msgs={msgs1}
								sceneStart={S1}
								frame={frame}
								chatH={CHAT_H}
							/>
						</div>
						{/* Scene 2 */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								opacity: s2Op,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Banner title="💈  Consultar Precios" />
							<ChatScene
								msgs={msgs2}
								sceneStart={S2}
								frame={frame}
								chatH={CHAT_H}
							/>
						</div>
						{/* Scene 3 */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								opacity: s3Op,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Banner title="🔄  Cancelar y Reagendar" />
							<ChatScene
								msgs={msgs3}
								sceneStart={S3}
								frame={frame}
								chatH={CHAT_H}
							/>
						</div>
					</div>
				</AbsoluteFill>
			)}

			{/* Outro */}
			{frame >= S3E && <Outro opacity={outroOp} />}
		</AbsoluteFill>
	);
};
