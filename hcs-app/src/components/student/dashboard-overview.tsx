"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Award,
	TrendingUp,
	Clock,
	CheckCircle,
	Users,
	Target,
	Zap,
	Trophy,
	Star,
	ArrowRight,
	Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudentData {
	id: string;
	name: string;
	class: string;
	rollNumber: string;
	profileImage: string;
	totalPoints: number;
	level: string;
	attendance: number;
}

interface DashboardOverviewProps {
	studentData: StudentData;
}

export function DashboardOverview({ studentData }: DashboardOverviewProps) {
	const statsCards = [
		{
			title: "Total Points",
			value: studentData.totalPoints.toLocaleString(),
			icon: Trophy,
			color: "from-yellow-400 to-orange-500",
			change: "+125 this week",
			trend: "up",
		},
		{
			title: "Attendance",
			value: `${studentData.attendance}%`,
			icon: Target,
			color: "from-green-400 to-blue-500",
			change: "+2% this month",
			trend: "up",
		},
		{
			title: "Assignments",
			value: "8/10",
			icon: CheckCircle,
			color: "from-purple-400 to-pink-500",
			change: "2 pending",
			trend: "neutral",
		},
		{
			title: "Class Rank",
			value: "#3",
			icon: Star,
			color: "from-blue-400 to-cyan-500",
			change: "↑ 2 positions",
			trend: "up",
		},
	];

	const upcomingEvents = [
		{
			id: 1,
			title: "Math Quiz",
			time: "2:00 PM",
			date: "Today",
			type: "exam",
			color: "bg-red-500",
		},
		{
			id: 2,
			title: "Science Assignment Due",
			time: "11:59 PM",
			date: "Tomorrow",
			type: "assignment",
			color: "bg-orange-500",
		},
		{
			id: 3,
			title: "English Presentation",
			time: "10:00 AM",
			date: "Friday",
			type: "presentation",
			color: "bg-blue-500",
		},
		{
			id: 4,
			title: "Sports Day Practice",
			time: "3:00 PM",
			date: "Saturday",
			type: "activity",
			color: "bg-green-500",
		},
	];

	const recentAchievements = [
		{
			id: 1,
			title: "Perfect Attendance",
			description: "100% attendance for 2 weeks",
			points: 50,
			date: "2 days ago",
			icon: Target,
			color: "from-green-400 to-blue-500",
		},
		{
			id: 2,
			title: "Quiz Master",
			description: "Scored 100% in 3 consecutive quizzes",
			points: 75,
			date: "1 week ago",
			icon: Zap,
			color: "from-yellow-400 to-orange-500",
		},
		{
			id: 3,
			title: "Helper Badge",
			description: "Helped 5 classmates with assignments",
			points: 25,
			date: "2 weeks ago",
			icon: Users,
			color: "from-purple-400 to-pink-500",
		},
	];

	const quickActions = [
		{
			title: "Join Live Class",
			description: "Physics - Chapter 12",
			icon: Play,
			color: "from-red-500 to-pink-500",
			action: "Join Now",
			urgent: true,
		},
		{
			title: "Submit Assignment",
			description: "Math - Algebra Problems",
			icon: BookOpen,
			color: "from-blue-500 to-purple-500",
			action: "Submit",
			urgent: false,
		},
		{
			title: "Take MCQ Test",
			description: "History - Ancient Civilizations",
			icon: Award,
			color: "from-green-500 to-teal-500",
			action: "Start Test",
			urgent: false,
		},
	];

	return (
		<div className="space-y-6 w-full max-w-none pb-8">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-border">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div className="flex-1 text-center md:text-left min-w-0 py-2">
							<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 break-words leading-tight sm:leading-normal">
								Welcome back, {studentData.name.split(" ")[0]}! 👋
							</h1>
							<p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
								You&apos;re doing great! Keep up the excellent work.
							</p>
						</div>
						<div className="flex items-center space-x-4 flex-shrink-0">
							<div className="text-center">
								<div className="text-2xl font-bold text-primary">
									{studentData.level}
								</div>
								<div className="text-sm text-muted-foreground">
									Current Level
								</div>
							</div>
							<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
								<Trophy className="w-8 h-8 text-white" />
							</div>
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
			>
				{statsCards.map((stat, index) => (
					<Card
						key={index}
						className="p-6 hover:shadow-lg transition-all duration-300 bg-card border-border"
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
							>
								<stat.icon className="w-6 h-6 text-white" />
							</div>
							<div
								className={`flex items-center text-sm ${
									stat.trend === "up"
										? "text-green-600"
										: "text-muted-foreground"
								}`}
							>
								<TrendingUp className="w-4 h-4 mr-1" />
							</div>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-foreground mb-1">
								{stat.value}
							</h3>
							<p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
							<p
								className={`text-xs ${
									stat.trend === "up"
										? "text-green-600"
										: "text-muted-foreground"
								}`}
							>
								{stat.change}
							</p>
						</div>
					</Card>
				))}
			</motion.div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<h2 className="text-xl font-bold text-foreground mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{quickActions.map((action, index) => (
						<Card
							key={index}
							className="p-4 hover:shadow-lg transition-all duration-300 bg-card border-border group cursor-pointer"
						>
							<div className="flex items-center space-x-3 mb-3">
								<div
									className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}
								>
									<action.icon className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-foreground">
										{action.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{action.description}
									</p>
								</div>
								{action.urgent && (
									<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
								)}
							</div>
							<Button
								className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-300`}
								size="sm"
							>
								{action.action}
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</Card>
					))}
				</div>
			</motion.div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Upcoming Events */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card className="p-6 bg-card border-border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-foreground">
								Upcoming Events
							</h2>
							<Button variant="ghost" size="sm">
								View All
							</Button>
						</div>
						<div className="space-y-3">
							{upcomingEvents.map((event) => (
								<div
									key={event.id}
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
								>
									<div className={`w-3 h-3 rounded-full ${event.color}`} />
									<div className="flex-1">
										<h3 className="font-medium text-foreground">
											{event.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{event.date} at {event.time}
										</p>
									</div>
									<Clock className="w-4 h-4 text-muted-foreground" />
								</div>
							))}
						</div>
					</Card>
				</motion.div>

				{/* Recent Achievements */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Card className="p-6 bg-card border-border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-foreground">
								Recent Achievements
							</h2>
							<Button variant="ghost" size="sm">
								View All
							</Button>
						</div>
						<div className="space-y-3">
							{recentAchievements.map((achievement) => (
								<div
									key={achievement.id}
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
								>
									<div
										className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center`}
									>
										<achievement.icon className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<h3 className="font-medium text-foreground">
											{achievement.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{achievement.description}
										</p>
									</div>
									<div className="text-right">
										<div className="text-sm font-semibold text-primary">
											+{achievement.points}
										</div>
										<div className="text-xs text-muted-foreground">
											{achievement.date}
										</div>
									</div>
								</div>
							))}
						</div>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
