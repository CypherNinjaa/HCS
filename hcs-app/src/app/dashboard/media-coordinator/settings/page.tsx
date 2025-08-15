"use client";

import { motion } from "framer-motion";
import {
	Settings,
	Upload,
	Workflow,
	Save,
	RotateCcw,
	CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="bg-card border-b border-border p-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
						<Settings className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-foreground">Settings</h1>
						<p className="text-muted-foreground">
							Configure media management preferences and system settings
						</p>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-6 space-y-8">
				{/* Media Upload Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card rounded-xl border border-border p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
							<Upload className="h-5 w-5 text-blue-500" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">
								Upload Settings
							</h3>
							<p className="text-sm text-muted-foreground">
								Configure file upload limits and restrictions
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Maximum Image Size (MB)
								</label>
								<input
									type="number"
									defaultValue="10"
									className="w-full px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Maximum Video Size (GB)
								</label>
								<input
									type="number"
									defaultValue="1"
									className="w-full px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Allowed Image Formats
								</label>
								<input
									type="text"
									defaultValue="jpg, jpeg, png, webp, gif"
									className="w-full px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Allowed Video Formats
								</label>
								<input
									type="text"
									defaultValue="mp4, webm, mov, avi"
									className="w-full px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Content Approval Workflow */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-card rounded-xl border border-border p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
							<Workflow className="h-5 w-5 text-purple-500" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">
								Approval Workflow
							</h3>
							<p className="text-sm text-muted-foreground">
								Configure content approval and moderation settings
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
							<div>
								<p className="font-medium text-foreground">
									Auto-approve teacher uploads
								</p>
								<p className="text-sm text-muted-foreground">
									Automatically approve content uploaded by teachers
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									defaultChecked
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
							<div>
								<p className="font-medium text-foreground">
									Require admin approval for news
								</p>
								<p className="text-sm text-muted-foreground">
									News articles require admin approval before publishing
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									defaultChecked
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
							<div>
								<p className="font-medium text-foreground">
									Enable comment moderation
								</p>
								<p className="text-sm text-muted-foreground">
									Moderate comments before they appear publicly
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									defaultChecked
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>
					</div>
				</motion.div>

				{/* Quality & Compression Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-card rounded-xl border border-border p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
							<Settings className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">
								Quality Settings
							</h3>
							<p className="text-sm text-muted-foreground">
								Configure automatic image and video compression
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Image Quality (%)
								</label>
								<input
									type="range"
									min="10"
									max="100"
									defaultValue="85"
									className="w-full"
								/>
								<div className="flex justify-between text-xs text-muted-foreground mt-1">
									<span>Low</span>
									<span>85%</span>
									<span>High</span>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Video Quality
								</label>
								<select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
									<option value="720p">720p (HD)</option>
									<option value="1080p" selected>
										1080p (Full HD)
									</option>
									<option value="1440p">1440p (2K)</option>
									<option value="2160p">2160p (4K)</option>
								</select>
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Thumbnail Generation
								</label>
								<select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
									<option value="auto" selected>
										Auto-generate
									</option>
									<option value="manual">Manual upload only</option>
									<option value="both">Both options</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Progressive JPEG
								</label>
								<select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
									<option value="enabled" selected>
										Enabled
									</option>
									<option value="disabled">Disabled</option>
								</select>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex items-center gap-4"
				>
					<button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
						<Save className="h-4 w-4" />
						Save Settings
					</button>
					<button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-200 flex items-center gap-2">
						<RotateCcw className="h-4 w-4" />
						Reset to Defaults
					</button>
				</motion.div>

				{/* Status Alert */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
				>
					<div className="flex items-center gap-3">
						<CheckCircle className="h-5 w-5 text-green-500" />
						<div>
							<p className="font-medium text-green-800 dark:text-green-200">
								Settings Saved Successfully
							</p>
							<p className="text-sm text-green-600 dark:text-green-300">
								All changes have been applied and are now active.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
