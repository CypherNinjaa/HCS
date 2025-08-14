"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Video,
	Mic,
	MicOff,
	VideoOff,
	Phone,
	Users,
	Clock,
	Calendar,
	MessageSquare,
	Settings,
	Monitor,
	Hand,
	Share,
	MoreVertical,
	VolumeX,
	Volume2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LiveClasses() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [selectedClass, setSelectedClass] = useState<string | null>(null);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [isMicOn, setIsMicOn] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const currentClasses = [
		{
			id: "1",
			subject: "Mathematics",
			teacher: "Mrs. Sarah Johnson",
			topic: "Quadratic Equations - Advanced Problem Solving",
			startTime: "09:00",
			endTime: "10:30",
			duration: "1h 30m",
			participants: 28,
			maxParticipants: 30,
			status: "live",
			meetingId: "MTH-001-2024",
			isRecording: true,
		},
	];

	const upcomingClasses = [
		{
			id: "2",
			subject: "Physics",
			teacher: "Mr. David Chen",
			topic: "Electromagnetic Induction",
			startTime: "11:00",
			endTime: "12:30",
			duration: "1h 30m",
			participants: 0,
			maxParticipants: 30,
			status: "upcoming",
			meetingId: "PHY-002-2024",
		},
		{
			id: "3",
			subject: "Chemistry",
			teacher: "Dr. Michael Brown",
			topic: "Organic Chemistry Lab Session",
			startTime: "14:00",
			endTime: "15:30",
			duration: "1h 30m",
			participants: 0,
			maxParticipants: 25,
			status: "upcoming",
			meetingId: "CHE-003-2024",
		},
		{
			id: "4",
			subject: "English",
			teacher: "Ms. Emily Davis",
			topic: "Shakespeare - Hamlet Analysis",
			startTime: "16:00",
			endTime: "17:00",
			duration: "1h",
			participants: 0,
			maxParticipants: 35,
			status: "upcoming",
			meetingId: "ENG-004-2024",
		},
	];

	const completedClasses = [
		{
			id: "5",
			subject: "History",
			teacher: "Prof. Jane Wilson",
			topic: "World War II - Pacific Theatre",
			startTime: "08:00",
			endTime: "09:30",
			duration: "1h 30m",
			participants: 26,
			maxParticipants: 30,
			status: "completed",
			meetingId: "HIS-005-2024",
			recordingAvailable: true,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "live":
				return "bg-red-500 text-white";
			case "upcoming":
				return "bg-blue-500 text-white";
			case "completed":
				return "bg-green-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const formatTime = (time: string) => {
		return new Date(`2024-01-01 ${time}`).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const joinClass = (classId: string) => {
		setSelectedClass(classId);
	};

	const leaveClass = () => {
		setSelectedClass(null);
		setIsVideoOn(true);
		setIsMicOn(false);
		setIsHandRaised(false);
	};

	if (selectedClass) {
		const classData = currentClasses.find((c) => c.id === selectedClass);
		if (!classData) return null;

		return (
			<div className="h-screen bg-gray-900 flex flex-col">
				{/* Video Container */}
				<div className="flex-1 relative bg-black">
					{/* Main Video Area */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
							<div className="text-center text-white">
								<Video className="w-24 h-24 mx-auto mb-4 opacity-50" />
								<h3 className="text-2xl font-bold mb-2">{classData.topic}</h3>
								<p className="text-lg opacity-75">{classData.teacher}</p>
								<div className="mt-4 px-6 py-2 bg-red-500 rounded-full text-sm font-medium">
									● LIVE - {classData.participants} participants
								</div>
							</div>
						</div>
					</div>

					{/* Class Info Overlay */}
					<div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
						<div className="flex items-center space-x-3">
							<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
							<div>
								<h4 className="font-semibold">{classData.subject}</h4>
								<p className="text-sm opacity-75">{classData.meetingId}</p>
							</div>
						</div>
					</div>

					{/* Recording Indicator */}
					{classData.isRecording && (
						<div className="absolute top-4 right-4 bg-red-500 rounded-lg px-3 py-2 text-white text-sm font-medium">
							● Recording
						</div>
					)}

					{/* Participant Count */}
					<div className="absolute bottom-20 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
						<div className="flex items-center space-x-2">
							<Users className="w-4 h-4" />
							<span className="text-sm">
								{classData.participants}/{classData.maxParticipants}
							</span>
						</div>
					</div>

					{/* Hand Raised Indicator */}
					{isHandRaised && (
						<div className="absolute bottom-32 left-4 bg-yellow-500 rounded-lg p-3 text-white animate-bounce">
							<Hand className="w-6 h-6" />
						</div>
					)}
				</div>

				{/* Controls Bar */}
				<div className="bg-gray-800 p-4">
					<div className="flex items-center justify-between max-w-6xl mx-auto">
						{/* Left Controls */}
						<div className="flex items-center space-x-2">
							<Button
								variant={isMicOn ? "default" : "destructive"}
								size="sm"
								onClick={() => setIsMicOn(!isMicOn)}
								className="rounded-full w-12 h-12"
							>
								{isMicOn ? (
									<Mic className="w-5 h-5" />
								) : (
									<MicOff className="w-5 h-5" />
								)}
							</Button>
							<Button
								variant={isVideoOn ? "default" : "destructive"}
								size="sm"
								onClick={() => setIsVideoOn(!isVideoOn)}
								className="rounded-full w-12 h-12"
							>
								{isVideoOn ? (
									<Video className="w-5 h-5" />
								) : (
									<VideoOff className="w-5 h-5" />
								)}
							</Button>
							<Button
								variant={isMuted ? "destructive" : "outline"}
								size="sm"
								onClick={() => setIsMuted(!isMuted)}
								className="rounded-full w-12 h-12"
							>
								{isMuted ? (
									<VolumeX className="w-5 h-5" />
								) : (
									<Volume2 className="w-5 h-5" />
								)}
							</Button>
						</div>

						{/* Center Controls */}
						<div className="flex items-center space-x-2">
							<Button
								variant={isHandRaised ? "default" : "outline"}
								size="sm"
								onClick={() => setIsHandRaised(!isHandRaised)}
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<Hand className="w-4 h-4 mr-2" />
								{isHandRaised ? "Lower Hand" : "Raise Hand"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<MessageSquare className="w-4 h-4 mr-2" />
								Chat
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<Share className="w-4 h-4 mr-2" />
								Share
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<Monitor className="w-4 h-4 mr-2" />
								Screen
							</Button>
						</div>

						{/* Right Controls */}
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<Settings className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-white border-gray-600 hover:bg-gray-700"
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={leaveClass}
								className="rounded-full w-12 h-12"
							>
								<Phone className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
						Live Classes
					</h1>
					<p className="text-muted-foreground">
						Join live sessions and interact with your teachers
					</p>
				</div>

				<div className="flex items-center space-x-4 mt-4 md:mt-0">
					<div className="text-right">
						<div className="text-sm text-muted-foreground">Current Time</div>
						<div className="text-lg font-mono text-foreground">
							{currentTime.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							})}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Current Live Classes */}
			{currentClasses.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="space-y-4"
				>
					<h2 className="text-xl font-semibold text-foreground flex items-center">
						<div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
						Live Now
					</h2>
					{currentClasses.map((classItem) => (
						<Card
							key={classItem.id}
							className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800"
						>
							<div className="flex flex-col lg:flex-row lg:items-center justify-between">
								<div className="flex-1 space-y-3">
									<div className="flex items-start justify-between">
										<div>
											<h3 className="text-lg font-semibold text-foreground mb-1">
												{classItem.subject} - {classItem.topic}
											</h3>
											<p className="text-muted-foreground">
												{classItem.teacher}
											</p>
										</div>
										<div
											className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
												classItem.status
											)}`}
										>
											● LIVE
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div className="flex items-center">
											<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
											{formatTime(classItem.startTime)} -{" "}
											{formatTime(classItem.endTime)}
										</div>
										<div className="flex items-center">
											<Users className="w-4 h-4 mr-2 text-muted-foreground" />
											{classItem.participants}/{classItem.maxParticipants}
										</div>
										<div className="flex items-center">
											<Video className="w-4 h-4 mr-2 text-muted-foreground" />
											{classItem.meetingId}
										</div>
										<div className="flex items-center">
											<Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
											{classItem.duration}
										</div>
									</div>
								</div>

								<div className="lg:ml-6 mt-4 lg:mt-0">
									<Button
										onClick={() => joinClass(classItem.id)}
										className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
									>
										<Video className="w-4 h-4 mr-2" />
										Join Class
									</Button>
								</div>
							</div>
						</Card>
					))}
				</motion.div>
			)}

			{/* Upcoming Classes */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="space-y-4"
			>
				<h2 className="text-xl font-semibold text-foreground">
					Upcoming Classes
				</h2>
				{upcomingClasses.map((classItem) => (
					<Card
						key={classItem.id}
						className="p-6 bg-card border-border hover:shadow-lg transition-shadow"
					>
						<div className="flex flex-col lg:flex-row lg:items-center justify-between">
							<div className="flex-1 space-y-3">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-1">
											{classItem.subject} - {classItem.topic}
										</h3>
										<p className="text-muted-foreground">{classItem.teacher}</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											classItem.status
										)}`}
									>
										UPCOMING
									</div>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
									<div className="flex items-center">
										<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
										{formatTime(classItem.startTime)} -{" "}
										{formatTime(classItem.endTime)}
									</div>
									<div className="flex items-center">
										<Users className="w-4 h-4 mr-2 text-muted-foreground" />
										{classItem.maxParticipants} max
									</div>
									<div className="flex items-center">
										<Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
										{classItem.duration}
									</div>
								</div>
							</div>

							<div className="lg:ml-6 mt-4 lg:mt-0">
								<Button variant="outline" disabled>
									<Clock className="w-4 h-4 mr-2" />
									Starts at {formatTime(classItem.startTime)}
								</Button>
							</div>
						</div>
					</Card>
				))}
			</motion.div>

			{/* Completed Classes */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="space-y-4"
			>
				<h2 className="text-xl font-semibold text-foreground">
					Today&apos;s Completed Classes
				</h2>
				{completedClasses.map((classItem) => (
					<Card key={classItem.id} className="p-6 bg-card border-border">
						<div className="flex flex-col lg:flex-row lg:items-center justify-between">
							<div className="flex-1 space-y-3">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-1">
											{classItem.subject} - {classItem.topic}
										</h3>
										<p className="text-muted-foreground">{classItem.teacher}</p>
									</div>
									<div
										className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
											classItem.status
										)}`}
									>
										COMPLETED
									</div>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
									<div className="flex items-center">
										<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
										{formatTime(classItem.startTime)} -{" "}
										{formatTime(classItem.endTime)}
									</div>
									<div className="flex items-center">
										<Users className="w-4 h-4 mr-2 text-muted-foreground" />
										{classItem.participants} attended
									</div>
									<div className="flex items-center">
										<Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
										{classItem.duration}
									</div>
									{classItem.recordingAvailable && (
										<div className="flex items-center text-green-600">
											<Video className="w-4 h-4 mr-2" />
											Recording Available
										</div>
									)}
								</div>
							</div>

							<div className="lg:ml-6 mt-4 lg:mt-0 space-x-2">
								{classItem.recordingAvailable && (
									<Button variant="outline">
										<Video className="w-4 h-4 mr-2" />
										Watch Recording
									</Button>
								)}
							</div>
						</div>
					</Card>
				))}
			</motion.div>

			{/* Empty State */}
			{currentClasses.length === 0 && upcomingClasses.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-foreground mb-2">
						No classes scheduled
					</h3>
					<p className="text-muted-foreground">
						Check back later for upcoming live classes.
					</p>
				</motion.div>
			)}
		</div>
	);
}
