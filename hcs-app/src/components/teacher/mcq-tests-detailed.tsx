"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Clock, Users, Brain, Edit, Play, BarChart3 } from "lucide-react";

interface Question {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	difficulty: "easy" | "medium" | "hard";
	subject: string;
}

interface MCQTest {
	id: string;
	title: string;
	description: string;
	subject: string;
	className: string;
	duration: number; // in minutes
	questions: Question[];
	isActive: boolean;
	createdAt: string;
	attempts: number;
	avgScore: number;
}

interface TeacherData {
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface MCQTestsDetailedProps {
	teacherData: TeacherData;
}

const MCQTestsDetailed: React.FC<MCQTestsDetailedProps> = ({ teacherData }) => {
	const [tests, setTests] = useState<MCQTest[]>([
		{
			id: "1",
			title: "Mathematics Quiz - Algebra Basics",
			description: "Test your understanding of basic algebraic concepts",
			subject: "Mathematics",
			className: "Class X - A",
			duration: 30,
			questions: [],
			isActive: true,
			createdAt: "2024-12-10",
			attempts: 28,
			avgScore: 78,
		},
		{
			id: "2",
			title: "Science Quick Test - Chemical Reactions",
			description: "Quick assessment on chemical reactions and equations",
			subject: "Science",
			className: "Class IX - B",
			duration: 20,
			questions: [],
			isActive: false,
			createdAt: "2024-12-08",
			attempts: 22,
			avgScore: 82,
		},
	]);

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [currentTest, setCurrentTest] = useState<Partial<MCQTest>>({
		title: "",
		description: "",
		subject: "",
		className: "",
		duration: 30,
		questions: [],
	});
	const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
		question: "",
		options: ["", "", "", ""],
		correctAnswer: 0,
		difficulty: "medium",
		subject: "",
	});
	const [showQuestionForm, setShowQuestionForm] = useState(false);

	const handleCreateTest = () => {
		if (currentTest.title && currentTest.className && currentTest.subject) {
			const newTest: MCQTest = {
				id: Date.now().toString(),
				title: currentTest.title || "",
				description: currentTest.description || "",
				subject: currentTest.subject || "",
				className: currentTest.className || "",
				duration: currentTest.duration || 30,
				questions: currentTest.questions || [],
				isActive: false,
				createdAt: new Date().toISOString().split("T")[0],
				attempts: 0,
				avgScore: 0,
			};

			setTests((prev) => [newTest, ...prev]);
			setCurrentTest({
				title: "",
				description: "",
				subject: "",
				className: "",
				duration: 30,
				questions: [],
			});
			setShowCreateForm(false);
		}
	};

	const handleAddQuestion = () => {
		if (
			currentQuestion.question &&
			currentQuestion.options?.every((opt) => opt.trim())
		) {
			const newQuestion: Question = {
				id: Date.now().toString(),
				question: currentQuestion.question || "",
				options: currentQuestion.options || ["", "", "", ""],
				correctAnswer: currentQuestion.correctAnswer || 0,
				difficulty: currentQuestion.difficulty || "medium",
				subject: currentQuestion.subject || "",
			};

			setCurrentTest((prev) => ({
				...prev,
				questions: [...(prev.questions || []), newQuestion],
			}));

			setCurrentQuestion({
				question: "",
				options: ["", "", "", ""],
				correctAnswer: 0,
				difficulty: "medium",
				subject: "",
			});
			setShowQuestionForm(false);
		}
	};

	const toggleTestStatus = (testId: string) => {
		setTests((prev) =>
			prev.map((test) =>
				test.id === testId ? { ...test, isActive: !test.isActive } : test
			)
		);
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
			case "medium":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
			case "hard":
				return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						MCQ Test Creator
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Create and manage timed MCQ tests for your students
					</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
				>
					<Plus className="w-4 h-4" />
					Create New Test
				</button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
					<div className="flex items-center gap-3">
						<Brain className="w-8 h-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Tests
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{tests.length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
					<div className="flex items-center gap-3">
						<Play className="w-8 h-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Active Tests
							</p>
							<p className="text-2xl font-bold text-green-600">
								{tests.filter((t) => t.isActive).length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
					<div className="flex items-center gap-3">
						<Users className="w-8 h-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Attempts
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{tests.reduce((acc, test) => acc + test.attempts, 0)}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
					<div className="flex items-center gap-3">
						<BarChart3 className="w-8 h-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Avg Score
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{Math.round(
									tests.reduce((acc, test) => acc + test.avgScore, 0) /
										tests.length
								) || 0}
								%
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Create Test Form */}
			{showCreateForm && (
				<Card className="p-6 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Create New MCQ Test
						</h3>
						<button
							onClick={() => setShowCreateForm(false)}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							×
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Test Title
							</label>
							<input
								type="text"
								value={currentTest.title}
								onChange={(e) =>
									setCurrentTest((prev) => ({ ...prev, title: e.target.value }))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
								placeholder="Enter test title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Duration (minutes)
							</label>
							<input
								type="number"
								min="5"
								max="180"
								value={currentTest.duration}
								onChange={(e) =>
									setCurrentTest((prev) => ({
										...prev,
										duration: parseInt(e.target.value),
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Class
							</label>
							<select
								value={currentTest.className}
								onChange={(e) =>
									setCurrentTest((prev) => ({
										...prev,
										className: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Class</option>
								{teacherData.classes.map((cls) => (
									<option key={cls.id} value={`${cls.name} - ${cls.section}`}>
										{cls.name} - {cls.section}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Subject
							</label>
							<select
								value={currentTest.subject}
								onChange={(e) =>
									setCurrentTest((prev) => ({
										...prev,
										subject: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Subject</option>
								{currentTest.className &&
									teacherData.classes
										.find(
											(c) =>
												`${c.name} - ${c.section}` === currentTest.className
										)
										?.subjects.map((subject) => (
											<option key={subject} value={subject}>
												{subject}
											</option>
										))}
							</select>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description
						</label>
						<textarea
							value={currentTest.description}
							onChange={(e) =>
								setCurrentTest((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							rows={3}
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							placeholder="Enter test description"
						/>
					</div>

					{/* Questions Section */}
					<div className="mb-4">
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Questions ({currentTest.questions?.length || 0})
							</label>
							<button
								onClick={() => setShowQuestionForm(true)}
								className="flex items-center gap-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800"
							>
								<Plus className="w-3 h-3" />
								Add Question
							</button>
						</div>

						{currentTest.questions && currentTest.questions.length > 0 && (
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{currentTest.questions.map((q, index) => (
									<div
										key={q.id}
										className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
									>
										<span className="text-sm truncate flex-1">
											{index + 1}. {q.question}
										</span>
										<span
											className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
												q.difficulty
											)}`}
										>
											{q.difficulty}
										</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Question Form */}
					{showQuestionForm && (
						<Card className="p-4 bg-gray-50 dark:bg-gray-700 mb-4">
							<div className="flex items-center justify-between mb-3">
								<h4 className="font-medium text-gray-900 dark:text-white">
									Add Question
								</h4>
								<button
									onClick={() => setShowQuestionForm(false)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									×
								</button>
							</div>

							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Question
									</label>
									<textarea
										value={currentQuestion.question}
										onChange={(e) =>
											setCurrentQuestion((prev) => ({
												...prev,
												question: e.target.value,
											}))
										}
										rows={2}
										className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500"
										placeholder="Enter your question"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{currentQuestion.options?.map((option, index) => (
										<div key={index}>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
												Option {index + 1}{" "}
												{currentQuestion.correctAnswer === index && "(Correct)"}
											</label>
											<input
												type="text"
												value={option}
												onChange={(e) => {
													const newOptions = [
														...(currentQuestion.options || []),
													];
													newOptions[index] = e.target.value;
													setCurrentQuestion((prev) => ({
														...prev,
														options: newOptions,
													}));
												}}
												className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500"
												placeholder={`Option ${index + 1}`}
											/>
										</div>
									))}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											Correct Answer
										</label>
										<select
											value={currentQuestion.correctAnswer}
											onChange={(e) =>
												setCurrentQuestion((prev) => ({
													...prev,
													correctAnswer: parseInt(e.target.value),
												}))
											}
											className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500"
										>
											{currentQuestion.options?.map((_, index) => (
												<option key={index} value={index}>
													Option {index + 1}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											Difficulty
										</label>
										<select
											value={currentQuestion.difficulty}
											onChange={(e) =>
												setCurrentQuestion((prev) => ({
													...prev,
													difficulty: e.target.value as
														| "easy"
														| "medium"
														| "hard",
												}))
											}
											className="w-full p-2 border rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500"
										>
											<option value="easy">Easy</option>
											<option value="medium">Medium</option>
											<option value="hard">Hard</option>
										</select>
									</div>
								</div>

								<button
									onClick={handleAddQuestion}
									className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
								>
									Add Question
								</button>
							</div>
						</Card>
					)}

					<div className="flex gap-3">
						<button
							onClick={handleCreateTest}
							className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
						>
							Create Test
						</button>
						<button
							onClick={() => setShowCreateForm(false)}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</Card>
			)}

			{/* Tests List */}
			<div className="space-y-4">
				{tests.map((test) => (
					<Card
						key={test.id}
						className="p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200"
					>
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-start gap-3">
									<Brain className="w-5 h-5 text-purple-600 mt-1" />
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{test.title}
											</h3>
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													test.isActive
														? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
														: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
												}`}
											>
												{test.isActive ? "Active" : "Inactive"}
											</span>
										</div>
										<p className="text-gray-600 dark:text-gray-400 mt-1">
											{test.description}
										</p>
										<div className="flex flex-wrap gap-4 mt-3 text-sm">
											<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
												<Users className="w-4 h-4" />
												{test.className} - {test.subject}
											</span>
											<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
												<Clock className="w-4 h-4" />
												{test.duration} minutes
											</span>
											<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
												<Brain className="w-4 h-4" />
												{test.questions.length} questions
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col lg:items-end gap-3">
								<div className="text-right">
									<p className="text-lg font-bold text-purple-600">
										{test.attempts} attempts
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										Avg: {test.avgScore}% score
									</p>
								</div>

								<div className="flex gap-2">
									<button
										onClick={() => toggleTestStatus(test.id)}
										className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
											test.isActive
												? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
												: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
										}`}
									>
										<Play className="w-3 h-3" />
										{test.isActive ? "Stop" : "Start"}
									</button>
									<button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
										<BarChart3 className="w-3 h-3" />
										Analytics
									</button>
									<button className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
										<Edit className="w-3 h-3" />
										Edit
									</button>
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default MCQTestsDetailed;
