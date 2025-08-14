"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	MapPin,
	User,
	ChevronLeft,
	ChevronRight,
	Video,
	BookOpen,
	Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ClassSchedule() {
	const [viewMode, setViewMode] = useState<"day" | "week">("week");

	const subjects = [
		{ name: "Mathematics", color: "bg-blue-500", textColor: "text-blue-600" },
		{ name: "Physics", color: "bg-purple-500", textColor: "text-purple-600" },
		{ name: "Chemistry", color: "bg-green-500", textColor: "text-green-600" },
		{ name: "English", color: "bg-orange-500", textColor: "text-orange-600" },
		{ name: "History", color: "bg-red-500", textColor: "text-red-600" },
		{ name: "Geography", color: "bg-cyan-500", textColor: "text-cyan-600" },
		{ name: "Biology", color: "bg-emerald-500", textColor: "text-emerald-600" },
		{
			name: "Computer Science",
			color: "bg-indigo-500",
			textColor: "text-indigo-600",
		},
	];

	const weekSchedule = [
		{
			day: "Monday",
			date: "2024-08-14",
			classes: [
				{
					time: "9:00 AM - 9:45 AM",
					subject: "Mathematics",
					teacher: "Mr. Smith",
					room: "Room 101",
					type: "regular",
					color: "bg-blue-500",
				},
				{
					time: "9:45 AM - 10:30 AM",
					subject: "Physics",
					teacher: "Dr. Johnson",
					room: "Lab 1",
					type: "lab",
					color: "bg-purple-500",
				},
				{
					time: "11:00 AM - 11:45 AM",
					subject: "English",
					teacher: "Ms. Davis",
					room: "Room 203",
					type: "regular",
					color: "bg-orange-500",
				},
				{
					time: "11:45 AM - 12:30 PM",
					subject: "Chemistry",
					teacher: "Dr. Wilson",
					room: "Lab 2",
					type: "lab",
					color: "bg-green-500",
				},
				{
					time: "2:00 PM - 2:45 PM",
					subject: "History",
					teacher: "Mr. Brown",
					room: "Room 105",
					type: "regular",
					color: "bg-red-500",
				},
			],
		},
		{
			day: "Tuesday",
			date: "2024-08-15",
			classes: [
				{
					time: "9:00 AM - 9:45 AM",
					subject: "Physics",
					teacher: "Dr. Johnson",
					room: "Room 201",
					type: "regular",
					color: "bg-purple-500",
				},
				{
					time: "9:45 AM - 10:30 AM",
					subject: "Mathematics",
					teacher: "Mr. Smith",
					room: "Room 101",
					type: "regular",
					color: "bg-blue-500",
				},
				{
					time: "11:00 AM - 11:45 AM",
					subject: "Biology",
					teacher: "Dr. Green",
					room: "Lab 3",
					type: "lab",
					color: "bg-emerald-500",
				},
				{
					time: "11:45 AM - 12:30 PM",
					subject: "Computer Science",
					teacher: "Mr. Tech",
					room: "Computer Lab",
					type: "practical",
					color: "bg-indigo-500",
				},
				{
					time: "2:00 PM - 2:45 PM",
					subject: "Geography",
					teacher: "Ms. World",
					room: "Room 301",
					type: "regular",
					color: "bg-cyan-500",
				},
			],
		},
		// Add more days as needed
	];

	const todaySchedule = weekSchedule[0].classes; // Today's classes

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col md:flex-row md:items-center justify-between"
			>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
						Class Schedule
					</h1>
					<p className="text-muted-foreground">
						Your daily and weekly class timetable
					</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<Button
						variant={viewMode === "day" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("day")}
					>
						Day View
					</Button>
					<Button
						variant={viewMode === "week" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("week")}
					>
						Week View
					</Button>
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
				</div>
			</motion.div>

			{/* Today's Schedule - Quick Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
				<Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-950/20 dark:to-purple-950/20 border-border">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-foreground">
							Today&apos;s Classes
						</h2>
						<div className="flex items-center text-sm text-muted-foreground">
							<Calendar className="w-4 h-4 mr-2" />
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{todaySchedule.map((classItem, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
							>
								<div className="flex items-center space-x-3 mb-3">
									<div className={`w-3 h-12 ${classItem.color} rounded-full`} />
									<div className="flex-1">
										<h3 className="font-semibold text-gray-900 dark:text-white">
											{classItem.subject}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											{classItem.time}
										</p>
									</div>
									{classItem.type === "practical" && (
										<Video className="w-4 h-4 text-blue-500" />
									)}
									{classItem.type === "lab" && (
										<BookOpen className="w-4 h-4 text-green-500" />
									)}
								</div>
								<div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
									<div className="flex items-center">
										<User className="w-3 h-3 mr-2" />
										{classItem.teacher}
									</div>
									<div className="flex items-center">
										<MapPin className="w-3 h-3 mr-2" />
										{classItem.room}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</Card>
			</motion.div>

			{/* Weekly Schedule */}
			{viewMode === "week" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Card className="p-6 bg-card border-border">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-foreground">
								Weekly Schedule
							</h2>
							<div className="flex items-center space-x-2">
								<Button variant="outline" size="sm">
									<ChevronLeft className="w-4 h-4" />
								</Button>
								<span className="text-sm font-medium text-foreground px-3">
									Week of Aug 14, 2024
								</span>
								<Button variant="outline" size="sm">
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{weekSchedule.map((day, dayIndex) => (
								<div key={dayIndex} className="space-y-3">
									<h3 className="font-semibold text-foreground text-lg mb-4">
										{day.day}
									</h3>
									<div className="space-y-3">
										{day.classes.map((classItem, classIndex) => (
											<div
												key={classIndex}
												className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
											>
												<div
													className={`w-2 h-16 ${classItem.color} rounded-full`}
												/>
												<div className="flex-1">
													<div className="flex items-center justify-between mb-1">
														<h4 className="font-medium text-foreground">
															{classItem.subject}
														</h4>
														<span className="text-xs text-muted-foreground">
															{classItem.type}
														</span>
													</div>
													<div className="text-sm text-muted-foreground space-y-1">
														<div className="flex items-center">
															<Clock className="w-3 h-3 mr-2" />
															{classItem.time}
														</div>
														<div className="flex items-center">
															<User className="w-3 h-3 mr-2" />
															{classItem.teacher}
														</div>
														<div className="flex items-center">
															<MapPin className="w-3 h-3 mr-2" />
															{classItem.room}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</Card>
				</motion.div>
			)}

			{/* Subject Legend */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				<Card className="p-6 bg-card border-border">
					<h3 className="font-semibold text-foreground mb-4">Subject Legend</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
						{subjects.map((subject, index) => (
							<div key={index} className="flex items-center space-x-2">
								<div className={`w-3 h-3 ${subject.color} rounded-full`} />
								<span className="text-sm text-foreground">{subject.name}</span>
							</div>
						))}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}
