import React from "react";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";

export function StudentManagement() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">Student Management</h1>
						<p className="opacity-90">
							Manage students, enrollment, and academic records
						</p>
					</div>
					<div className="hidden md:flex space-x-4">
						<div className="text-center">
							<div className="text-2xl font-bold">1,247</div>
							<div className="text-sm opacity-80">Total Students</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">1,198</div>
							<div className="text-sm opacity-80">Active</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Total Students
							</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								1,247
							</p>
						</div>
						<div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
							<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Active Students
							</p>
							<p className="text-2xl font-bold text-green-600">1,198</p>
						</div>
						<div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
							<UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Inactive
							</p>
							<p className="text-2xl font-bold text-orange-600">49</p>
						</div>
						<div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
							<UserX className="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Classes
							</p>
							<p className="text-2xl font-bold text-purple-600">42</p>
						</div>
						<div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
							<GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
					</div>
				</div>
			</div>

			{/* Coming Soon Message */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border text-center">
				<div className="max-w-md mx-auto">
					<div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Users className="h-8 w-8 text-green-600 dark:text-green-400" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Student Management Coming Soon
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						We&apos;re building a comprehensive student management system. This
						feature will be available once we integrate with our backend
						services.
					</p>
					<div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg inline-block">
						Frontend Ready ✨
					</div>
				</div>
			</div>
		</div>
	);
}
