"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	BookOpen,
	Target,
	TrendingUp,
	Clock,
	Star,
	Award,
	Lock,
	Check,
	Play,
	BarChart3,
	Brain,
	Route,
	Trophy,
	Users,
	Zap,
	GitBranch,
	ChevronRight,
	ChevronDown,
	Search,
	Filter,
	Eye,
} from "lucide-react";

// Types
interface Skill {
	id: string;
	name: string;
	level: number;
	maxLevel: number;
	xp: number;
	xpToNext: number;
	category: string;
	icon: string;
}

interface LearningNode {
	id: string;
	title: string;
	description: string;
	type: "lesson" | "quiz" | "project" | "milestone";
	duration: number;
	difficulty: "beginner" | "intermediate" | "advanced";
	status: "locked" | "available" | "in-progress" | "completed";
	prerequisites: string[];
	skills: string[];
	xpReward: number;
	progress: number;
	icon: string;
}

interface LearningPath {
	id: string;
	title: string;
	description: string;
	category: string;
	level: "beginner" | "intermediate" | "advanced";
	estimatedTime: string;
	enrolledStudents: number;
	rating: number;
	completion: number;
	nodes: LearningNode[];
	skills: string[];
	prerequisites: string[];
	instructor: string;
	isEnrolled: boolean;
	thumbnail: string;
}

interface LearningPathsProps {
	studentData: {
		name: string;
		class: string;
		rollNumber: string;
		profilePicture: string;
	};
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function LearningPaths(_: LearningPathsProps) {
	const [activeTab, setActiveTab] = useState<"paths" | "skills" | "progress">(
		"paths"
	);
	const [selectedPath, setSelectedPath] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedNode, setExpandedNode] = useState<string | null>(null);

	// Sample data
	const skills = useMemo<Skill[]>(
		() => [
			{
				id: "math-algebra",
				name: "Algebra",
				level: 4,
				maxLevel: 10,
				xp: 850,
				xpToNext: 150,
				category: "Mathematics",
				icon: "target",
			},
			{
				id: "science-physics",
				name: "Physics",
				level: 3,
				maxLevel: 10,
				xp: 520,
				xpToNext: 280,
				category: "Science",
				icon: "zap",
			},
			{
				id: "english-writing",
				name: "Creative Writing",
				level: 5,
				maxLevel: 10,
				xp: 1200,
				xpToNext: 300,
				category: "English",
				icon: "book-open",
			},
			{
				id: "programming-python",
				name: "Python Programming",
				level: 2,
				maxLevel: 10,
				xp: 300,
				xpToNext: 200,
				category: "Technology",
				icon: "brain",
			},
			{
				id: "critical-thinking",
				name: "Critical Thinking",
				level: 3,
				maxLevel: 10,
				xp: 450,
				xpToNext: 350,
				category: "Life Skills",
				icon: "eye",
			},
		],
		[]
	);

