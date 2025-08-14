"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Star,
	Calendar,
	MapPin,
	Clock,
	Users,
	MessageSquare,
	Send,
	Filter,
	Search,
	TrendingUp,
	Award,
	ThumbsUp,
	Heart,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	category:
		| "academic"
		| "sports"
		| "cultural"
		| "social"
		| "workshop"
		| "ceremony";
	duration: string;
	organizer: string;
	attendees: number;
	maxCapacity: number;
	hasAttended: boolean;
	hasRated: boolean;
	averageRating: number;
	totalRatings: number;
	images?: string[];
}

interface Rating {
	id: string;
	eventId: string;
	parentName: string;
	childName: string;
	overallRating: number;
	categories: {
		organization: number;
		content: number;
		facilities: number;
		engagement: number;
	};
	feedback: string;
	date: string;
	wouldRecommend: boolean;
}

interface EventRatingProps {
	selectedChild: string;
}

export function EventRating({}: EventRatingProps) {
	const [activeTab, setActiveTab] = useState<
		"events" | "feedback" | "analytics"
	>("events");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [showRatingForm, setShowRatingForm] = useState(false);

	// Rating form state
	const [rating, setRating] = useState({
		overall: 0,
		organization: 0,
		content: 0,
		facilities: 0,
		engagement: 0,
		feedback: "",
		wouldRecommend: false,
	});

	// Sample events data
	const events: Event[] = [
		{
			id: "1",
			title: "Annual Science Fair 2024",
			description:
				"Students showcase their scientific projects and innovations",
			date: "2024-08-15",
			location: "Main Auditorium",
			category: "academic",
			duration: "3 hours",
			organizer: "Science Department",
			attendees: 145,
			maxCapacity: 200,
			hasAttended: true,
			hasRated: false,
			averageRating: 4.5,
			totalRatings: 42,
		},
		{
			id: "2",
			title: "Inter-House Sports Day",
			description: "Annual sports competition between school houses",
			date: "2024-07-20",
			location: "Sports Ground",
			category: "sports",
			duration: "Full Day",
			organizer: "Sports Department",
			attendees: 180,
			maxCapacity: 250,
			hasAttended: true,
			hasRated: true,
			averageRating: 4.8,
			totalRatings: 67,
		},
		{
			id: "3",
			title: "Cultural Night - Talent Show",
			description: "Students perform various cultural activities and talents",
			date: "2024-06-10",
			location: "School Theater",
			category: "cultural",
			duration: "2.5 hours",
			organizer: "Cultural Committee",
			attendees: 120,
			maxCapacity: 150,
			hasAttended: true,
			hasRated: true,
			averageRating: 4.3,
			totalRatings: 38,
		},
		{
			id: "4",
			title: "Parent-Teacher Workshop",
			description: "Workshop on effective parenting and child development",
			date: "2024-05-25",
			location: "Conference Hall",
			category: "workshop",
			duration: "2 hours",
			organizer: "Counseling Department",
			attendees: 85,
			maxCapacity: 100,
			hasAttended: false,
			hasRated: false,
			averageRating: 4.6,
			totalRatings: 23,
		},
		{
			id: "5",
			title: "Graduation Ceremony 2024",
			description: "Celebration of graduating class achievements",
			date: "2024-04-15",
			location: "Main Hall",
			category: "ceremony",
			duration: "1.5 hours",
			organizer: "Administration",
			attendees: 200,
			maxCapacity: 300,
			hasAttended: true,
			hasRated: true,
			averageRating: 4.9,
			totalRatings: 89,
		},
	];

	// Sample ratings data
	const ratings: Rating[] = [
		{
			id: "1",
			eventId: "2",
			parentName: "John Smith",
			childName: "Emily Smith",
			overallRating: 5,
			categories: {
				organization: 5,
				content: 4,
				facilities: 5,
				engagement: 5,
			},
			feedback:
				"Excellent event! My child really enjoyed the sports activities and the organization was top-notch.",
			date: "2024-07-21",
			wouldRecommend: true,
		},
		{
			id: "2",
			eventId: "3",
			parentName: "Sarah Johnson",
			childName: "Michael Johnson",
			overallRating: 4,
			categories: {
				organization: 4,
				content: 5,
				facilities: 3,
				engagement: 4,
			},
			feedback:
				"Great cultural event. The performances were amazing, though the venue could be improved.",
			date: "2024-06-11",
			wouldRecommend: true,
		},
	];

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "academic":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "sports":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "cultural":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
			case "social":
				return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
			case "workshop":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
			case "ceremony":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const renderStars = (
		rating: number,
		interactive = false,
		onRate?: (rating: number) => void
	) => {
		return (
			<div className="flex items-center space-x-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						onClick={() => interactive && onRate && onRate(star)}
						disabled={!interactive}
						className={`${
							interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
						} transition-transform`}
					>
						<Star
							className={`w-5 h-5 ${
								star <= rating
									? "text-yellow-400 fill-current"
									: "text-gray-300 dark:text-gray-600"
							}`}
						/>
					</button>
				))}
			</div>
		);
	};

	const filteredEvents = events
		.filter((event) => {
			const matchesCategory =
				categoryFilter === "all" || event.category === categoryFilter;
			const matchesSearch =
				event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.description.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesCategory && matchesSearch;
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const handleSubmitRating = () => {
		if (!selectedEvent) return;

		// Here you would submit the rating
		console.log("Submitting rating for event:", selectedEvent.title, rating);
		setShowRatingForm(false);
		setSelectedEvent(null);
		setRating({
			overall: 0,
			organization: 0,
			content: 0,
			facilities: 0,
			engagement: 0,
			feedback: "",
			wouldRecommend: false,
		});
	};

	const stats = {
		eventsAttended: events.filter((e) => e.hasAttended).length,
		eventsRated: events.filter((e) => e.hasRated).length,
		averageRating:
			events.reduce((acc, e) => acc + e.averageRating, 0) / events.length,
		totalFeedback: ratings.length,
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white"
			>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							Event Ratings & Feedback ⭐
						</h1>
						<p className="text-orange-100">
							Rate and provide feedback on school events and facilities
						</p>
					</div>
					<div className="hidden md:flex items-center space-x-6">
						<div className="text-center">
							<div className="text-2xl font-bold">{stats.eventsAttended}</div>
							<div className="text-sm text-orange-100">Events Attended</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{stats.averageRating.toFixed(1)}
							</div>
							<div className="text-sm text-orange-100">Avg Rating</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Statistics Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-2 md:grid-cols-4 gap-4"
			>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								{stats.eventsAttended}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Attended
							</div>
						</div>
						<Calendar className="w-5 h-5 text-blue-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
								{stats.eventsRated}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Rated
							</div>
						</div>
						<Star className="w-5 h-5 text-yellow-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								{stats.averageRating.toFixed(1)}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Avg Rating
							</div>
						</div>
						<TrendingUp className="w-5 h-5 text-green-500" />
					</div>
				</Card>
				<Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								{stats.totalFeedback}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Feedback
							</div>
						</div>
						<MessageSquare className="w-5 h-5 text-purple-500" />
					</div>
				</Card>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex space-x-4 border-b border-gray-200 dark:border-gray-700"
			>
				{[
					{ key: "events", label: "Events", icon: Calendar },
					{ key: "feedback", label: "My Feedback", icon: MessageSquare },
					{ key: "analytics", label: "Analytics", icon: TrendingUp },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() =>
							setActiveTab(tab.key as "events" | "feedback" | "analytics")
						}
						className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
							activeTab === tab.key
								? "border-orange-500 text-orange-600 dark:text-orange-400"
								: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
						}`}
					>
						<tab.icon className="w-4 h-4" />
						<span>{tab.label}</span>
					</button>
				))}
			</motion.div>

			{/* Events Tab */}
			{activeTab === "events" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					{/* Filters */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search events..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Filter className="w-4 h-4 text-gray-400" />
							<select
								value={categoryFilter}
								onChange={(e) => setCategoryFilter(e.target.value)}
								className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							>
								<option value="all">All Categories</option>
								<option value="academic">Academic</option>
								<option value="sports">Sports</option>
								<option value="cultural">Cultural</option>
								<option value="social">Social</option>
								<option value="workshop">Workshop</option>
								<option value="ceremony">Ceremony</option>
							</select>
						</div>
					</div>

					{/* Events Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredEvents.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
							>
								<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
									{/* Event Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<span
													className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
														event.category
													)}`}
												>
													{event.category}
												</span>
												{event.hasAttended && (
													<CheckCircle className="w-4 h-4 text-green-500" />
												)}
											</div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
												{event.title}
											</h3>
										</div>
									</div>

									{/* Event Details */}
									<div className="space-y-3 mb-4">
										<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
											{event.description}
										</p>

										<div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-400">
											<div className="flex items-center space-x-2">
												<Calendar className="w-4 h-4" />
												<span>{new Date(event.date).toLocaleDateString()}</span>
											</div>
											<div className="flex items-center space-x-2">
												<MapPin className="w-4 h-4" />
												<span>{event.location}</span>
											</div>
											<div className="flex items-center space-x-2">
												<Clock className="w-4 h-4" />
												<span>{event.duration}</span>
											</div>
											<div className="flex items-center space-x-2">
												<Users className="w-4 h-4" />
												<span>
													{event.attendees}/{event.maxCapacity} attendees
												</span>
											</div>
										</div>
									</div>

									{/* Rating */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center space-x-2">
											{renderStars(event.averageRating)}
											<span className="text-sm text-gray-600 dark:text-gray-400">
												({event.totalRatings})
											</span>
										</div>
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{event.averageRating.toFixed(1)}
										</div>
									</div>

									{/* Actions */}
									<div className="space-y-2">
										{event.hasAttended && !event.hasRated && (
											<Button
												onClick={() => {
													setSelectedEvent(event);
													setShowRatingForm(true);
												}}
												size="sm"
												className="w-full bg-orange-500 hover:bg-orange-600 text-white"
											>
												<Star className="w-4 h-4 mr-2" />
												Rate Event
											</Button>
										)}
										{event.hasRated && (
											<div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 text-sm">
												<CheckCircle className="w-4 h-4" />
												<span>You rated this event</span>
											</div>
										)}
										{!event.hasAttended && (
											<div className="text-center text-gray-500 dark:text-gray-400 text-sm">
												You did not attend this event
											</div>
										)}
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Feedback Tab */}
			{activeTab === "feedback" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							Your Event Feedback
						</h2>
						<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
							<MessageSquare className="w-4 h-4" />
							<span>{ratings.length} feedback submitted</span>
						</div>
					</div>

					<div className="space-y-4">
						{ratings.map((ratingItem) => {
							const event = events.find((e) => e.id === ratingItem.eventId);
							return (
								<Card
									key={ratingItem.id}
									className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
								>
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{event?.title}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Rated on{" "}
												{new Date(ratingItem.date).toLocaleDateString()}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											{renderStars(ratingItem.overallRating)}
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{ratingItem.overallRating}.0
											</span>
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Organization
											</p>
											{renderStars(ratingItem.categories.organization)}
										</div>
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Content
											</p>
											{renderStars(ratingItem.categories.content)}
										</div>
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Facilities
											</p>
											{renderStars(ratingItem.categories.facilities)}
										</div>
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Engagement
											</p>
											{renderStars(ratingItem.categories.engagement)}
										</div>
									</div>

									{ratingItem.feedback && (
										<div className="mb-4">
											<p className="text-sm text-gray-900 dark:text-white">
												{ratingItem.feedback}
											</p>
										</div>
									)}

									{ratingItem.wouldRecommend && (
										<div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
											<ThumbsUp className="w-4 h-4" />
											<span>Would recommend this event</span>
										</div>
									)}
								</Card>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Analytics Tab */}
			{activeTab === "analytics" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						Event Analytics & Insights
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Most Popular Events
								</h3>
								<Award className="w-5 h-5 text-yellow-500" />
							</div>
							<div className="space-y-3">
								{events
									.sort((a, b) => b.attendees - a.attendees)
									.slice(0, 3)
									.map((event, index) => (
										<div
											key={event.id}
											className="flex items-center justify-between"
										>
											<div>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{event.title}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{event.attendees} attendees
												</p>
											</div>
											<div className="text-2xl">
												{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
											</div>
										</div>
									))}
							</div>
						</Card>

						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Highest Rated Events
								</h3>
								<Star className="w-5 h-5 text-yellow-500" />
							</div>
							<div className="space-y-3">
								{events
									.sort((a, b) => b.averageRating - a.averageRating)
									.slice(0, 3)
									.map((event) => (
										<div
											key={event.id}
											className="flex items-center justify-between"
										>
											<div>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{event.title}
												</p>
												<div className="flex items-center space-x-1">
													{renderStars(event.averageRating)}
													<span className="text-xs text-gray-500 dark:text-gray-400">
														({event.totalRatings})
													</span>
												</div>
											</div>
											<div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
												{event.averageRating.toFixed(1)}
											</div>
										</div>
									))}
							</div>
						</Card>

						<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Your Engagement
								</h3>
								<Heart className="w-5 h-5 text-red-500" />
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Events Attended
									</span>
									<span className="text-lg font-bold text-gray-900 dark:text-white">
										{stats.eventsAttended}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Feedback Given
									</span>
									<span className="text-lg font-bold text-gray-900 dark:text-white">
										{stats.eventsRated}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Avg Rating Given
									</span>
									<span className="text-lg font-bold text-gray-900 dark:text-white">
										{ratings.length > 0
											? (
													ratings.reduce((acc, r) => acc + r.overallRating, 0) /
													ratings.length
											  ).toFixed(1)
											: "N/A"}
									</span>
								</div>
							</div>
						</Card>
					</div>
				</motion.div>
			)}

			{/* Rating Form Modal */}
			{showRatingForm && selectedEvent && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Rate: {selectedEvent.title}
						</h3>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Overall Rating
								</label>
								{renderStars(rating.overall, true, (star) =>
									setRating((prev) => ({ ...prev, overall: star }))
								)}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Organization
									</label>
									{renderStars(rating.organization, true, (star) =>
										setRating((prev) => ({ ...prev, organization: star }))
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Content
									</label>
									{renderStars(rating.content, true, (star) =>
										setRating((prev) => ({ ...prev, content: star }))
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Facilities
									</label>
									{renderStars(rating.facilities, true, (star) =>
										setRating((prev) => ({ ...prev, facilities: star }))
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Engagement
									</label>
									{renderStars(rating.engagement, true, (star) =>
										setRating((prev) => ({ ...prev, engagement: star }))
									)}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Feedback
								</label>
								<textarea
									value={rating.feedback}
									onChange={(e) =>
										setRating((prev) => ({ ...prev, feedback: e.target.value }))
									}
									rows={3}
									placeholder="Share your thoughts about this event..."
									className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								/>
							</div>

							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="recommend"
									checked={rating.wouldRecommend}
									onChange={(e) =>
										setRating((prev) => ({
											...prev,
											wouldRecommend: e.target.checked,
										}))
									}
									className="rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500"
								/>
								<label
									htmlFor="recommend"
									className="text-sm text-gray-700 dark:text-gray-300"
								>
									I would recommend this event
								</label>
							</div>
						</div>

						<div className="flex justify-end space-x-4 mt-6">
							<Button
								variant="ghost"
								onClick={() => {
									setShowRatingForm(false);
									setSelectedEvent(null);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmitRating}
								className="bg-orange-500 hover:bg-orange-600 text-white"
								disabled={rating.overall === 0}
							>
								<Send className="w-4 h-4 mr-2" />
								Submit Rating
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
}
