"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	MessageCircle,
	Send,
	Search,
	Phone,
	Video,
	Calendar,
	User,
	Mail,
	Paperclip,
	Star,
	ChevronRight,
	Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Teacher {
	id: string;
	name: string;
	subject: string;
	profilePicture: string;
	email: string;
	phone: string;
	department: string;
	isOnline: boolean;
	lastSeen?: string;
}

interface Message {
	id: string;
	senderId: string;
	senderName: string;
	senderType: "parent" | "teacher";
	content: string;
	timestamp: string;
	isRead: boolean;
	attachments?: string[];
	type: "text" | "file" | "appointment";
}

interface Conversation {
	id: string;
	teacherId: string;
	teacherName: string;
	subject: string;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
	messages: Message[];
}

interface TeacherCommunicationProps {
	selectedChild: string;
}

export function TeacherCommunication({}: TeacherCommunicationProps) {
	const [selectedConversation, setSelectedConversation] = useState<
		string | null
	>(null);
	const [newMessage, setNewMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	// Sample teachers data
	const teachers: Teacher[] = [
		{
			id: "1",
			name: "Ms. Sarah Johnson",
			subject: "Mathematics",
			profilePicture: "/api/placeholder/100/100",
			email: "sarah.johnson@hcs.edu",
			phone: "+1 (555) 123-4567",
			department: "Science & Mathematics",
			isOnline: true,
		},
		{
			id: "2",
			name: "Mr. David Chen",
			subject: "Physics",
			profilePicture: "/api/placeholder/100/100",
			email: "david.chen@hcs.edu",
			phone: "+1 (555) 234-5678",
			department: "Science & Mathematics",
			isOnline: false,
			lastSeen: "2 hours ago",
		},
		{
			id: "3",
			name: "Dr. Emily Parker",
			subject: "Chemistry",
			profilePicture: "/api/placeholder/100/100",
			email: "emily.parker@hcs.edu",
			phone: "+1 (555) 345-6789",
			department: "Science & Mathematics",
			isOnline: true,
		},
		{
			id: "4",
			name: "Ms. Lisa Brown",
			subject: "English",
			profilePicture: "/api/placeholder/100/100",
			email: "lisa.brown@hcs.edu",
			phone: "+1 (555) 456-7890",
			department: "Languages & Literature",
			isOnline: false,
			lastSeen: "1 day ago",
		},
	];

	// Sample conversations data
	const conversations: Conversation[] = [
		{
			id: "1",
			teacherId: "1",
			teacherName: "Ms. Sarah Johnson",
			subject: "Mathematics",
			lastMessage: "The additional practice problems have been sent.",
			lastMessageTime: "2024-08-15T10:30:00Z",
			unreadCount: 0,
			messages: [
				{
					id: "1",
					senderId: "parent",
					senderName: "You",
					senderType: "parent",
					content:
						"Hello, I wanted to discuss my child's progress in mathematics. They seem to be struggling with calculus.",
					timestamp: "2024-08-15T09:00:00Z",
					isRead: true,
					type: "text",
				},
				{
					id: "2",
					senderId: "1",
					senderName: "Ms. Sarah Johnson",
					senderType: "teacher",
					content:
						"Thank you for reaching out. I've noticed that too. I'd like to schedule a meeting to discuss some additional practice exercises.",
					timestamp: "2024-08-15T09:15:00Z",
					isRead: true,
					type: "text",
				},
				{
					id: "3",
					senderId: "1",
					senderName: "Ms. Sarah Johnson",
					senderType: "teacher",
					content: "The additional practice problems have been sent.",
					timestamp: "2024-08-15T10:30:00Z",
					isRead: true,
					type: "text",
				},
			],
		},
		{
			id: "2",
			teacherId: "2",
			teacherName: "Mr. David Chen",
			subject: "Physics",
			lastMessage: "Great improvement in the lab work!",
			lastMessageTime: "2024-08-14T14:20:00Z",
			unreadCount: 1,
			messages: [
				{
					id: "4",
					senderId: "2",
					senderName: "Mr. David Chen",
					senderType: "teacher",
					content: "Great improvement in the lab work!",
					timestamp: "2024-08-14T14:20:00Z",
					isRead: false,
					type: "text",
				},
			],
		},
		{
			id: "3",
			teacherId: "4",
			teacherName: "Ms. Lisa Brown",
			subject: "English",
			lastMessage: "The essay assignment deadline has been extended.",
			lastMessageTime: "2024-08-13T16:45:00Z",
			unreadCount: 2,
			messages: [
				{
					id: "5",
					senderId: "4",
					senderName: "Ms. Lisa Brown",
					senderType: "teacher",
					content: "The essay assignment deadline has been extended.",
					timestamp: "2024-08-13T16:45:00Z",
					isRead: false,
					type: "text",
				},
			],
		},
	];

	const selectedConversationData = conversations.find(
		(conv) => conv.id === selectedConversation
	);

	const filteredConversations = conversations.filter(
		(conversation) =>
			conversation.teacherName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			conversation.subject.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			return date.toLocaleDateString();
		}
	};

	const handleSendMessage = () => {
		if (newMessage.trim() && selectedConversationData) {
			// Here you would typically send the message to your backend
			console.log("Sending message:", newMessage);
			setNewMessage("");
		}
	};

	const totalUnreadMessages = conversations.reduce(
		(total, conv) => total + conv.unreadCount,
		0
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Teacher Communication 💬
						</h1>
						<p className="text-purple-100">
							Connect with your child&apos;s teachers directly
						</p>
					</div>
					{totalUnreadMessages > 0 && (
						<div className="bg-white/20 rounded-lg p-4">
							<div className="flex items-center space-x-2">
								<MessageCircle className="w-6 h-6" />
								<span className="text-lg font-semibold">
									{totalUnreadMessages}
								</span>
							</div>
							<p className="text-sm text-purple-100">Unread messages</p>
						</div>
					)}
				</div>
			</motion.div>

			{/* Main Communication Interface */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
			>
				{/* Conversations List */}
				<div className="lg:col-span-1">
					<Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Conversations
								</h3>
								<Button
									size="sm"
									className="bg-purple-500 hover:bg-purple-600 text-white"
								>
									<Plus className="w-4 h-4" />
								</Button>
							</div>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search teachers..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
							</div>
						</div>
						<div className="overflow-y-auto h-full">
							{filteredConversations.map((conversation, index) => (
								<motion.div
									key={conversation.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									onClick={() => setSelectedConversation(conversation.id)}
									className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
										selectedConversation === conversation.id
											? "bg-purple-50 dark:bg-purple-900/20 border-r-4 border-r-purple-500"
											: ""
									}`}
								>
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-3">
											<div className="relative">
												<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
													<User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
												</div>
												{teachers.find((t) => t.id === conversation.teacherId)
													?.isOnline && (
													<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
												)}
											</div>
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{conversation.teacherName}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{conversation.subject}
												</p>
											</div>
										</div>
										{conversation.unreadCount > 0 && (
											<div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
												{conversation.unreadCount}
											</div>
										)}
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
										{conversation.lastMessage}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{formatTime(conversation.lastMessageTime)}
									</p>
								</motion.div>
							))}
						</div>
					</Card>
				</div>

				{/* Chat Interface */}
				<div className="lg:col-span-2">
					{selectedConversationData ? (
						<Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col">
							{/* Chat Header */}
							<div className="p-4 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="relative">
											<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
												<User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
											</div>
											{teachers.find(
												(t) => t.id === selectedConversationData.teacherId
											)?.isOnline && (
												<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
											)}
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{selectedConversationData.teacherName}
											</h3>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{selectedConversationData.subject} Teacher
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Button variant="ghost" size="sm">
											<Phone className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm">
											<Video className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="sm">
											<Calendar className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>

							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{selectedConversationData.messages.map((message, index) => (
									<motion.div
										key={message.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										className={`flex ${
											message.senderType === "parent"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
												message.senderType === "parent"
													? "bg-purple-500 text-white"
													: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
											}`}
										>
											<p className="text-sm">{message.content}</p>
											<p
												className={`text-xs mt-1 ${
													message.senderType === "parent"
														? "text-purple-100"
														: "text-gray-500 dark:text-gray-400"
												}`}
											>
												{formatTime(message.timestamp)}
											</p>
										</div>
									</motion.div>
								))}
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex items-center space-x-2">
									<div className="flex-1 relative">
										<input
											type="text"
											placeholder="Type your message..."
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											onKeyPress={(e) =>
												e.key === "Enter" && handleSendMessage()
											}
											className="w-full px-4 py-2 pr-12 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										/>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-1/2 transform -translate-y-1/2"
										>
											<Paperclip className="w-4 h-4" />
										</Button>
									</div>
									<Button
										onClick={handleSendMessage}
										disabled={!newMessage.trim()}
										className="bg-purple-500 hover:bg-purple-600 text-white"
									>
										<Send className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</Card>
					) : (
						<Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
							<div className="text-center">
								<MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
									Select a conversation
								</h3>
								<p className="text-gray-500 dark:text-gray-400">
									Choose a teacher to start communicating
								</p>
							</div>
						</Card>
					)}
				</div>
			</motion.div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					Quick Actions
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
						<div className="flex items-center space-x-3">
							<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
								<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">
									Schedule Meeting
								</h4>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Book parent-teacher conference
								</p>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400" />
						</div>
					</Card>

					<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
						<div className="flex items-center space-x-3">
							<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
								<Star className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">
									Rate Teacher
								</h4>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Provide feedback and ratings
								</p>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400" />
						</div>
					</Card>

					<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
						<div className="flex items-center space-x-3">
							<div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
								<Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">
									Email Teacher
								</h4>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Send formal email communication
								</p>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400" />
						</div>
					</Card>
				</div>
			</motion.div>
		</div>
	);
}
