"use client";

import React from "react";
import { Camera, Video, Newspaper, Calendar } from "lucide-react";

export default function MediaCoordinatorPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold mb-2">
							Media Coordinator Dashboard
						</h1>
						<p className="opacity-90">
							Manage media content, events, and communications
						</p>
					</div>
					<div className="hidden md:flex space-x-4">
						<div className="text-center">
							<div className="text-2xl font-bold">156</div>
							<div className="text-sm opacity-80">Media Items</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">42</div>
							<div className="text-sm opacity-80">Events</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">Photos</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								89
							</p>
						</div>
						<div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
							<Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">Videos</p>
							<p className="text-2xl font-bold text-purple-600">67</p>
						</div>
						<div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
							<Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								News Articles
							</p>
							<p className="text-2xl font-bold text-green-600">23</p>
						</div>
						<div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
							<Newspaper className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 dark:text-gray-400 text-sm">Events</p>
							<p className="text-2xl font-bold text-orange-600">42</p>
						</div>
						<div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
							<Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
					</div>
				</div>
			</div>

			{/* Coming Soon Message */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border text-center">
				<div className="max-w-md mx-auto">
					<div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Camera className="h-8 w-8 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Media Management Coming Soon
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						We&apos;re building a powerful media management system. This feature
						will be available once we integrate with our backend services.
					</p>
					<div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg inline-block">
						Frontend Ready ✨
					</div>
				</div>
			</div>
		</div>
	);
}
