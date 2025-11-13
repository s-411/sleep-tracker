import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSleep } from "../contexts/SleepContext";
import { formatDuration, formatTime, calculateStatistics } from "@sleep-tracker/shared";

export function SleepHistory() {
	const { sessions } = useSleep();
	const completedSessions = sessions.filter(s => s.endTime !== null);
	const stats = calculateStatistics(completedSessions);

	const getQualityColor = (quality: number) => {
		if (quality >= 85) return 'text-accent';
		if (quality >= 70) return 'text-chart-5';
		return 'text-destructive';
	};

	const getStarCount = (quality: number) => {
		if (quality >= 90) return 5;
		if (quality >= 80) return 4;
		if (quality >= 70) return 3;
		if (quality >= 60) return 2;
		return 1;
	};

	return (
		<div className="flex flex-col h-screen bg-background text-foreground">
			<div className="flex items-center justify-between px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold font-heading">Sleep History</h1>
					<p className="text-sm text-muted-foreground">Track your sleep patterns</p>
				</div>
				<button className="flex items-center justify-center size-11 rounded-full bg-card">
					<Icon icon="solar:calendar-bold" className="size-6 text-foreground" />
				</button>
			</div>
			<div className="px-6">
				<div className="flex gap-2 bg-card rounded-2xl p-1">
					<button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm">
						Week
					</button>
					<button className="flex-1 py-2.5 text-muted-foreground rounded-xl font-semibold text-sm">
						Month
					</button>
					<button className="flex-1 py-2.5 text-muted-foreground rounded-xl font-semibold text-sm">
						Year
					</button>
				</div>
			</div>
			<div className="flex-1 px-6 pb-24 mt-6 overflow-y-auto">
				<div className="bg-card rounded-3xl p-6">
					<h2 className="text-lg font-semibold font-heading mb-4">Weekly Overview</h2>
					<div className="flex items-end justify-between gap-3 h-32">
						{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
							const heights = [20, 16, 20, 24, 16, 12, 14];
							return (
								<div key={day} className="flex-1 flex flex-col items-center gap-2">
									<div className="w-full bg-primary/20 rounded-t-xl h-24 flex items-end">
										<div 
											className="w-full bg-primary rounded-t-xl" 
											style={{ height: heights[idx] * 4 + 'px' }}
										/>
									</div>
									<span className="text-xs text-muted-foreground">{day}</span>
								</div>
							);
						})}
					</div>
					<div className="mt-4 flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Average</span>
						<span className="font-semibold">{formatDuration(stats.averageDuration)}</span>
					</div>
				</div>
				<div className="mt-6">
					<h2 className="text-lg font-semibold font-heading mb-4">Sleep Sessions</h2>
					<div className="space-y-3">
						{completedSessions.map((session) => {
							const starCount = getStarCount(session.quality);
							return (
								<Link 
									key={session.id}
									to={'/details/' + session.id}
									className="bg-card rounded-2xl p-4 block"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-semibold">
													{new Date(session.startTime).toLocaleDateString('en-US', { 
														weekday: 'long', 
														month: 'short', 
														day: 'numeric' 
													})}
												</h3>
												<div className="flex gap-0.5">
													{[...Array(5)].map((_, i) => (
														<Icon 
															key={i}
															icon="solar:star-bold" 
															className={'size-4 ' + (i < starCount ? 'text-accent' : 'text-muted')} 
														/>
													))}
												</div>
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Icon icon="solar:moon-sleep-bold" className="size-4" />
													<span>{formatDuration(session.duration)}</span>
												</div>
												<div className="flex items-center gap-1">
													<Icon icon="solar:clock-circle-bold" className="size-4" />
													<span>
														{formatTime(session.startTime)} - {session.endTime && formatTime(session.endTime)}
													</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className={'text-2xl font-semibold ' + getQualityColor(session.quality)}>
												{session.quality}%
											</div>
											<div className="text-xs text-muted-foreground">Quality</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
				<div className="flex items-center justify-around py-3">
					<Link to="/" className="flex items-center px-4 py-2 justify-center">
						<Icon icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
					</Link>
					<Link to="/history" className="flex items-center px-4 py-2 justify-center">
						<Icon icon="solar:chart-bold" className="size-6 text-primary" />
					</Link>
					<Link to="/tracking" className="flex items-center px-4 py-2 justify-center">
						<Icon icon="mdi:clock" className="size-6 text-muted-foreground" />
					</Link>
					<button className="flex items-center px-4 py-2 justify-center">
						<Icon icon="solar:user-bold" className="size-6 text-muted-foreground" />
					</button>
				</div>
			</div>
		</div>
	);
}
