"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Video,
	Calendar,
	Clock,
	Users,
	Plus,
	Play,
	Settings,
	ExternalLink,
} from "lucide-react";

interface OnlineClass {
	id: string;
	title: string;
	subject: string;
	className: string;
	scheduledTime: string;
	duration: number; // in minutes
	meetingUrl: string;
	platform: "zoom" | "google-meet" | "teams";
	status: "scheduled" | "live" | "completed" | "cancelled";
	attendees: number;
	maxAttendees: number;
	description: string;
	createdAt: string;
}

interface TeacherData {
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface OnlineClassesDetailedProps {
	teacherData: TeacherData;
}

const OnlineClassesDetailed: React.FC<OnlineClassesDetailedProps> = ({
	teacherData,
}) => {
	const [classes, setClasses] = useState<OnlineClass[]>([
		{
			id: "1",
			title: "Mathematics - Quadratic Equations",
			subject: "Mathematics",
			className: "Class X - A",
			scheduledTime: "2024-12-15T10:00:00",
			duration: 60,
			meetingUrl: "https://meet.google.com/abc-defg-hij",
			platform: "google-meet",
			status: "scheduled",
			attendees: 28,
			maxAttendees: 35,
			description:
				"Interactive session on solving quadratic equations with real-world examples",
			createdAt: "2024-12-10",
		},
		{
			id: "2",
			title: "Science Lab - Chemical Reactions",
			subject: "Science",
			className: "Class IX - B",
			scheduledTime: "2024-12-14T14:00:00",
			duration: 90,
			meetingUrl: "https://zoom.us/j/123456789",
			platform: "zoom",
			status: "live",
			attendees: 22,
			maxAttendees: 30,
			description: "Virtual chemistry lab demonstration and experiments",
			createdAt: "2024-12-12",
		},
		{
			id: "3",
			title: "English Literature Review",
			subject: "English",
			className: "Class VIII - C",
			scheduledTime: "2024-12-13T11:00:00",
			duration: 45,
			meetingUrl: "https://teams.microsoft.com/l/meetup-join/xyz",
			platform: "teams",
			status: "completed",
			attendees: 25,
			maxAttendees: 32,
			description: "Discussion on Shakespeare's Romeo and Juliet",
			createdAt: "2024-12-08",
		},
	]);

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [newClass, setNewClass] = useState({
		title: "",
		subject: "",
		className: "",
		scheduledTime: "",
		duration: 60,
		platform: "google-meet" as "zoom" | "google-meet" | "teams",
		description: "",
	});

	const handleCreateClass = () => {
		if (newClass.title && newClass.scheduledTime && newClass.className) {
			const onlineClass: OnlineClass = {
				id: Date.now().toString(),
				title: newClass.title,
				subject: newClass.subject,
				className: newClass.className,
				scheduledTime: newClass.scheduledTime,
				duration: newClass.duration,
				meetingUrl: generateMeetingUrl(newClass.platform),
				platform: newClass.platform,
				status: "scheduled",
				attendees: 0,
				maxAttendees:
					teacherData.classes.find(
						(c) => `${c.name} - ${c.section}` === newClass.className
					)?.students || 0,
				description: newClass.description,
				createdAt: new Date().toISOString().split("T")[0],
			};

			setClasses((prev) => [onlineClass, ...prev]);
			setNewClass({
				title: "",
				subject: "",
				className: "",
				scheduledTime: "",
				duration: 60,
				platform: "google-meet",
				description: "",
			});
			setShowCreateForm(false);
		}
	};

	const generateMeetingUrl = (platform: string) => {
		const randomId = Math.random().toString(36).substring(2, 15);
		switch (platform) {
			case "zoom":
				return `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
			case "google-meet":
				return `https://meet.google.com/${randomId}`;
			case "teams":
				return `https://teams.microsoft.com/l/meetup-join/${randomId}`;
			default:
				return `https://meet.google.com/${randomId}`;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "live":
				return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
			case "scheduled":
				return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
			case "completed":
				return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300";
			case "cancelled":
				return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const getPlatformIcon = (platform: string) => {
		switch (platform) {
			case "zoom":
				return "🎥";
			case "google-meet":
				return "📹";
			case "teams":
				return "💼";
			default:
				return "🎥";
		}
	};

	const formatDateTime = (dateTime: string) => {
		const date = new Date(dateTime);
		return {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		};
	};

	const getTimeStatus = (scheduledTime: string) => {
		const now = new Date();
		const classTime = new Date(scheduledTime);
		const diffMinutes = (classTime.getTime() - now.getTime()) / (1000 * 60);

		if (diffMinutes < 0) return "Past";
		if (diffMinutes < 15) return "Starting Soon";
		if (diffMinutes < 60) return `${Math.round(diffMinutes)}m`;
		if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h`;
		return `${Math.round(diffMinutes / 1440)}d`;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
						Online Classes Management
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Schedule and manage virtual classes with Zoom, Google Meet, or Teams
					</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
				>
					<Plus className="w-4 h-4" />
					Schedule Class
				</button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
					<div className="flex items-center gap-3">
						<Video className="w-8 h-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Classes
							</p>
							<p className="text-2xl font-bold text-green-600">
								{classes.length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
					<div className="flex items-center gap-3">
						<Play className="w-8 h-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Live Now
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{classes.filter((c) => c.status === "live").length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
					<div className="flex items-center gap-3">
						<Calendar className="w-8 h-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Scheduled
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{classes.filter((c) => c.status === "scheduled").length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
					<div className="flex items-center gap-3">
						<Users className="w-8 h-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Attendees
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{classes.reduce((acc, c) => acc + c.attendees, 0)}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Create Class Form */}
			{showCreateForm && (
				<Card className="p-6 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Schedule New Online Class
						</h3>
						<button
							onClick={() => setShowCreateForm(false)}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							×
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Class Title
							</label>
							<input
								type="text"
								value={newClass.title}
								onChange={(e) =>
									setNewClass((prev) => ({ ...prev, title: e.target.value }))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
								placeholder="Enter class title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Date & Time
							</label>
							<input
								type="datetime-local"
								value={newClass.scheduledTime}
								onChange={(e) =>
									setNewClass((prev) => ({
										...prev,
										scheduledTime: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Class
							</label>
							<select
								value={newClass.className}
								onChange={(e) =>
									setNewClass((prev) => ({
										...prev,
										className: e.target.value,
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Class</option>
								{teacherData.classes.map((cls) => (
									<option key={cls.id} value={`${cls.name} - ${cls.section}`}>
										{cls.name} - {cls.section}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Subject
							</label>
							<select
								value={newClass.subject}
								onChange={(e) =>
									setNewClass((prev) => ({ ...prev, subject: e.target.value }))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">Select Subject</option>
								{newClass.className &&
									teacherData.classes
										.find(
											(c) => `${c.name} - ${c.section}` === newClass.className
										)
										?.subjects.map((subject) => (
											<option key={subject} value={subject}>
												{subject}
											</option>
										))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Duration (minutes)
							</label>
							<select
								value={newClass.duration}
								onChange={(e) =>
									setNewClass((prev) => ({
										...prev,
										duration: parseInt(e.target.value),
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value={30}>30 minutes</option>
								<option value={45}>45 minutes</option>
								<option value={60}>1 hour</option>
								<option value={90}>1.5 hours</option>
								<option value={120}>2 hours</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Platform
							</label>
							<select
								value={newClass.platform}
								onChange={(e) =>
									setNewClass((prev) => ({
										...prev,
										platform: e.target.value as
											| "zoom"
											| "google-meet"
											| "teams",
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="google-meet">Google Meet</option>
								<option value="zoom">Zoom</option>
								<option value="teams">Microsoft Teams</option>
							</select>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description
						</label>
						<textarea
							value={newClass.description}
							onChange={(e) =>
								setNewClass((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							rows={3}
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							placeholder="Enter class description"
						/>
					</div>

					<div className="flex gap-3 mt-6">
						<button
							onClick={handleCreateClass}
							className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
						>
							Schedule Class
						</button>
						<button
							onClick={() => setShowCreateForm(false)}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</Card>
			)}

			{/* Classes List */}
			<div className="space-y-4">
				{classes.map((classItem) => {
					const { date, time } = formatDateTime(classItem.scheduledTime);
					const timeStatus = getTimeStatus(classItem.scheduledTime);

					return (
						<Card
							key={classItem.id}
							className="p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200"
						>
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-start gap-3">
										<div className="text-2xl">
											{getPlatformIcon(classItem.platform)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{classItem.title}
												</h3>
												<span
													className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
														classItem.status
													)}`}
												>
													{classItem.status === "live" && "🔴 "}
													{classItem.status.toUpperCase()}
												</span>
												{timeStatus !== "Past" && (
													<span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
														{timeStatus}
													</span>
												)}
											</div>
											<p className="text-gray-600 dark:text-gray-400 mb-2">
												{classItem.description}
											</p>
											<div className="flex flex-wrap gap-4 text-sm">
												<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
													<Users className="w-4 h-4" />
													{classItem.className} - {classItem.subject}
												</span>
												<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
													<Calendar className="w-4 h-4" />
													{date}
												</span>
												<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
													<Clock className="w-4 h-4" />
													{time} ({classItem.duration}m)
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-col lg:items-end gap-3">
									<div className="text-right">
										<p className="text-lg font-bold text-blue-600">
											{classItem.attendees}/{classItem.maxAttendees}
										</p>
										<p className="text-xs text-gray-600 dark:text-gray-400">
											{Math.round(
												(classItem.attendees / classItem.maxAttendees) * 100
											)}
											% attendance
										</p>
									</div>

									<div className="flex gap-2">
										{classItem.status === "scheduled" && (
											<button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800">
												<Play className="w-3 h-3" />
												Start
											</button>
										)}
										<a
											href={classItem.meetingUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
										>
											<ExternalLink className="w-3 h-3" />
											Join
										</a>
										<button className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
											<Settings className="w-3 h-3" />
											Settings
										</button>
									</div>
								</div>
							</div>

							{/* Attendance Progress */}
							<div className="mt-4">
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div
										className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
										style={{
											width: `${
												(classItem.attendees / classItem.maxAttendees) * 100
											}%`,
										}}
									/>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default OnlineClassesDetailed;
