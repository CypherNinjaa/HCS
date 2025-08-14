"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	MessageSquare,
	Send,
	Search,
	Phone,
	Video,
	MoreVertical,
	Paperclip,
	Smile,
	CheckCheck,
	Check,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Contact {
	id: string;
	name: string;
	role: string;
	avatar: string;
	isOnline: boolean;
	lastSeen?: string;
	unreadCount: number;
}

interface Message {
	id: string;
	senderId: string;
	content: string;
	timestamp: string;
	status: "sent" | "delivered" | "read";
	type: "text" | "image" | "file";
	attachments?: {
		name: string;
		size: string;
		url: string;
	}[];
}

interface Conversation {
	id: string;
	contactId: string;
	messages: Message[];
	lastMessage: string;
	lastMessageTime: string;
	isGroup: boolean;
	groupMembers?: string[];
}

export function Messages() {
	const [selectedContact, setSelectedContact] = useState<string | null>(null);
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<
		"all" | "teachers" | "students" | "staff"
	>("all");

	const contacts: Contact[] = [
		{
			id: "1",
			name: "Mrs. Sarah Johnson",
			role: "Mathematics Teacher",
			avatar: "/avatars/teacher1.jpg",
			isOnline: true,
			unreadCount: 2,
		},
		{
			id: "2",
			name: "Mr. David Chen",
			role: "Physics Teacher",
			avatar: "/avatars/teacher2.jpg",
			isOnline: false,
			lastSeen: "2 hours ago",
			unreadCount: 0,
		},
		{
			id: "3",
			name: "Class 10-A Group",
			role: "Class Group",
			avatar: "/avatars/group.jpg",
			isOnline: true,
			unreadCount: 5,
		},
		{
			id: "4",
			name: "Dr. Michael Brown",
			role: "Chemistry Teacher",
			avatar: "/avatars/teacher3.jpg",
			isOnline: true,
			unreadCount: 1,
		},
		{
			id: "5",
			name: "Ms. Emily Davis",
			role: "English Teacher",
			avatar: "/avatars/teacher4.jpg",
			isOnline: false,
			lastSeen: "Yesterday",
			unreadCount: 0,
		},
		{
			id: "6",
			name: "Academic Office",
			role: "Administration",
			avatar: "/avatars/admin.jpg",
			isOnline: true,
			unreadCount: 0,
		},
	];

	const conversations: { [key: string]: Conversation } = {
		"1": {
			id: "1",
			contactId: "1",
			isGroup: false,
			lastMessage:
				"Your assignment submission was excellent! Keep up the good work.",
			lastMessageTime: "10:30 AM",
			messages: [
				{
					id: "1",
					senderId: "1",
					content: "Hello Alex! I have reviewed your mathematics assignment.",
					timestamp: "10:25 AM",
					status: "read",
					type: "text",
				},
				{
					id: "2",
					senderId: "me",
					content: "Thank you for checking it, Mrs. Johnson. How did I do?",
					timestamp: "10:28 AM",
					status: "read",
					type: "text",
				},
				{
					id: "3",
					senderId: "1",
					content:
						"Your assignment submission was excellent! Keep up the good work.",
					timestamp: "10:30 AM",
					status: "delivered",
					type: "text",
				},
			],
		},
		"2": {
			id: "2",
			contactId: "2",
			isGroup: false,
			lastMessage: "The physics lab session is scheduled for tomorrow at 2 PM.",
			lastMessageTime: "Yesterday",
			messages: [
				{
					id: "1",
					senderId: "2",
					content: "The physics lab session is scheduled for tomorrow at 2 PM.",
					timestamp: "Yesterday 3:45 PM",
					status: "read",
					type: "text",
				},
				{
					id: "2",
					senderId: "me",
					content: "Understood, sir. Should I bring any specific materials?",
					timestamp: "Yesterday 3:50 PM",
					status: "read",
					type: "text",
				},
			],
		},
		"3": {
			id: "3",
			contactId: "3",
			isGroup: true,
			groupMembers: ["student1", "student2", "student3"],
			lastMessage: "Emma: Has anyone completed the history project?",
			lastMessageTime: "2:15 PM",
			messages: [
				{
					id: "1",
					senderId: "student1",
					content:
						"Good morning everyone! Don&apos;t forget about today&apos;s chemistry test.",
					timestamp: "8:30 AM",
					status: "read",
					type: "text",
				},
				{
					id: "2",
					senderId: "student2",
					content: "Thanks for the reminder, Jake!",
					timestamp: "8:35 AM",
					status: "read",
					type: "text",
				},
				{
					id: "3",
					senderId: "student3",
					content: "Has anyone completed the history project?",
					timestamp: "2:15 PM",
					status: "delivered",
					type: "text",
				},
			],
		},
	};

	const getMessageStatus = (status: string) => {
		switch (status) {
			case "sent":
				return <Check className="w-4 h-4 text-muted-foreground" />;
			case "delivered":
				return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
			case "read":
				return <CheckCheck className="w-4 h-4 text-blue-500" />;
			default:
				return <Clock className="w-4 h-4 text-muted-foreground" />;
		}
	};

	const filteredContacts = contacts.filter((contact) => {
		const matchesSearch =
			contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.role.toLowerCase().includes(searchQuery.toLowerCase());

		if (filterType === "all") return matchesSearch;
		if (filterType === "teachers")
			return matchesSearch && contact.role.includes("Teacher");
		if (filterType === "students")
			return matchesSearch && contact.role.includes("Student");
		if (filterType === "staff")
			return (
				matchesSearch &&
				(contact.role.includes("Administration") ||
					contact.role.includes("Staff"))
			);

		return matchesSearch;
	});

	const sendMessage = () => {
		if (!newMessage.trim() || !selectedContact) return;

		// In real implementation, this would send the message to the server
		console.log("Sending message:", newMessage, "to:", selectedContact);
		setNewMessage("");
	};

	const formatTime = (timestamp: string) => {
		// Simple time formatting - in real app, use proper date library
		return timestamp;
	};

	return (
		<div className="h-[calc(100vh-8rem)] bg-background">
			<div className="flex h-full">
				{/* Contacts Sidebar */}
				<div className="w-full md:w-80 lg:w-96 bg-card border-r border-border flex flex-col">
					{/* Header */}
					<div className="p-4 border-b border-border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-foreground">Messages</h2>
							<Button variant="outline" size="sm">
								<MoreVertical className="w-4 h-4" />
							</Button>
						</div>

						{/* Search */}
						<div className="relative mb-4">
							<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						{/* Filter Tabs */}
						<div className="flex space-x-1 bg-muted rounded-lg p-1">
							{[
								{ key: "all" as const, label: "All" },
								{ key: "teachers" as const, label: "Teachers" },
								{ key: "students" as const, label: "Students" },
								{ key: "staff" as const, label: "Staff" },
							].map((filter) => (
								<button
									key={filter.key}
									onClick={() => setFilterType(filter.key)}
									className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
										filterType === filter.key
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									{filter.label}
								</button>
							))}
						</div>
					</div>

					{/* Contacts List */}
					<div className="flex-1 overflow-y-auto">
						{filteredContacts.map((contact) => {
							const conversation = conversations[contact.id];
							return (
								<motion.div
									key={contact.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
										selectedContact === contact.id ? "bg-muted" : ""
									}`}
									onClick={() => setSelectedContact(contact.id)}
								>
									<div className="flex items-center space-x-3">
										<div className="relative">
											<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
												{contact.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											{contact.isOnline && (
												<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-foreground truncate">
													{contact.name}
												</h3>
												{conversation && (
													<span className="text-xs text-muted-foreground">
														{conversation.lastMessageTime}
													</span>
												)}
											</div>
											<div className="flex items-center justify-between">
												<p className="text-sm text-muted-foreground truncate">
													{conversation
														? conversation.lastMessage
														: contact.role}
												</p>
												{contact.unreadCount > 0 && (
													<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
														{contact.unreadCount}
													</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{contact.role}
											</p>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Chat Area */}
				<div className="flex-1 flex flex-col">
					{selectedContact ? (
						<>
							{/* Chat Header */}
							<div className="p-4 border-b border-border bg-card">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="relative">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
												{contacts
													.find((c) => c.id === selectedContact)
													?.name.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											{contacts.find((c) => c.id === selectedContact)
												?.isOnline && (
												<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
											)}
										</div>
										<div>
											<h3 className="font-medium text-foreground">
												{contacts.find((c) => c.id === selectedContact)?.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{contacts.find((c) => c.id === selectedContact)
													?.isOnline
													? "Online"
													: `Last seen ${
															contacts.find((c) => c.id === selectedContact)
																?.lastSeen
													  }`}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Button variant="outline" size="sm">
											<Phone className="w-4 h-4" />
										</Button>
										<Button variant="outline" size="sm">
											<Video className="w-4 h-4" />
										</Button>
										<Button variant="outline" size="sm">
											<MoreVertical className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>

							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{conversations[selectedContact]?.messages.map((message) => (
									<motion.div
										key={message.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className={`flex ${
											message.senderId === "me"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
												message.senderId === "me"
													? "bg-blue-500 text-white"
													: "bg-muted text-foreground"
											}`}
										>
											<p className="text-sm">{message.content}</p>
											<div
												className={`flex items-center justify-between mt-1 ${
													message.senderId === "me"
														? "text-blue-100"
														: "text-muted-foreground"
												}`}
											>
												<span className="text-xs">
													{formatTime(message.timestamp)}
												</span>
												{message.senderId === "me" && (
													<div className="ml-2">
														{getMessageStatus(message.status)}
													</div>
												)}
											</div>
										</div>
									</motion.div>
								))}
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-border bg-card">
								<div className="flex items-center space-x-2">
									<Button variant="outline" size="sm">
										<Paperclip className="w-4 h-4" />
									</Button>
									<div className="flex-1 relative">
										<Input
											placeholder="Type a message..."
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											onKeyPress={(e) => e.key === "Enter" && sendMessage()}
											className="pr-12"
										/>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-1 top-1/2 transform -translate-y-1/2"
										>
											<Smile className="w-4 h-4" />
										</Button>
									</div>
									<Button onClick={sendMessage} disabled={!newMessage.trim()}>
										<Send className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</>
					) : (
						/* Welcome Screen */
						<div className="flex-1 flex items-center justify-center bg-muted/20">
							<div className="text-center">
								<MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-foreground mb-2">
									Welcome to Messages
								</h3>
								<p className="text-muted-foreground">
									Select a conversation to start chatting with your teachers and
									classmates
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
