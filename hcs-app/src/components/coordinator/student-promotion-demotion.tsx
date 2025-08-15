"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	TrendingUp,
	TrendingDown,
	Users,
	AlertTriangle,
	CheckCircle,
	Search,
} from "lucide-react";

interface CoordinatorData {
	managedClasses: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		classTeacher: string;
		subjects: string[];
	}>;
}

interface StudentPromotionDemotionProps {
	coordinatorData: CoordinatorData;
}

export function StudentPromotionDemotion({
	coordinatorData,
}: StudentPromotionDemotionProps) {
	const [selectedClass, setSelectedClass] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [actionType, setActionType] = useState<
		"promotion" | "demotion" | "retention"
	>("promotion");

	const [students] = useState([
		{
			id: "std-001",
			name: "Aarav Sharma",
			rollNumber: "8A001",
			currentClass: "VIII",
			currentSection: "A",
			performance: 85,
			attendance: 92,
			recommendedAction: "promotion",
			targetClass: "IX",
			targetSection: "A",
		},
		{
			id: "std-002",
			name: "Priya Patel",
			rollNumber: "8A002",
			currentClass: "VIII",
			currentSection: "A",
			performance: 92,
			attendance: 95,
			recommendedAction: "promotion",
			targetClass: "IX",
			targetSection: "A",
		},
		{
			id: "std-003",
			name: "Rahul Kumar",
			rollNumber: "9A001",
			currentClass: "IX",
			currentSection: "A",
			performance: 45,
			attendance: 65,
			recommendedAction: "retention",
			targetClass: "IX",
			targetSection: "A",
		},
	]);

	const filteredStudents = students.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesClass =
			selectedClass === "all" ||
			`${student.currentClass}-${student.currentSection}` === selectedClass;
		const matchesAction = student.recommendedAction === actionType;

		return matchesSearch && matchesClass && matchesAction;
	});

	const getActionIcon = (action: string) => {
		switch (action) {
			case "promotion":
				return <TrendingUp className="h-5 w-5 text-green-600" />;
			case "demotion":
				return <TrendingDown className="h-5 w-5 text-red-600" />;
			case "retention":
				return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
			default:
				return <CheckCircle className="h-5 w-5 text-blue-600" />;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Student Promotion & Demotion
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage student academic transitions
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Search Students
						</label>
						<div className="relative">
							<Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search by name or roll number..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Filter by Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="all">All Classes</option>
							{coordinatorData.managedClasses.map((cls) => (
								<option
									key={cls.id}
									value={`${cls.name.split(" ")[1]}-${cls.section}`}
								>
									{cls.name} - {cls.section}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Action Type
						</label>
						<select
							value={actionType}
							onChange={(e) =>
								setActionType(
									e.target.value as "promotion" | "demotion" | "retention"
								)
							}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="promotion">Promotion</option>
							<option value="demotion">Demotion</option>
							<option value="retention">Retention</option>
						</select>
					</div>
				</div>
			</div>

			{/* Students List */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Users className="h-5 w-5" />
						{actionType.charAt(0).toUpperCase() + actionType.slice(1)}{" "}
						Candidates ({filteredStudents.length})
					</h2>
				</div>

				{filteredStudents.length > 0 ? (
					<div className="divide-y divide-gray-200 dark:divide-gray-700">
						{filteredStudents.map((student, index) => (
							<motion.div
								key={student.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
											<span className="text-white font-semibold">
												{student.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</span>
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{student.name}
											</h3>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{student.currentClass} - {student.currentSection} •
												Roll: {student.rollNumber}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										{getActionIcon(student.recommendedAction)}
										<div className="text-right">
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												Performance: {student.performance}%
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Attendance: {student.attendance}%
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4 flex justify-between items-center">
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{actionType === "promotion" &&
											`Promoting to ${student.targetClass} - ${student.targetSection}`}
										{actionType === "demotion" && `Demoting to previous class`}
										{actionType === "retention" &&
											`Retaining in ${student.currentClass} - ${student.currentSection}`}
									</div>
									<div className="flex gap-2">
										<button className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
											Approve
										</button>
										<button className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
											Reject
										</button>
										<button className="px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
											Review
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No {actionType} candidates found
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							Try adjusting your search or filter criteria.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
