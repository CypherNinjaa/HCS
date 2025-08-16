"use client";

import { motion } from "framer-motion";
import { Edit3, Globe, Image, FileText } from "lucide-react";

export function ContentManagement() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
					Content Management
				</h1>
				<p className="text-muted-foreground">
					Inline website content editing and management
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Pages",
						value: "24",
						icon: FileText,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Media Files",
						value: "156",
						icon: Image,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Languages",
						value: "3",
						icon: Globe,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Last Updated",
						value: "2h ago",
						icon: Edit3,
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
					Content Management Features
				</h2>
				<ul className="space-y-2 text-sm text-muted-foreground">
					<li>• Inline editing of website content</li>
					<li>• Rich text editor with media support</li>
					<li>• Multi-language content management</li>
					<li>• SEO optimization tools</li>
					<li>• Content versioning and rollback</li>
					<li>• Scheduled content publishing</li>
				</ul>
			</motion.div>
		</div>
	);
}
