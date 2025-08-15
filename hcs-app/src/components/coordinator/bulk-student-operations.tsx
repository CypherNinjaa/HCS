"use client";

import { motion } from "framer-motion";
import { Users, Download, Upload, CheckCircle } from "lucide-react";

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

interface BulkStudentOperationsProps {
	coordinatorData: CoordinatorData;
}

export function BulkStudentOperations({}: BulkStudentOperationsProps) {
	const operations = [
		{
			title: "Bulk Student Import",
			description: "Import multiple students from CSV/Excel file",
			icon: Upload,
			color: "from-blue-500 to-blue-600",
			action: "import",
		},
		{
			title: "Bulk Student Export",
			description: "Export student data to CSV/Excel format",
			icon: Download,
			color: "from-green-500 to-green-600",
			action: "export",
		},
		{
			title: "Bulk Class Assignment",
			description: "Assign multiple students to classes",
			icon: Users,
			color: "from-purple-500 to-purple-600",
			action: "assign",
		},
		{
			title: "Bulk Status Update",
			description: "Update status for multiple students",
			icon: CheckCircle,
			color: "from-orange-500 to-orange-600",
			action: "status",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Bulk Student Operations
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Perform mass operations on student data
				</p>
			</div>

			{/* Operations Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{operations.map((operation, index) => {
					const Icon = operation.icon;
					return (
						<motion.div
							key={operation.action}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 cursor-pointer"
						>
							<div className="flex items-center gap-4 mb-4">
								<div
									className={`w-12 h-12 bg-gradient-to-r ${operation.color} rounded-lg flex items-center justify-center`}
								>
									<Icon className="h-6 w-6 text-white" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{operation.title}
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{operation.description}
									</p>
								</div>
							</div>
							<button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
								Start Operation
							</button>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
