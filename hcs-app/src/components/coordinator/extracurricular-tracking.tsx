"use client";

import { motion } from "framer-motion";
import { Activity, Trophy } from "lucide-react";

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

interface ExtracurricularTrackingProps {
	coordinatorData: CoordinatorData;
}

export function ExtracurricularTracking({}: ExtracurricularTrackingProps) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<Activity className="h-7 w-7" />
					Extracurricular Tracking
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Track student participation in activities and events
				</p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
			>
				<Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Extracurricular Activities Management
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Monitor student participation in sports, clubs, competitions, and
					other extracurricular activities.
				</p>
				<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
					<p className="text-sm text-yellow-800 dark:text-yellow-400">
						Feature under development - Will include activity enrollment,
						participation tracking, and achievement records.
					</p>
				</div>
			</motion.div>
		</div>
	);
}