	const learningPaths = useMemo<LearningPath[]>(
		() => [
			{
				id: "advanced-mathematics",
				title: "Advanced Mathematics Mastery",
				description:
					"Master calculus, statistics, and advanced algebraic concepts through interactive lessons and real-world applications.",
				category: "Mathematics",
				level: "advanced",
				estimatedTime: "12 weeks",
				enrolledStudents: 245,
				rating: 4.8,
				completion: 67,
				skills: ["math-algebra", "math-calculus", "math-statistics"],
				prerequisites: ["basic-algebra", "geometry"],
				instructor: "Dr. Sarah Johnson",
				isEnrolled: true,
				thumbnail: "🔢",
				nodes: [
					{
						id: "node-1",
						title: "Linear Equations Review",
						description:
							"Refresh your understanding of linear equations and their applications",
						type: "lesson",
						duration: 45,
						difficulty: "beginner",
						status: "completed",
						prerequisites: [],
						skills: ["math-algebra"],
						xpReward: 50,
						progress: 100,
						icon: "book-open",
					},
					{
						id: "node-2",
						title: "Quadratic Functions",
						description:
							"Deep dive into quadratic functions, graphing, and real-world applications",
						type: "lesson",
						duration: 60,
						difficulty: "intermediate",
						status: "in-progress",
						prerequisites: ["node-1"],
						skills: ["math-algebra"],
						xpReward: 75,
						progress: 45,
						icon: "trending-up",
					},
					{
						id: "node-3",
						title: "Quadratic Quiz",
						description: "Test your understanding of quadratic functions",
						type: "quiz",
						duration: 30,
						difficulty: "intermediate",
						status: "available",
						prerequisites: ["node-2"],
						skills: ["math-algebra"],
						xpReward: 100,
						progress: 0,
						icon: "target",
					},
					{
						id: "node-4",
						title: "Calculus Introduction",
						description: "Introduction to limits and derivatives",
						type: "lesson",
						duration: 90,
						difficulty: "advanced",
						status: "locked",
						prerequisites: ["node-3"],
						skills: ["math-calculus"],
						xpReward: 125,
						progress: 0,
						icon: "brain",
					},
				],
			},
			{
				id: "physics-mechanics",
				title: "Classical Mechanics & Motion",
				description:
					"Explore the fundamental principles of motion, forces, and energy through experiments and simulations.",
				category: "Science",
				level: "intermediate",
				estimatedTime: "8 weeks",
				enrolledStudents: 189,
				rating: 4.6,
				completion: 23,
				skills: ["science-physics", "math-algebra"],
				prerequisites: ["basic-physics"],
				instructor: "Prof. Michael Chen",
				isEnrolled: true,
				thumbnail: "⚡",
				nodes: [
					{
						id: "physics-1",
						title: "Forces and Motion",
						description: "Understanding Newton's laws of motion",
						type: "lesson",
						duration: 50,
						difficulty: "beginner",
						status: "completed",
						prerequisites: [],
						skills: ["science-physics"],
						xpReward: 60,
						progress: 100,
						icon: "zap",
					},
					{
						id: "physics-2",
						title: "Motion Lab Simulation",
						description: "Interactive lab to experiment with motion principles",
						type: "project",
						duration: 75,
						difficulty: "intermediate",
						status: "available",
						prerequisites: ["physics-1"],
						skills: ["science-physics"],
						xpReward: 120,
						progress: 0,
						icon: "play",
					},
				],
			},
			{
				id: "creative-writing",
				title: "Creative Writing Workshop",
				description:
					"Develop your storytelling skills through guided exercises, peer reviews, and creative projects.",
				category: "English",
				level: "beginner",
				estimatedTime: "6 weeks",
				enrolledStudents: 156,
				rating: 4.9,
				completion: 0,
				skills: ["english-writing", "critical-thinking"],
				prerequisites: [],
				instructor: "Ms. Emma Rodriguez",
				isEnrolled: false,
				thumbnail: "✍️",
				nodes: [
					{
						id: "writing-1",
						title: "Character Development",
						description: "Learn to create compelling characters",
						type: "lesson",
						duration: 40,
						difficulty: "beginner",
						status: "available",
						prerequisites: [],
						skills: ["english-writing"],
						xpReward: 45,
						progress: 0,
						icon: "users",
					},
				],
			},
			{
				id: "python-programming",
				title: "Python Programming Fundamentals",
				description:
					"Learn programming concepts through Python, from basic syntax to building real applications.",
				category: "Technology",
				level: "beginner",
				estimatedTime: "10 weeks",
				enrolledStudents: 298,
				rating: 4.7,
				completion: 15,
				skills: ["programming-python", "critical-thinking"],
				prerequisites: [],
				instructor: "Mr. Alex Kumar",
				isEnrolled: true,
				thumbnail: "🐍",
				nodes: [
					{
						id: "python-1",
						title: "Python Basics",
						description: "Variables, data types, and basic operations",
						type: "lesson",
						duration: 55,
						difficulty: "beginner",
						status: "completed",
						prerequisites: [],
						skills: ["programming-python"],
						xpReward: 70,
						progress: 100,
						icon: "book-open",
					},
					{
						id: "python-2",
						title: "Control Structures",
						description: "If statements, loops, and conditional logic",
						type: "lesson",
						duration: 65,
						difficulty: "beginner",
						status: "available",
						prerequisites: ["python-1"],
						skills: ["programming-python"],
						xpReward: 85,
						progress: 0,
						icon: "git-branch",
					},
				],
			},
		],
		[]
	);

