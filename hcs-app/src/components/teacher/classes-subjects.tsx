"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Users,
	Calendar,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeacherData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	subjects: string[];
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface ClassesSubjectsProps {
	teacherData: TeacherData;
}

export function ClassesSubjects({ teacherData }: ClassesSubjectsProps) {
	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Classes & Subjects 📚
						</h1>
						<p className="text-green-100">
							Manage your assigned classes and subjects
						</p>
					</div>
					<div className="hidden md:flex items-center space-x-6">
						<div className="text-center">
							<div className="text-2xl font-bold">
								{teacherData.classes.length}
							</div>
							<div className="text-sm text-green-100">Classes</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{teacherData.subjects.length}
							</div>
							<div className="text-sm text-green-100">Subjects</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Classes Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				{teacherData.classes.map((classItem, index) => (
					<motion.div
						key={classItem.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						whileHover={{ scale: 1.02 }}
					>
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
										<BookOpen className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											{classItem.name}-{classItem.section}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{classItem.students} students
										</p>
									</div>
								</div>
								<span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded">
									Active
								</span>
							</div>

							<div className="space-y-3 mb-4">
								<div>
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Subjects Teaching:
									</p>
									<div className="flex flex-wrap gap-2">
										{classItem.subjects.map((subject) => (
											<span
												key={subject}
												className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded"
											>
												{subject}
											</span>
										))}
									</div>
								</div>
							</div>

							<div className="flex space-x-2">
								<Button size="sm" className="flex-1">
									<Users className="w-4 h-4 mr-2" />
									View Students
								</Button>
								<Button variant="outline" size="sm" className="flex-1">
									<Calendar className="w-4 h-4 mr-2" />
									Schedule
								</Button>
							</div>
						</Card>
					</motion.div>
				))}
			</motion.div>

			{/* Subject Performance Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
						Subject Overview
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{teacherData.subjects.map((subject) => (
							<div key={subject} className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										{subject}
									</h3>
									<span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded">
										Active
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Classes Teaching
										</span>
										<span className="font-medium text-gray-900 dark:text-white">
											{
												teacherData.classes.filter((c) =>
													c.subjects.includes(subject)
												).length
											}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Total Students
										</span>
										<span className="font-medium text-gray-900 dark:text-white">
											{teacherData.classes
												.filter((c) => c.subjects.includes(subject))
												.reduce((acc, c) => acc + c.students, 0)}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Avg. Performance
										</span>
										<span className="font-medium text-green-600 dark:text-green-400">
											85.2%
										</span>
									</div>
								</div>
								<div className="flex space-x-2">
									<Button size="sm" variant="outline" className="flex-1">
										<CheckCircle className="w-4 h-4 mr-1" />
										Mark Attendance
									</Button>
									<Button size="sm" variant="outline" className="flex-1">
										<AlertCircle className="w-4 h-4 mr-1" />
										Assignments
									</Button>
								</div>
							</div>
						))}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
