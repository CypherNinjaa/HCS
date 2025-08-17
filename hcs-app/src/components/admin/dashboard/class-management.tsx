"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Users, Clock, Plus } from "lucide-react";

export function ClassManagement() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Class Management
					</h1>
					<p className="text-muted-foreground">
						Manage academic classes, schedules, and assignments
					</p>
				</div>
				<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
					<Plus className="h-4 w-4" />
					Create Class
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Classes",
						value: "45",
						icon: BookOpen,
						color: "from-indigo-500 to-purple-500",
					},
					{
						title: "Active Sessions",
						value: "28",
						icon: Users,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Scheduled Today",
						value: "12",
						icon: Calendar,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Avg. Duration",
						value: "45min",
						icon: Clock,
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
							className="bg-card rounded-xl p-6 border border-border"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-foreground">
										{stat.value}
									</p>
									<p className="text-sm text-muted-foreground">{stat.title}</p>
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
				className="bg-card rounded-xl p-6 border border-border"
			>
				<h2 className="text-lg font-semibold text-foreground mb-4">
					Class Schedule Overview
				</h2>
				<p className="text-muted-foreground">
					Comprehensive class management features will be implemented here,
					including:
				</p>
				<ul className="mt-4 space-y-2 text-sm text-muted-foreground">
					<li>• Class timetable creation and management</li>
					<li>• Subject assignment to classes</li>
					<li>• Teacher allocation</li>
					<li>• Room/facility booking</li>
					<li>• Schedule conflicts detection</li>
					<li>• Automated notifications</li>
				</ul>
			</motion.div>
		</div>
	);
}
