"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Trophy,
	Medal,
	Star,
	Award,
	Target,
	Crown,
	Flame,
	Zap,
	BookOpen,
	Clock,
	TrendingUp,
	Users,
	CheckCircle,
	Lock,
	Gift,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	category: "academic" | "streak" | "participation" | "improvement" | "special";
	tier: "bronze" | "silver" | "gold" | "platinum";
	points: number;
	isUnlocked: boolean;
	unlockedDate?: string;
	progress: number;
	maxProgress: number;
	requirements: string;
	rarity: "common" | "uncommon" | "rare" | "legendary";
}

interface Badge {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
	earnedDate: string;
	category: string;
}

interface Leaderboard {
	rank: number;
	studentName: string;
	totalPoints: number;
	badges: number;
	achievements: number;
	avatar: string;
}

export function Achievements() {
	const [activeTab, setActiveTab] = useState<
		"achievements" | "badges" | "leaderboard" | "rewards"
	>("achievements");
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | "academic" | "streak" | "participation" | "improvement" | "special"
	>("all");
	const [selectedAchievement, setSelectedAchievement] =
		useState<Achievement | null>(null);

	const achievements: Achievement[] = [
		{
			id: "1",
			title: "First Steps",
			description: "Complete your first assignment",
			icon: "target",
			category: "academic",
			tier: "bronze",
			points: 10,
			isUnlocked: true,
			unlockedDate: "2024-01-15",
			progress: 1,
			maxProgress: 1,
			requirements: "Submit your first assignment",
			rarity: "common",
		},
		{
			id: "2",
			title: "Perfect Score",
			description: "Score 100% on any test",
			icon: "star",
			category: "academic",
			tier: "gold",
			points: 50,
			isUnlocked: true,
			unlockedDate: "2024-01-20",
			progress: 1,
			maxProgress: 1,
			requirements: "Score 100% on any test or quiz",
			rarity: "rare",
		},
		{
			id: "3",
			title: "Speed Demon",
			description: "Complete a test in under 50% of allotted time",
			icon: "zap",
			category: "academic",
			tier: "silver",
			points: 25,
			isUnlocked: true,
			unlockedDate: "2024-01-22",
			progress: 1,
			maxProgress: 1,
			requirements: "Complete any test in less than half the time limit",
			rarity: "uncommon",
		},
		{
			id: "4",
			title: "Study Streak",
			description: "Study for 7 consecutive days",
			icon: "flame",
			category: "streak",
			tier: "silver",
			points: 30,
			isUnlocked: true,
			unlockedDate: "2024-01-28",
			progress: 7,
			maxProgress: 7,
			requirements: "Complete daily study activities for 7 days",
			rarity: "uncommon",
		},
		{
			id: "5",
			title: "Knowledge Seeker",
			description: "Read 10 books in the digital library",
			icon: "book-open",
			category: "academic",
			tier: "gold",
			points: 40,
			isUnlocked: false,
			progress: 6,
			maxProgress: 10,
			requirements: "Read 10 different books from the e-library",
			rarity: "rare",
		},
		{
			id: "6",
			title: "Class Participation",
			description: "Attend 20 live classes",
			icon: "users",
			category: "participation",
			tier: "bronze",
			points: 20,
			isUnlocked: false,
			progress: 15,
			maxProgress: 20,
			requirements: "Attend 20 live classes without missing",
			rarity: "common",
		},
		{
			id: "7",
			title: "Rising Star",
			description: "Improve test scores by 20% over 5 tests",
			icon: "trending-up",
			category: "improvement",
			tier: "gold",
			points: 45,
			isUnlocked: false,
			progress: 3,
			maxProgress: 5,
			requirements:
				"Show consistent 20% improvement across 5 consecutive tests",
			rarity: "rare",
		},
		{
			id: "8",
			title: "Night Owl",
			description: "Study after 10 PM for 5 days",
			icon: "clock",
			category: "special",
			tier: "bronze",
			points: 15,
			isUnlocked: false,
			progress: 2,
			maxProgress: 5,
			requirements: "Complete study sessions after 10 PM for 5 different days",
			rarity: "common",
		},
		{
			id: "9",
			title: "Academic Excellence",
			description: "Maintain 90%+ average for a month",
			icon: "crown",
			category: "academic",
			tier: "platinum",
			points: 100,
			isUnlocked: false,
			progress: 15,
			maxProgress: 30,
			requirements:
				"Maintain 90% or higher average score for 30 consecutive days",
			rarity: "legendary",
		},
	];

	const badges: Badge[] = [
		{
			id: "1",
			name: "Mathematics Master",
			description: "Excellent performance in Mathematics",
			color: "blue",
			icon: "calculator",
			earnedDate: "2024-01-25",
			category: "Subject Excellence",
		},
		{
			id: "2",
			name: "Perfect Attendance",
			description: "Never missed a class this month",
			color: "green",
			icon: "check-circle",
			earnedDate: "2024-01-30",
			category: "Attendance",
		},
		{
			id: "3",
			name: "Quick Learner",
			description: "Completed assignments ahead of schedule",
			color: "yellow",
			icon: "zap",
			earnedDate: "2024-01-18",
			category: "Performance",
		},
		{
			id: "4",
			name: "Helpful Student",
			description: "Assisted classmates in group activities",
			color: "purple",
			icon: "users",
			earnedDate: "2024-01-22",
			category: "Collaboration",
		},
	];

	const leaderboard: Leaderboard[] = [
		{
			rank: 1,
			studentName: "Emma Wilson",
			totalPoints: 875,
			badges: 12,
			achievements: 15,
			avatar: "/avatars/student1.jpg",
		},
		{
			rank: 2,
			studentName: "Alex Chen",
			totalPoints: 820,
			badges: 10,
			achievements: 13,
			avatar: "/avatars/student2.jpg",
		},
		{
			rank: 3,
			studentName: "You",
			totalPoints: 795,
			badges: 9,
			achievements: 12,
			avatar: "/avatars/current-user.jpg",
		},
		{
			rank: 4,
			studentName: "Sarah Johnson",
			totalPoints: 760,
			badges: 8,
			achievements: 11,
			avatar: "/avatars/student3.jpg",
		},
		{
			rank: 5,
			studentName: "Michael Brown",
			totalPoints: 725,
			badges: 7,
			achievements: 10,
			avatar: "/avatars/student4.jpg",
		},
	];

	const getIcon = (iconName: string) => {
		const iconMap: {
			[key: string]: React.ComponentType<{ className?: string }>;
		} = {
			target: Target,
			star: Star,
			zap: Zap,
			flame: Flame,
			"book-open": BookOpen,
			users: Users,
			"trending-up": TrendingUp,
			clock: Clock,
			crown: Crown,
			trophy: Trophy,
			medal: Medal,
			award: Award,
		};
		const IconComponent = iconMap[iconName] || Trophy;
		return <IconComponent className="w-6 h-6" />;
	};

	const getTierColor = (tier: string) => {
		switch (tier) {
			case "bronze":
				return "from-orange-600 to-orange-800";
			case "silver":
				return "from-gray-400 to-gray-600";
			case "gold":
				return "from-yellow-400 to-yellow-600";
			case "platinum":
				return "from-purple-400 to-purple-600";
			default:
				return "from-gray-400 to-gray-600";
		}
	};

	const getRarityColor = (rarity: string) => {
		switch (rarity) {
			case "common":
				return "border-gray-300";
			case "uncommon":
				return "border-green-400";
			case "rare":
				return "border-blue-400";
			case "legendary":
				return "border-purple-500 shadow-purple-200";
			default:
				return "border-gray-300";
		}
	};

	const getBadgeColor = (color: string) => {
		switch (color) {
			case "blue":
				return "bg-blue-500";
			case "green":
				return "bg-green-500";
			case "yellow":
				return "bg-yellow-500";
			case "purple":
				return "bg-purple-500";
			case "red":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const filteredAchievements = achievements.filter(
		(achievement) =>
			selectedCategory === "all" || achievement.category === selectedCategory
	);

	const totalPoints = achievements
		.filter((a) => a.isUnlocked)
		.reduce((sum, a) => sum + a.points, 0);

	const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Achievements</h1>
					<p className="text-muted-foreground">
						Track your progress and celebrate your accomplishments
					</p>
				</div>

				<div className="flex items-center space-x-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-500">
							{totalPoints}
						</div>
						<div className="text-xs text-muted-foreground">Total Points</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-500">
							{unlockedCount}
						</div>
						<div className="text-xs text-muted-foreground">Unlocked</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-border">
				<nav className="-mb-px flex space-x-8">
					{[
						{
							key: "achievements" as const,
							label: "Achievements",
							count: achievements.length,
						},
						{ key: "badges" as const, label: "Badges", count: badges.length },
						{ key: "leaderboard" as const, label: "Leaderboard", count: null },
						{ key: "rewards" as const, label: "Rewards", count: null },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === tab.key
									? "border-blue-500 text-blue-600 dark:text-blue-400"
									: "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
							}`}
						>
							{tab.label}
							{tab.count !== null && (
								<span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
									{tab.count}
								</span>
							)}
						</button>
					))}
				</nav>
			</div>

			{/* Content */}
			{activeTab === "achievements" && (
				<div className="space-y-6">
					{/* Category Filter */}
					<div className="flex flex-wrap gap-2">
						{[
							{ key: "all" as const, label: "All" },
							{ key: "academic" as const, label: "Academic" },
							{ key: "streak" as const, label: "Streak" },
							{ key: "participation" as const, label: "Participation" },
							{ key: "improvement" as const, label: "Improvement" },
							{ key: "special" as const, label: "Special" },
						].map((category) => (
							<Button
								key={category.key}
								variant={
									selectedCategory === category.key ? "default" : "outline"
								}
								size="sm"
								onClick={() => setSelectedCategory(category.key)}
							>
								{category.label}
							</Button>
						))}
					</div>

					{/* Achievements Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredAchievements.map((achievement) => (
							<motion.div
								key={achievement.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className={`relative bg-card border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
									achievement.isUnlocked
										? getRarityColor(achievement.rarity)
										: "border-border opacity-60"
								}`}
								onClick={() => setSelectedAchievement(achievement)}
							>
								{/* Tier Badge */}
								<div
									className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${getTierColor(
										achievement.tier
									)} flex items-center justify-center`}
								>
									<Medal className="w-4 h-4 text-white" />
								</div>

								{/* Lock Overlay */}
								{!achievement.isUnlocked && (
									<div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
										<Lock className="w-8 h-8 text-muted-foreground" />
									</div>
								)}

								<div className="space-y-4">
									<div className="flex items-center space-x-3">
										<div
											className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTierColor(
												achievement.tier
											)} flex items-center justify-center text-white`}
										>
											{getIcon(achievement.icon)}
										</div>
										<div>
											<h3 className="font-medium text-foreground">
												{achievement.title}
											</h3>
											<p className="text-xs text-muted-foreground capitalize">
												{achievement.category}
											</p>
										</div>
									</div>

									<p className="text-sm text-muted-foreground">
										{achievement.description}
									</p>

									{/* Progress Bar */}
									{!achievement.isUnlocked && (
										<div className="space-y-2">
											<div className="flex justify-between text-xs">
												<span className="text-muted-foreground">Progress</span>
												<span className="text-muted-foreground">
													{achievement.progress}/{achievement.maxProgress}
												</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div
													className="bg-blue-500 h-2 rounded-full"
													style={{
														width: `${
															(achievement.progress / achievement.maxProgress) *
															100
														}%`,
													}}
												/>
											</div>
										</div>
									)}

									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Star className="w-4 h-4 text-yellow-500" />
											<span className="text-sm font-medium text-foreground">
												{achievement.points} pts
											</span>
										</div>
										{achievement.isUnlocked && achievement.unlockedDate && (
											<span className="text-xs text-muted-foreground">
												{achievement.unlockedDate}
											</span>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{activeTab === "badges" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{badges.map((badge) => (
							<motion.div
								key={badge.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow"
							>
								<div
									className={`w-16 h-16 rounded-full ${getBadgeColor(
										badge.color
									)} mx-auto mb-4 flex items-center justify-center`}
								>
									<CheckCircle className="w-8 h-8 text-white" />
								</div>
								<h3 className="font-medium text-foreground mb-2">
									{badge.name}
								</h3>
								<p className="text-sm text-muted-foreground mb-2">
									{badge.description}
								</p>
								<div className="text-xs text-muted-foreground">
									{badge.category} • {badge.earnedDate}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{activeTab === "leaderboard" && (
				<div className="space-y-6">
					<div className="bg-card border border-border rounded-lg overflow-hidden">
						<div className="p-6 border-b border-border">
							<h2 className="text-lg font-semibold text-foreground">
								Student Rankings
							</h2>
							<p className="text-sm text-muted-foreground">
								Based on achievement points and badges earned
							</p>
						</div>

						<div className="divide-y divide-border">
							{leaderboard.map((student) => (
								<div
									key={student.rank}
									className={`p-6 flex items-center justify-between hover:bg-muted/50 transition-colors ${
										student.studentName === "You"
											? "bg-blue-50 dark:bg-blue-900/20"
											: ""
									}`}
								>
									<div className="flex items-center space-x-4">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
												student.rank === 1
													? "bg-yellow-500"
													: student.rank === 2
													? "bg-gray-400"
													: student.rank === 3
													? "bg-orange-600"
													: "bg-gray-300"
											}`}
										>
											{student.rank <= 3 ? (
												student.rank === 1 ? (
													<Crown className="w-5 h-5" />
												) : student.rank === 2 ? (
													<Medal className="w-5 h-5" />
												) : (
													<Award className="w-5 h-5" />
												)
											) : (
												student.rank
											)}
										</div>

										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
											{student.studentName
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>

										<div>
											<h3
												className={`font-medium ${
													student.studentName === "You"
														? "text-blue-600 dark:text-blue-400"
														: "text-foreground"
												}`}
											>
												{student.studentName}
											</h3>
											<p className="text-sm text-muted-foreground">
												{student.badges} badges • {student.achievements}{" "}
												achievements
											</p>
										</div>
									</div>

									<div className="text-right">
										<div className="text-lg font-bold text-foreground">
											{student.totalPoints}
										</div>
										<div className="text-xs text-muted-foreground">points</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "rewards" && (
				<div className="space-y-6">
					<div className="text-center py-12">
						<Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium text-foreground mb-2">
							Rewards Coming Soon!
						</h3>
						<p className="text-muted-foreground">
							Exciting rewards and prizes will be available soon. Keep earning
							achievements to unlock them!
						</p>
					</div>
				</div>
			)}

			{/* Achievement Details Modal */}
			{selectedAchievement && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-card border border-border rounded-lg max-w-md w-full p-6"
					>
						<div className="text-center space-y-4">
							<div
								className={`w-20 h-20 mx-auto rounded-lg bg-gradient-to-br ${getTierColor(
									selectedAchievement.tier
								)} flex items-center justify-center text-white`}
							>
								{getIcon(selectedAchievement.icon)}
							</div>

							<div>
								<h2 className="text-xl font-bold text-foreground">
									{selectedAchievement.title}
								</h2>
								<p className="text-sm text-muted-foreground capitalize">
									{selectedAchievement.category} • {selectedAchievement.tier}
								</p>
							</div>

							<p className="text-muted-foreground">
								{selectedAchievement.description}
							</p>

							<div className="bg-muted rounded-lg p-4">
								<h3 className="font-medium text-foreground mb-2">
									Requirements
								</h3>
								<p className="text-sm text-muted-foreground">
									{selectedAchievement.requirements}
								</p>
							</div>

							{!selectedAchievement.isUnlocked && (
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Progress</span>
										<span className="text-muted-foreground">
											{selectedAchievement.progress}/
											{selectedAchievement.maxProgress}
										</span>
									</div>
									<div className="w-full bg-muted rounded-full h-3">
										<div
											className="bg-blue-500 h-3 rounded-full"
											style={{
												width: `${
													(selectedAchievement.progress /
														selectedAchievement.maxProgress) *
													100
												}%`,
											}}
										/>
									</div>
								</div>
							)}

							<div className="flex items-center justify-center space-x-4">
								<div className="flex items-center space-x-1">
									<Star className="w-4 h-4 text-yellow-500" />
									<span className="text-sm font-medium">
										{selectedAchievement.points} points
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<Sparkles className="w-4 h-4 text-purple-500" />
									<span className="text-sm font-medium capitalize">
										{selectedAchievement.rarity}
									</span>
								</div>
							</div>

							{selectedAchievement.isUnlocked &&
								selectedAchievement.unlockedDate && (
									<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
										<div className="flex items-center justify-center space-x-2">
											<CheckCircle className="w-4 h-4 text-green-500" />
											<span className="text-sm text-green-700 dark:text-green-300">
												Unlocked on {selectedAchievement.unlockedDate}
											</span>
										</div>
									</div>
								)}

							<Button
								className="w-full"
								onClick={() => setSelectedAchievement(null)}
							>
								Close
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
