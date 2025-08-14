"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Send,
	MessageCircle,
	Users,
	Calendar,
	Search,
	Filter,
	Clock,
	CheckCircle,
} from "lucide-react";

interface Message {
	id: string;
	parentName: string;
	studentName: string;
	studentRoll: string;
	subject: string;
	message: string;
	timestamp: string;
	status: "sent" | "delivered" | "read";
	type: "individual" | "broadcast";
	priority: "low" | "medium" | "high";
}

interface Parent {
	id: string;
	name: string;
	email: string;
	phone: string;
	studentName: string;
	studentRoll: string;
	className: string;
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

interface ParentCommunicationDetailedProps {
	teacherData: TeacherData;
}

const ParentCommunicationDetailed: React.FC<
	ParentCommunicationDetailedProps
> = ({ teacherData }) => {
	const [activeTab, setActiveTab] = useState<"compose" | "inbox" | "sent">(
		"compose"
	);
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [messageType, setMessageType] = useState<"individual" | "broadcast">(
		"individual"
	);
	const [searchTerm, setSearchTerm] = useState("");

	// Mock messages data
	const [messages] = useState<Message[]>([
		{
			id: "1",
			parentName: "Mr. Sharma",
			studentName: "Arjun Sharma",
			studentRoll: "X-A-001",
			subject: "Assignment Reminder",
			message:
				"Please remind Arjun to complete his mathematics assignment due tomorrow.",
			timestamp: "2024-12-14T10:30:00",
			status: "read",
			type: "individual",
			priority: "medium",
		},
		{
			id: "2",
			parentName: "Mrs. Patel",
			studentName: "Priya Patel",
			studentRoll: "IX-B-015",
			subject: "Science Project Update",
			message:
				"Thank you for the feedback on Priya's science project. We will work on the improvements.",
			timestamp: "2024-12-14T09:15:00",
			status: "delivered",
			type: "individual",
			priority: "low",
		},
		{
			id: "3",
			parentName: "Broadcast",
			studentName: "All Students",
			studentRoll: "ALL",
			subject: "Parent-Teacher Meeting",
			message:
				"Reminder: Parent-Teacher meeting scheduled for December 20th at 4 PM.",
			timestamp: "2024-12-13T16:00:00",
			status: "sent",
			type: "broadcast",
			priority: "high",
		},
	]);

	// Mock parents data
	const generateParents = (): Parent[] => {
		const parents: Parent[] = [];
		teacherData.classes.forEach((cls) => {
			for (let i = 1; i <= Math.min(cls.students, 10); i++) {
				parents.push({
					id: `parent-${cls.id}-${i}`,
					name: `Parent ${i.toString().padStart(2, "0")}`,
					email: `parent${i}@email.com`,
					phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
					studentName: `Student ${i.toString().padStart(2, "0")}`,
					studentRoll: `${cls.name.replace("Class ", "")}-${cls.section}-${i
						.toString()
						.padStart(3, "0")}`,
					className: `${cls.name} - ${cls.section}`,
				});
			}
		});
		return parents;
	};

	const [parents] = useState<Parent[]>(generateParents());
	const [newMessage, setNewMessage] = useState({
		recipient: "",
		subject: "",
		message: "",
		priority: "medium" as "low" | "medium" | "high",
	});

	const handleSendMessage = () => {
		if (newMessage.subject && newMessage.message) {
			// Here you would send the message to your backend
			console.log("Sending message:", {
				type: messageType,
				recipient: messageType === "broadcast" ? "all" : newMessage.recipient,
				subject: newMessage.subject,
				message: newMessage.message,
				priority: newMessage.priority,
				class: selectedClass,
			});

			// Reset form
			setNewMessage({
				recipient: "",
				subject: "",
				message: "",
				priority: "medium",
			});

			alert("Message sent successfully!");
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "sent":
				return <Send className="w-4 h-4 text-gray-500" />;
			case "delivered":
				return <CheckCircle className="w-4 h-4 text-blue-500" />;
			case "read":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			default:
				return <Clock className="w-4 h-4 text-gray-400" />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
			case "medium":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
			case "low":
				return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
		}
	};

	const filteredParents = parents.filter(
		(parent) =>
			(selectedClass === "" || parent.className === selectedClass) &&
			(parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				parent.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				parent.studentRoll.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const filteredMessages = messages.filter(
		(message) =>
			message.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.subject.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
						Parent Communication Hub
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Send messages, announcements and updates to parents
					</p>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
					<div className="flex items-center gap-3">
						<MessageCircle className="w-8 h-8 text-pink-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Messages
							</p>
							<p className="text-2xl font-bold text-pink-600">
								{messages.length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
					<div className="flex items-center gap-3">
						<Users className="w-8 h-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Parents
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{parents.length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
					<div className="flex items-center gap-3">
						<CheckCircle className="w-8 h-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Read Messages
							</p>
							<p className="text-2xl font-bold text-green-600">
								{messages.filter((m) => m.status === "read").length}
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
					<div className="flex items-center gap-3">
						<Send className="w-8 h-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Broadcasts
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{messages.filter((m) => m.type === "broadcast").length}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Tabs */}
			<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
				<button
					onClick={() => setActiveTab("compose")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
						activeTab === "compose"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
							: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
					}`}
				>
					Compose Message
				</button>
				<button
					onClick={() => setActiveTab("inbox")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
						activeTab === "inbox"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
							: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
					}`}
				>
					Inbox ({messages.filter((m) => m.type === "individual").length})
				</button>
				<button
					onClick={() => setActiveTab("sent")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
						activeTab === "sent"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
							: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
					}`}
				>
					Sent Messages
				</button>
			</div>

			{/* Compose Message */}
			{activeTab === "compose" && (
				<Card className="p-6 bg-white dark:bg-gray-800">
					<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
						Compose New Message
					</h3>

					{/* Message Type Toggle */}
					<div className="flex gap-4 mb-4">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="messageType"
								value="individual"
								checked={messageType === "individual"}
								onChange={(e) =>
									setMessageType(e.target.value as "individual" | "broadcast")
								}
								className="text-pink-600"
							/>
							<span className="text-gray-700 dark:text-gray-300">
								Individual Message
							</span>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="messageType"
								value="broadcast"
								checked={messageType === "broadcast"}
								onChange={(e) =>
									setMessageType(e.target.value as "individual" | "broadcast")
								}
								className="text-pink-600"
							/>
							<span className="text-gray-700 dark:text-gray-300">
								Broadcast to Class
							</span>
						</label>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						{/* Class Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Select Class
							</label>
							<select
								value={selectedClass}
								onChange={(e) => setSelectedClass(e.target.value)}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="">All Classes</option>
								{teacherData.classes.map((cls) => (
									<option key={cls.id} value={`${cls.name} - ${cls.section}`}>
										{cls.name} - {cls.section}
									</option>
								))}
							</select>
						</div>

						{/* Recipient Selection (for individual messages) */}
						{messageType === "individual" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Select Parent
								</label>
								<select
									value={newMessage.recipient}
									onChange={(e) =>
										setNewMessage((prev) => ({
											...prev,
											recipient: e.target.value,
										}))
									}
									className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
								>
									<option value="">Choose Parent</option>
									{filteredParents.map((parent) => (
										<option key={parent.id} value={parent.id}>
											{parent.name} ({parent.studentName})
										</option>
									))}
								</select>
							</div>
						)}

						{/* Priority */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Priority
							</label>
							<select
								value={newMessage.priority}
								onChange={(e) =>
									setNewMessage((prev) => ({
										...prev,
										priority: e.target.value as "low" | "medium" | "high",
									}))
								}
								className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							>
								<option value="low">Low Priority</option>
								<option value="medium">Medium Priority</option>
								<option value="high">High Priority</option>
							</select>
						</div>
					</div>

					{/* Subject */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Subject
						</label>
						<input
							type="text"
							value={newMessage.subject}
							onChange={(e) =>
								setNewMessage((prev) => ({ ...prev, subject: e.target.value }))
							}
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							placeholder="Enter message subject"
						/>
					</div>

					{/* Message */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Message
						</label>
						<textarea
							value={newMessage.message}
							onChange={(e) =>
								setNewMessage((prev) => ({ ...prev, message: e.target.value }))
							}
							rows={5}
							className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
							placeholder="Type your message here..."
						/>
					</div>

					<div className="flex gap-3">
						<button
							onClick={handleSendMessage}
							className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
						>
							<Send className="w-4 h-4" />
							Send Message
						</button>
						<button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
							<Calendar className="w-4 h-4" />
							Schedule
						</button>
					</div>
				</Card>
			)}

			{/* Messages List */}
			{(activeTab === "inbox" || activeTab === "sent") && (
				<Card className="p-6 bg-white dark:bg-gray-800">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{activeTab === "inbox" ? "Received Messages" : "Sent Messages"}
						</h3>
						<div className="flex gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<input
									type="text"
									placeholder="Search messages..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
								/>
							</div>
							<button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
								<Filter className="w-4 h-4" />
								Filter
							</button>
						</div>
					</div>

					<div className="space-y-3">
						{filteredMessages.map((message) => (
							<div
								key={message.id}
								className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h4 className="font-semibold text-gray-900 dark:text-white">
												{message.subject}
											</h4>
											<span
												className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
													message.priority
												)}`}
											>
												{message.priority.toUpperCase()}
											</span>
											{message.type === "broadcast" && (
												<span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
													BROADCAST
												</span>
											)}
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
											From: {message.parentName} ({message.studentName} -{" "}
											{message.studentRoll})
										</p>
										<p className="text-gray-800 dark:text-gray-200 mb-2">
											{message.message}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{new Date(message.timestamp).toLocaleString()}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{getStatusIcon(message.status)}
										<span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
											{message.status}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}
		</div>
	);
};

export default ParentCommunicationDetailed;
