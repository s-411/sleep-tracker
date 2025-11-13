import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSleep } from "../contexts/SleepContext";
import { formatTime } from "@sleep-tracker/shared";

export function SleepTracking() {
	const navigate = useNavigate();
	const { activeSession, endSession } = useSleep();
	const [duration, setDuration] = useState('00:00');
	const quality = 85;

	useEffect(() => {
		if (!activeSession) {
			navigate('/');
			return;
		}

		const interval = setInterval(() => {
			const now = new Date();
			const diff = now.getTime() - activeSession.startTime.getTime();
			const minutes = Math.floor(diff / 1000 / 60);
			const hours = Math.floor(minutes / 60);
			const mins = minutes % 60;
			const hStr = String(hours).padStart(2, '0');
			const mStr = String(mins).padStart(2, '0');
			setDuration(hStr + ':' + mStr);
		}, 1000);

		return () => clearInterval(interval);
	}, [activeSession, navigate]);

	const handleStopTracking = async () => {
		if (activeSession) {
			await endSession(activeSession.id, quality);
			navigate('/');
		}
	};

	if (!activeSession) return null;

	return (
		<div className="relative flex flex-col h-screen overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
			<div className="absolute inset-0 opacity-40">
				<div className="absolute top-[8%] left-[15%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[12%] left-[45%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[18%] left-[75%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[25%] left-[25%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[28%] left-[85%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[35%] left-[10%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[38%] left-[55%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[42%] left-[90%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[48%] left-[35%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[52%] left-[68%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[58%] left-[18%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[62%] left-[82%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[68%] left-[42%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[72%] left-[12%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[75%] left-[65%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[82%] left-[28%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[85%] left-[78%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[88%] left-[48%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[92%] left-[88%] w-1 h-1 bg-white rounded-full" />
				<div className="absolute top-[15%] left-[62%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[22%] left-[52%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[32%] left-[72%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[45%] left-[22%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[55%] left-[92%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[65%] left-[8%] w-0.5 h-0.5 bg-white rounded-full" />
				<div className="absolute top-[78%] left-[58%] w-0.5 h-0.5 bg-white rounded-full" />
			</div>
			<div className="absolute top-[15%] left-[-10%] w-80 h-80 bg-[#2D2157] opacity-50 rounded-full blur-3xl" />
			<div className="absolute top-[40%] right-[-15%] w-96 h-96 bg-[#3A2D6B] opacity-40 rounded-full blur-3xl" />
			<div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-[#1F1640] opacity-60 rounded-full blur-3xl" />
			<div className="relative z-10 flex flex-col h-full px-6 py-12">
				<div className="text-center mt-8">
					<h1 className="text-5xl font-bold font-heading text-white">
						Good night
					</h1>
				</div>
				<div className="flex-1 flex flex-col items-center justify-center">
					<div className="relative w-80 h-80 mb-12">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
							<div className="absolute inset-0 rounded-full border-2 border-white/10" />
							<div className="absolute inset-[-12px] rounded-full border-2 border-white/8" />
							<div className="absolute inset-[-24px] rounded-full border-2 border-white/5" />
						</div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
							<div className="text-6xl font-bold text-white">
								{formatTime(activeSession.startTime)}
							</div>
						</div>
						<Icon
							icon="bxs:moon"
							className="text-white/90 absolute drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] size-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-24"
						/>
					</div>
					<div className="text-center">
						<p className="text-lg text-white/70 mb-3">
							Sleep duration
						</p>
						<div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-12 py-3">
							<p className="text-2xl font-semibold text-white">
								{duration}
							</p>
						</div>
					</div>
				</div>
				<button
					onClick={handleStopTracking}
					className="w-full py-5 bg-white rounded-3xl font-semibold text-[#3A2D6B] shadow-[0_0_30px_rgba(255,255,255,0.5)] text-xl"
				>
					Stop tracking
				</button>
			</div>
		</div>
	);
}
