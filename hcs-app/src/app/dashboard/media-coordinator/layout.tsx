"use client";

import { useState, useEffect } from "react";
import { MediaCoordinatorHeader } from "@/components/media-coordinator/media-coordinator-header";
import { MediaCoordinatorSidebar } from "@/components/media-coordinator/media-coordinator-sidebar";

// Mock data for the media coordinator
const mockMediaCoordinatorData = {
	id: "MC001",
	name: "Sarah Johnson",
	email: "sarah.johnson@happychildschool.edu",
	phone: "+1 (555) 123-4567",
	profilePicture: "/api/placeholder/150/150",
	employeeId: "EMP-MC-001",
	department: "Media & Communications",
	designation: "Media Coordinator",
	joiningDate: "2023-06-15",
	permissions: [
		"upload_media",
		"manage_gallery",
		"publish_news",
		"moderate_comments",
		"schedule_posts",
		"archive_content",
		"view_analytics",
		"manage_tags",
	],
	mediaStats: {
		totalImages: 1250,
		totalVideos: 89,
		activeNews: 23,
		totalViews: 45678,
		pendingApprovals: 7,
		scheduledPosts: 12,
		totalLikes: 3456,
		totalShares: 789,
		monthlyUploads: 156,
		storageUsed: 85.5,
		storageLimit: 100,
	},
	recentActivities: [
		{
			id: 1,
			type: "upload",
			description: "uploaded new gallery 'Science Fair 2024'",
			timestamp: "2 hours ago",
			contentId: "GAL001",
			user: "Sarah Johnson",
		},
		{
			id: 2,
			type: "publish",
			description: "published news article 'New Library Wing Opening'",
			timestamp: "4 hours ago",
			contentId: "NEWS045",
			user: "Sarah Johnson",
		},
		{
			id: 3,
			type: "moderate",
			description: "approved 5 comments on Sports Day gallery",
			timestamp: "6 hours ago",
			contentId: "GAL002",
			user: "Sarah Johnson",
		},
		{
			id: 4,
			type: "schedule",
			description: "scheduled announcement for Parent-Teacher Meeting",
			timestamp: "1 day ago",
			contentId: "ANN012",
			user: "Sarah Johnson",
		},
		{
			id: 5,
			type: "archive",
			description: "archived old content from 2023",
			timestamp: "2 days ago",
			contentId: "BATCH001",
			user: "Admin System",
		},
	],
	engagementMetrics: {
		dailyViews: [1200, 1450, 1100, 1650, 1300, 1800, 1550],
		weeklyUploads: [25, 30, 22, 35, 28, 32, 29],
		topCategories: [
			{ name: "Events", count: 145, growth: 12 },
			{ name: "Academic", count: 98, growth: 8 },
			{ name: "Sports", count: 76, growth: 15 },
			{ name: "Infrastructure", count: 45, growth: -3 },
		],
		recentComments: [
			{
				id: "1",
				content:
					"Amazing photos from the science fair! Great quality and coverage.",
				author: "Parent - John Doe",
				contentTitle: "Science Fair 2024 Gallery",
				timestamp: "1 hour ago",
				status: "approved" as const,
			},
			{
				id: "2",
				content: "When will the video of the sports day be available?",
				author: "Parent - Jane Smith",
				contentTitle: "Annual Sports Day",
				timestamp: "3 hours ago",
				status: "pending" as const,
			},
			{
				id: "3",
				content: "Thank you for sharing these wonderful memories!",
				author: "Teacher - Mark Wilson",
				contentTitle: "Graduation Ceremony 2024",
				timestamp: "5 hours ago",
				status: "approved" as const,
			},
		],
	},
};

interface MediaCoordinatorLayoutProps {
	children: React.ReactNode;
}

export default function MediaCoordinatorLayout({
	children,
}: MediaCoordinatorLayoutProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Handle responsive sidebar
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024) {
				setIsSidebarOpen(false);
			} else {
				setIsSidebarOpen(true);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div
				className={`${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} fixed lg:relative lg:translate-x-0 z-30 transition-transform duration-300 ease-in-out`}
			>
				<MediaCoordinatorSidebar
					mediaCoordinatorData={mockMediaCoordinatorData}
				/>
			</div>

			{/* Overlay for mobile */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 lg:hidden z-20"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<MediaCoordinatorHeader
					mediaCoordinatorData={mockMediaCoordinatorData}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>

				{/* Page Content */}
				<main className="flex-1 overflow-auto bg-background">{children}</main>
			</div>
		</div>
	);
}
