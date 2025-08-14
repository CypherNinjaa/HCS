"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
	Play,
	Clock,
	Trophy,
	CheckCircle,
	Target,
	Brain,
	BarChart3,
	Calendar,
	Timer,
	Award,
	TrendingUp,
	BookOpen,
	ArrowRight,
	RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MCQTest {
	id: string;
	title: string;
	subject: string;
	topic: string;
	totalQuestions: number;
	duration: number; // in minutes
	difficulty: "easy" | "medium" | "hard";
	maxScore: number;
	description: string;
	isActive: boolean;
	startDate: string;
	endDate: string;
	attempts: number;
	maxAttempts: number;
	status: "upcoming" | "active" | "completed" | "expired";
}

interface Question {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
	difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
	id: string;
	testId: string;
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	timeTaken: number;
	completedDate: string;
	percentage: number;
	rank: number;
	totalParticipants: number;
}

interface TestSession {
	testId: string;
	currentQuestion: number;
	answers: { [key: number]: number };
	timeRemaining: number;
	isActive: boolean;
	startTime: Date;
}

export function MCQTests() {
	const [activeTab, setActiveTab] = useState<
		"available" | "completed" | "results"
	>("available");
	const [selectedTest, setSelectedTest] = useState<MCQTest | null>(null);
	const [currentSession, setCurrentSession] = useState<TestSession | null>(
		null
	);
	const [isTestMode, setIsTestMode] = useState(false);
	const [showResults, setShowResults] = useState(false);

	// Sample data
	const tests: MCQTest[] = [
		{
			id: "1",
			title: "Daily Math Quiz - Algebra",
			subject: "Mathematics",
			topic: "Algebraic Expressions",
			totalQuestions: 10,
			duration: 15,
			difficulty: "medium",
			maxScore: 100,
			description:
				"Test your understanding of algebraic expressions and equations",
			isActive: true,
			startDate: "2024-02-01",
			endDate: "2024-02-05",
			attempts: 1,
			maxAttempts: 3,
			status: "active",
		},
		{
			id: "2",
			title: "Physics - Motion and Force",
			subject: "Physics",
			topic: "Mechanics",
			totalQuestions: 15,
			duration: 20,
			difficulty: "hard",
			maxScore: 150,
			description:
				"Comprehensive test on motion, force, and Newton&apos;s laws",
			isActive: true,
			startDate: "2024-02-01",
			endDate: "2024-02-03",
			attempts: 0,
			maxAttempts: 2,
			status: "active",
		},
		{
			id: "3",
			title: "English Grammar Basics",
			subject: "English",
			topic: "Grammar",
			totalQuestions: 20,
			duration: 25,
			difficulty: "easy",
			maxScore: 200,
			description: "Test your knowledge of basic English grammar rules",
			isActive: false,
			startDate: "2024-01-25",
			endDate: "2024-01-30",
			attempts: 2,
			maxAttempts: 2,
			status: "completed",
		},
		{
			id: "4",
			title: "Chemistry - Periodic Table",
			subject: "Chemistry",
			topic: "Elements and Compounds",
			totalQuestions: 12,
			duration: 18,
			difficulty: "medium",
			maxScore: 120,
			description:
				"Questions about periodic table, elements, and their properties",
			isActive: false,
			startDate: "2024-02-10",
			endDate: "2024-02-15",
			attempts: 0,
			maxAttempts: 3,
			status: "upcoming",
		},
	];

	const sampleQuestions: Question[] = useMemo(
		() => [
			{
				id: "1",
				question: "What is the value of x in the equation 2x + 5 = 13?",
				options: ["x = 3", "x = 4", "x = 5", "x = 6"],
				correctAnswer: 1,
				explanation:
					"To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
				difficulty: "easy",
			},
			{
				id: "2",
				question: "Which of the following is a quadratic equation?",
				options: ["2x + 3 = 0", "x² + 5x + 6 = 0", "3x³ + 2x = 1", "x/2 = 4"],
				correctAnswer: 1,
				explanation:
					"A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0",
				difficulty: "medium",
			},
		],
		[]
	);

	const testResults: TestResult[] = [
		{
			id: "1",
			testId: "3",
			score: 85,
			totalQuestions: 20,
			correctAnswers: 17,
			timeTaken: 22,
			completedDate: "2024-01-28",
			percentage: 85,
			rank: 3,
			totalParticipants: 45,
		},
		{
			id: "2",
			testId: "1",
			score: 70,
			totalQuestions: 10,
			correctAnswers: 7,
			timeTaken: 12,
			completedDate: "2024-01-30",
			percentage: 70,
			rank: 8,
			totalParticipants: 32,
		},
	];

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
			case "medium":
				return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
			case "hard":
				return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
			case "completed":
				return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
			case "upcoming":
				return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
			case "expired":
				return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	const formatTimeRemaining = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const startTest = (test: MCQTest) => {
		const session: TestSession = {
			testId: test.id,
			currentQuestion: 0,
			answers: {},
			timeRemaining: test.duration * 60, // convert to seconds
			isActive: true,
			startTime: new Date(),
		};

		setCurrentSession(session);
		setSelectedTest(test);
		setIsTestMode(true);
	};

	const submitAnswer = (questionIndex: number, answerIndex: number) => {
		if (!currentSession) return;

		setCurrentSession({
			...currentSession,
			answers: {
				...currentSession.answers,
				[questionIndex]: answerIndex,
			},
		});
	};

	const nextQuestion = () => {
		if (!currentSession || !selectedTest) return;

		if (currentSession.currentQuestion < selectedTest.totalQuestions - 1) {
			setCurrentSession({
				...currentSession,
				currentQuestion: currentSession.currentQuestion + 1,
			});
		} else {
			// Test completed
			finishTest();
		}
	};

	const finishTest = useCallback(() => {
		if (!currentSession || !selectedTest) return;

		// Calculate results
		const correctAnswers = Object.entries(currentSession.answers).filter(
			([questionIndex, answerIndex]) => {
				const question = sampleQuestions[parseInt(questionIndex)];
				return question && question.correctAnswer === answerIndex;
			}
		).length;

		const score =
			(correctAnswers / selectedTest.totalQuestions) * selectedTest.maxScore;
		const timeTaken = Math.floor(
			(new Date().getTime() - currentSession.startTime.getTime()) / 1000 / 60
		);

		// In real implementation, save results to server
		console.log("Test completed:", {
			score,
			correctAnswers,
			timeTaken,
			totalQuestions: selectedTest.totalQuestions,
		});

		setIsTestMode(false);
		setShowResults(true);
		setCurrentSession(null);
	}, [currentSession, selectedTest, sampleQuestions]);

	// Timer effect
	useEffect(() => {
		if (!currentSession?.isActive) return;

		const timer = setInterval(() => {
			setCurrentSession((prev) => {
				if (!prev || prev.timeRemaining <= 1) {
					finishTest();
					return prev;
				}

				return {
					...prev,
					timeRemaining: prev.timeRemaining - 1,
				};
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [currentSession?.isActive, finishTest]);

	if (isTestMode && selectedTest && currentSession) {
		const currentQuestion = sampleQuestions[currentSession.currentQuestion];

		return (
			<div className="h-[calc(100vh-8rem)] bg-background flex flex-col">
				{/* Test Header */}
				<div className="bg-card border-b border-border p-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-semibold text-foreground">
								{selectedTest.title}
							</h2>
							<p className="text-sm text-muted-foreground">
								Question {currentSession.currentQuestion + 1} of{" "}
								{selectedTest.totalQuestions}
							</p>
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-lg">
								<Timer className="w-4 h-4 text-red-600" />
								<span className="text-red-600 font-mono font-medium">
									{formatTimeRemaining(currentSession.timeRemaining)}
								</span>
							</div>

							<Button variant="outline" onClick={finishTest}>
								Submit Test
							</Button>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="mt-4">
						<div className="w-full bg-muted rounded-full h-2">
							<div
								className="bg-blue-500 h-2 rounded-full transition-all duration-300"
								style={{
									width: `${
										((currentSession.currentQuestion + 1) /
											selectedTest.totalQuestions) *
										100
									}%`,
								}}
							/>
						</div>
					</div>
				</div>

				{/* Question Content */}
				<div className="flex-1 p-6">
					<div className="max-w-4xl mx-auto">
						<motion.div
							key={currentSession.currentQuestion}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-card border border-border rounded-lg p-6"
						>
							<h3 className="text-lg font-medium text-foreground mb-6">
								{currentQuestion?.question}
							</h3>

							<div className="space-y-3">
								{currentQuestion?.options.map((option, index) => (
									<motion.button
										key={index}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
										onClick={() =>
											submitAnswer(currentSession.currentQuestion, index)
										}
										className={`w-full text-left p-4 border rounded-lg transition-all ${
											currentSession.answers[currentSession.currentQuestion] ===
											index
												? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
												: "border-border hover:border-blue-300 hover:bg-muted/50"
										}`}
									>
										<div className="flex items-center space-x-3">
											<div
												className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
													currentSession.answers[
														currentSession.currentQuestion
													] === index
														? "border-blue-500 bg-blue-500"
														: "border-gray-300"
												}`}
											>
												{currentSession.answers[
													currentSession.currentQuestion
												] === index && (
													<div className="w-2 h-2 bg-white rounded-full" />
												)}
											</div>
											<span className="text-foreground">{option}</span>
										</div>
									</motion.button>
								))}
							</div>

							<div className="flex items-center justify-between mt-8">
								<Button
									variant="outline"
									onClick={() =>
										setCurrentSession({
											...currentSession,
											currentQuestion: Math.max(
												0,
												currentSession.currentQuestion - 1
											),
										})
									}
									disabled={currentSession.currentQuestion === 0}
								>
									Previous
								</Button>

								<div className="text-sm text-muted-foreground">
									Answered: {Object.keys(currentSession.answers).length} /{" "}
									{selectedTest.totalQuestions}
								</div>

								<Button
									onClick={nextQuestion}
									disabled={
										currentSession.answers[currentSession.currentQuestion] ===
										undefined
									}
								>
									{currentSession.currentQuestion ===
									selectedTest.totalQuestions - 1
										? "Finish"
										: "Next"}
									<ArrowRight className="w-4 h-4 ml-1" />
								</Button>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">MCQ Tests</h1>
					<p className="text-muted-foreground">
						Practice and test your knowledge with interactive quizzes
					</p>
				</div>

				<div className="flex items-center space-x-2">
					<Button variant="outline">
						<Brain className="w-4 h-4 mr-2" />
						Study Mode
					</Button>
					<Button variant="outline">
						<BarChart3 className="w-4 h-4 mr-2" />
						Analytics
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card border border-border rounded-lg p-6"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Tests Completed</p>
							<h3 className="text-2xl font-bold text-foreground">12</h3>
						</div>
						<Target className="w-8 h-8 text-blue-500" />
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-card border border-border rounded-lg p-6"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Average Score</p>
							<h3 className="text-2xl font-bold text-foreground">78%</h3>
						</div>
						<TrendingUp className="w-8 h-8 text-green-500" />
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-card border border-border rounded-lg p-6"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Best Rank</p>
							<h3 className="text-2xl font-bold text-foreground">#3</h3>
						</div>
						<Trophy className="w-8 h-8 text-yellow-500" />
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-card border border-border rounded-lg p-6"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Study Streak</p>
							<h3 className="text-2xl font-bold text-foreground">7 days</h3>
						</div>
						<Award className="w-8 h-8 text-purple-500" />
					</div>
				</motion.div>
			</div>

			{/* Tabs */}
			<div className="border-b border-border">
				<nav className="-mb-px flex space-x-8">
					{[
						{
							key: "available" as const,
							label: "Available Tests",
							count: tests.filter((t) => t.status === "active").length,
						},
						{
							key: "completed" as const,
							label: "Completed",
							count: testResults.length,
						},
						{
							key: "results" as const,
							label: "Results & Analytics",
							count: null,
						},
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
			{activeTab === "available" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tests
							.filter(
								(test) => test.status === "active" || test.status === "upcoming"
							)
							.map((test) => (
								<motion.div
									key={test.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
								>
									<div className="space-y-4">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-medium text-foreground">
													{test.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{test.subject} • {test.topic}
												</p>
											</div>
											<div
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													test.status
												)}`}
											>
												{test.status}
											</div>
										</div>

										<p className="text-sm text-muted-foreground">
											{test.description}
										</p>

										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center space-x-2">
												<BookOpen className="w-4 h-4 text-muted-foreground" />
												<span>{test.totalQuestions} Questions</span>
											</div>
											<div className="flex items-center space-x-2">
												<Clock className="w-4 h-4 text-muted-foreground" />
												<span>{formatTime(test.duration)}</span>
											</div>
											<div className="flex items-center space-x-2">
												<Trophy className="w-4 h-4 text-muted-foreground" />
												<span>{test.maxScore} Points</span>
											</div>
											<div
												className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getDifficultyColor(
													test.difficulty
												)}`}
											>
												<span>{test.difficulty}</span>
											</div>
										</div>

										<div className="text-xs text-muted-foreground">
											Attempts: {test.attempts}/{test.maxAttempts}
										</div>

										<Button
											className="w-full"
											onClick={() => startTest(test)}
											disabled={
												test.status !== "active" ||
												test.attempts >= test.maxAttempts
											}
										>
											{test.status === "upcoming" ? (
												<>
													<Calendar className="w-4 h-4 mr-2" />
													Starts {test.startDate}
												</>
											) : test.attempts >= test.maxAttempts ? (
												"Attempts Exhausted"
											) : (
												<>
													<Play className="w-4 h-4 mr-2" />
													Start Test
												</>
											)}
										</Button>
									</div>
								</motion.div>
							))}
					</div>
				</div>
			)}

			{activeTab === "completed" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tests
							.filter((test) => test.status === "completed")
							.map((test) => (
								<motion.div
									key={test.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-card border border-border rounded-lg p-6"
								>
									<div className="space-y-4">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-medium text-foreground">
													{test.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{test.subject}
												</p>
											</div>
											<CheckCircle className="w-5 h-5 text-green-500" />
										</div>

										<div className="text-sm text-muted-foreground">
											Completed on {test.endDate}
										</div>

										<Button variant="outline" className="w-full">
											<BarChart3 className="w-4 h-4 mr-2" />
											View Results
										</Button>
									</div>
								</motion.div>
							))}
					</div>
				</div>
			)}

			{activeTab === "results" && (
				<div className="space-y-6">
					<div className="bg-card border border-border rounded-lg p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							Performance Analytics
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-medium text-foreground mb-2">
									Recent Results
								</h3>
								<div className="space-y-3">
									{testResults.map((result) => {
										const test = tests.find((t) => t.id === result.testId);
										return (
											<div
												key={result.id}
												className="flex items-center justify-between p-3 bg-muted rounded-lg"
											>
												<div>
													<p className="font-medium text-foreground">
														{test?.title}
													</p>
													<p className="text-sm text-muted-foreground">
														{result.correctAnswers}/{result.totalQuestions}{" "}
														correct • Rank #{result.rank}
													</p>
												</div>
												<div className="text-right">
													<p className="font-bold text-foreground">
														{result.percentage}%
													</p>
													<p className="text-xs text-muted-foreground">
														{result.completedDate}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<div>
								<h3 className="font-medium text-foreground mb-2">
									Subject Performance
								</h3>
								<div className="space-y-3">
									{["Mathematics", "Physics", "English", "Chemistry"].map(
										(subject) => (
											<div key={subject} className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-foreground">{subject}</span>
													<span className="text-muted-foreground">75%</span>
												</div>
												<div className="w-full bg-muted rounded-full h-2">
													<div
														className="bg-blue-500 h-2 rounded-full"
														style={{ width: "75%" }}
													/>
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Results Modal */}
			{showResults && selectedTest && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-card border border-border rounded-lg max-w-md w-full p-6"
					>
						<div className="text-center space-y-4">
							<Trophy className="w-16 h-16 mx-auto text-yellow-500" />
							<h2 className="text-xl font-bold text-foreground">
								Test Completed!
							</h2>
							<p className="text-muted-foreground">{selectedTest.title}</p>

							<div className="bg-muted rounded-lg p-4">
								<div className="text-3xl font-bold text-foreground">85%</div>
								<div className="text-sm text-muted-foreground">Your Score</div>
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<div className="font-medium text-foreground">
										Correct Answers
									</div>
									<div className="text-muted-foreground">8/10</div>
								</div>
								<div>
									<div className="font-medium text-foreground">Time Taken</div>
									<div className="text-muted-foreground">12 minutes</div>
								</div>
							</div>

							<div className="flex space-x-3">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => setShowResults(false)}
								>
									Close
								</Button>
								<Button className="flex-1">
									<RefreshCw className="w-4 h-4 mr-2" />
									Retake Test
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