	// Filter functions
	const filteredPaths = useMemo(() => {
		return learningPaths.filter((path) => {
			const matchesCategory =
				selectedCategory === "all" || path.category === selectedCategory;
			const matchesSearch =
				path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				path.description.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [learningPaths, selectedCategory, searchQuery]);

	const categories = useMemo(() => {
		const cats = [
			"all",
			...Array.from(new Set(learningPaths.map((path) => path.category))),
		];
		return cats;
	}, [learningPaths]);

	// Event handlers
	const handleEnroll = useCallback((pathId: string) => {
		console.log("Enrolling in path:", pathId);
		// Enrollment logic would go here
	}, []);

	const handleNodeClick = useCallback(
		(nodeId: string) => {
			setExpandedNode(expandedNode === nodeId ? null : nodeId);
		},
		[expandedNode]
	);

	const handleStartNode = useCallback((nodeId: string) => {
		console.log("Starting node:", nodeId);
		// Node start logic would go here
	}, []);

	// Helper functions
	const getIcon = useCallback((iconName: string) => {
		const iconMap: {
			[key: string]: React.ComponentType<{ className?: string }>;
		} = {
			target: Target,
			star: Star,
			zap: Zap,
			"book-open": BookOpen,
			users: Users,
			"trending-up": TrendingUp,
			clock: Clock,
			brain: Brain,
			eye: Eye,
			play: Play,
			"git-branch": GitBranch,
			award: Award,
		};
		const IconComponent = iconMap[iconName] || BookOpen;
		return <IconComponent className="w-5 h-5 text-white" />;
	}, []);

	const getStatusIcon = useCallback((status: LearningNode["status"]) => {
		switch (status) {
			case "completed":
				return <Check className="w-4 h-4 text-green-500" />;
			case "in-progress":
				return <Play className="w-4 h-4 text-blue-500" />;
			case "available":
				return <BookOpen className="w-4 h-4 text-yellow-500" />;
			case "locked":
				return <Lock className="w-4 h-4 text-gray-400" />;
			default:
				return <BookOpen className="w-4 h-4" />;
		}
	}, []);

	const getSkillColor = useCallback((category: string) => {
		const colors: { [key: string]: string } = {
			Mathematics: "bg-blue-500",
			Science: "bg-green-500",
			English: "bg-purple-500",
			Technology: "bg-orange-500",
			"Life Skills": "bg-pink-500",
		};
		return colors[category] || "bg-gray-500";
	}, []);

	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
						<Route className="w-6 h-6 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-white-900 ">Learning Paths</h1>
				</div>
				<p className="text-gray-400 dark:text-white-300">
					Personalized learning journeys designed to help you master new skills
					and achieve your academic goals.
				</p>
			</motion.div>

			{/* Tab Navigation */}
			<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
				{[
					{ id: "paths", label: "Learning Paths", icon: Route },
					{ id: "skills", label: "Skills Progress", icon: Target },
					{ id: "progress", label: "My Progress", icon: BarChart3 },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() =>
							setActiveTab(tab.id as "paths" | "skills" | "progress")
						}
						className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
							activeTab === tab.id
								? "bg-gray-900 dark:bg-blue-700 text-purple-600 dark:text-purple-400 shadow-sm"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						<tab.icon className="w-4 h-4" />
						{tab.label}
					</button>
				))}
			</div>

			<AnimatePresence mode="wait">
				{activeTab === "paths" && (
					<motion.div
						key="paths"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						{/* Filters */}
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
							<div className="relative flex-1 max-w-md">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search learning paths..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="w-4 h-4 text-gray-500" />
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category === "all" ? "All Categories" : category}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Learning Paths Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{filteredPaths.map((path, index) => (
								<motion.div
									key={path.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className=" border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
								>
									<div className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
													{path.thumbnail}
												</div>
												<div>
													<h3 className="font-semibold text-lg text-black-900 dark:text-black-600">
														{path.title}
													</h3>
													<p className="text-sm text-black-500 dark:text-white-400">
														{path.instructor}
													</p>
												</div>
											</div>
											{path.isEnrolled && (
												<div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
													Enrolled
												</div>
											)}
										</div>

										<p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
											{path.description}
										</p>

										<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
											<div className="flex items-center gap-1">
												<Clock className="w-4 h-4" />
												{path.estimatedTime}
											</div>
											<div className="flex items-center gap-1">
												<Users className="w-4 h-4" />
												{path.enrolledStudents} students
											</div>
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 text-yellow-500" />
												{path.rating}
											</div>
										</div>

										{path.isEnrolled && (
											<div className="mb-4">
												<div className="flex items-center justify-between text-sm mb-1">
													<span className="text-gray-600 dark:text-gray-300">
														Progress
													</span>
													<span className="font-medium text-purple-600 dark:text-purple-400">
														{path.completion}%
													</span>
												</div>
												<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
													<motion.div
														initial={{ width: 0 }}
														animate={{ width: `${path.completion}%` }}
														transition={{ duration: 0.5, delay: index * 0.1 }}
														className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
													/>
												</div>
											</div>
										)}

										<div className="flex items-center justify-between">
											{path.isEnrolled ? (
												<button
													onClick={() => setSelectedPath(path.id)}
													className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
												>
													<Play className="w-4 h-4" />
													Continue Learning
												</button>
											) : (
												<button
													onClick={() => handleEnroll(path.id)}
													className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
												>
													<BookOpen className="w-4 h-4" />
													Enroll Now
												</button>
											)}
											<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<Award className="w-4 h-4" />
												{path.level}
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* Path Detail Modal */}
						<AnimatePresence>
							{selectedPath && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
									onClick={() => setSelectedPath(null)}
								>
									<motion.div
										initial={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.9, opacity: 0 }}
										className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
										onClick={(e) => e.stopPropagation()}
									>
										{(() => {
											const path = learningPaths.find(
												(p) => p.id === selectedPath
											);
											if (!path) return null;

											return (
												<div className="p-6">
													<div className="flex items-center justify-between mb-6">
														<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
															{path.title} - Learning Path
														</h2>
														<button
															onClick={() => setSelectedPath(null)}
															className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
														>
															<ChevronRight className="w-5 h-5 text-gray-500 transform rotate-45" />
														</button>
													</div>

													<div className="space-y-4">
														{path.nodes.map((node, index) => (
															<motion.div
																key={node.id}
																initial={{ opacity: 0, x: -20 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{ delay: index * 0.1 }}
																className={`border rounded-lg p-4 transition-all ${
																	node.status === "locked"
																		? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
																		: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer"
																}`}
																onClick={() =>
																	node.status !== "locked" &&
																	handleNodeClick(node.id)
																}
															>
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-3">
																		{getStatusIcon(node.status)}
																		<div className="flex items-center gap-2">
																			{getIcon(node.icon)}
																			<h3
																				className={`font-medium ${
																					node.status === "locked"
																						? "text-gray-400 dark:text-gray-600"
																						: "text-gray-900 dark:text-white"
																				}`}
																			>
																				{node.title}
																			</h3>
																		</div>
																	</div>
																	<div className="flex items-center gap-3">
																		<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
																			<Clock className="w-4 h-4" />
																			{node.duration}m
																		</div>
																		{node.status !== "locked" && (
																			<ChevronDown
																				className={`w-4 h-4 text-gray-500 transition-transform ${
																					expandedNode === node.id
																						? "transform rotate-180"
																						: ""
																				}`}
																			/>
																		)}
																	</div>
																</div>

																{node.status === "in-progress" && (
																	<div className="mt-3">
																		<div className="flex items-center justify-between text-sm mb-1">
																			<span className="text-gray-600 dark:text-gray-300">
																				Progress
																			</span>
																			<span className="font-medium text-blue-600 dark:text-blue-400">
																				{node.progress}%
																			</span>
																		</div>
																		<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
																			<div
																				className="bg-blue-500 h-2 rounded-full transition-all duration-300"
																				style={{ width: `${node.progress}%` }}
																			/>
																		</div>
																	</div>
																)}

																<AnimatePresence>
																	{expandedNode === node.id && (
																		<motion.div
																			initial={{ opacity: 0, height: 0 }}
																			animate={{ opacity: 1, height: "auto" }}
																			exit={{ opacity: 0, height: 0 }}
																			className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
																		>
																			<p className="text-gray-600 dark:text-gray-300 mb-4">
																				{node.description}
																			</p>
																			<div className="flex items-center justify-between">
																				<div className="flex items-center gap-4 text-sm">
																					<div className="flex items-center gap-1">
																						<Award className="w-4 h-4 text-yellow-500" />
																						<span className="text-gray-600 dark:text-gray-300">
																							{node.xpReward} XP
																						</span>
																					</div>
																					<div className="flex items-center gap-1">
																						<Target className="w-4 h-4 text-purple-500" />
																						<span className="text-gray-600 dark:text-gray-300">
																							{node.difficulty}
																						</span>
																					</div>
																				</div>
																				{node.status === "available" && (
																					<button
																						onClick={(e) => {
																							e.stopPropagation();
																							handleStartNode(node.id);
																						}}
																						className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
																					>
																						Start {node.type}
																					</button>
																				)}
																			</div>
																		</motion.div>
																	)}
																</AnimatePresence>
															</motion.div>
														))}
													</div>
												</div>
											);
										})()}
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}

				{activeTab === "skills" && (
					<motion.div
						key="skills"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{skills.map((skill, index) => (
								<motion.div
									key={skill.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
								>
									<div className="flex items-center gap-3 mb-4">
										<div
											className={`p-2 ${getSkillColor(
												skill.category
											)} rounded-lg`}
										>
											{getIcon(skill.icon)}
										</div>
										<div>
											<h3 className="font-semibold text-gray-900 dark:text-white">
												{skill.name}
											</h3>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{skill.category}
											</p>
										</div>
									</div>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600 dark:text-gray-300">
												Level {skill.level}/{skill.maxLevel}
											</span>
											<span className="text-sm font-medium text-purple-600 dark:text-purple-400">
												{skill.xp} XP
											</span>
										</div>

										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
											<motion.div
												initial={{ width: 0 }}
												animate={{
													width: `${(skill.level / skill.maxLevel) * 100}%`,
												}}
												transition={{ duration: 0.5, delay: index * 0.1 }}
												className={`h-3 rounded-full ${getSkillColor(
													skill.category
												)}`}
											/>
										</div>

										<div className="text-xs text-gray-500 dark:text-gray-400">
											{skill.xpToNext} XP to next level
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === "progress" && (
					<motion.div
						key="progress"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-semibold">Total XP Earned</h3>
									<Trophy className="w-6 h-6" />
								</div>
								<div className="text-3xl font-bold mb-2">3,320</div>
								<div className="text-purple-100 text-sm">+120 this week</div>
							</div>

							<div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-semibold">Active Paths</h3>
									<Route className="w-6 h-6" />
								</div>
								<div className="text-3xl font-bold mb-2">3</div>
								<div className="text-blue-100 text-sm">2 in progress</div>
							</div>

							<div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-semibold">Completed Nodes</h3>
									<Check className="w-6 h-6" />
								</div>
								<div className="text-3xl font-bold mb-2">28</div>
								<div className="text-green-100 text-sm">5 this week</div>
							</div>
						</div>

						<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
							<h3 className="font-semibold text-lg text-gray-900 mb-4">
								Recent Activity
							</h3>
							<div className="space-y-4">
								{[
									{
										title: 'Completed "Quadratic Functions" lesson',
										path: "Advanced Mathematics Mastery",
										time: "2 hours ago",
										xp: 75,
									},
									{
										title: 'Started "Motion Lab Simulation" project',
										path: "Classical Mechanics & Motion",
										time: "1 day ago",
										xp: 0,
									},
									{
										title: 'Completed "Python Basics" lesson',
										path: "Python Programming Fundamentals",
										time: "3 days ago",
										xp: 70,
									},
								].map((activity, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
									>
										<div>
											<h4 className="font-medium text-black-900 dark:text-white">
												{activity.title}
											</h4>
											<p className="text-sm text-black-500 dark:text-white-400">
												{activity.path}
											</p>
										</div>
										<div className="text-right">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{activity.time}
											</div>
											{activity.xp > 0 && (
												<div className="text-sm font-medium text-purple-600 dark:text-purple-400">
													+{activity.xp} XP
												</div>
											)}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
