"use client";

import { motion } from "framer-motion";
import { MapPin, Bus, Route, Users, Plus } from "lucide-react";

export function TransportRoutes() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Transport Route Management
					</h1>
					<p className="text-muted-foreground">
						Visual route planning and transport management
					</p>
				</div>
				<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-200">
					<Plus className="h-4 w-4" />
					Add Route
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Routes",
						value: "12",
						icon: Route,
						color: "from-teal-500 to-cyan-500",
					},
					{
						title: "Active Buses",
						value: "11",
						icon: Bus,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Students Using",
						value: "823",
						icon: Users,
						color: "from-blue-500 to-purple-500",
					},
					{
						title: "Coverage Areas",
						value: "8",
						icon: MapPin,
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
									<p className="text-sm text-muted-foreground">
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
				className="bg-card rounded-xl p-6 border border-border"
			>
				<h2 className="text-lg font-semibold text-foreground mb-4">
					Visual Route Planner
				</h2>
				<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
					<p className="text-muted-foreground">
						Interactive route map will be displayed here
					</p>
				</div>
			</motion.div>
		</div>
	);
}
