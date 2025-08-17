"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Users, CheckCircle, Plus } from "lucide-react";

export function ExamManagement() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Exam Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage examinations, schedules, and results
					</p>
				</div>
				<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
					<Plus className="h-4 w-4" />
					Schedule Exam
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Exams",
						value: "24",
						icon: FileText,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Scheduled",
						value: "8",
						icon: Calendar,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Students Enrolled",
						value: "1,847",
						icon: Users,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Completed",
						value: "16",
						icon: CheckCircle,
						color: "from-orange-500 to-red-500",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{stat.value}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{stat.title}
									</p>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					Examination System Features
				</h2>
				<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
					<li>• Exam schedule creation and management</li>
					<li>• Question paper upload and distribution</li>
					<li>• Online examination portal</li>
					<li>• Automated grading and result generation</li>
					<li>• Performance analytics and insights</li>
					<li>• Parent/student result notifications</li>
				</ul>
			</motion.div>
		</div>
	);
}
