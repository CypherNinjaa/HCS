"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ParentHeader } from "@/components/parent/parent-header";
import { ParentSidebar } from "@/components/parent/parent-sidebar";
import { ParentDashboard } from "@/components/parent/parent-dashboard";
import { AcademicProgress } from "@/components/parent/academic-progress";
import { AttendanceSummary } from "@/components/parent/attendance-summary";
import { AssignmentTracking } from "@/components/parent/assignment-tracking";
import { TeacherCommunication } from "@/components/parent/teacher-communication";
import { FeePayment } from "@/components/parent/fee-payment";
import { CircularDownloads } from "@/components/parent/circular-downloads";
import { LeaveApplications } from "@/components/parent/leave-applications";
import { EventRating } from "@/components/parent/event-rating";
import { ParentRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { UserWithProfile } from "@/types/auth";

interface ParentData {
	name: string;
	relation: string;
	email: string;
	phone: string;
	profilePicture: string;
	children: Array<{
		id: string;
		name: string;
		class: string;
		rollNumber: string;
		profilePicture: string;
		section: string;
	}>;
}

export default function ParentPortal() {
	const [activeSection, setActiveSection] = useState<string>("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedChild, setSelectedChild] = useState<string>("child-1");
	const { user } = useAuth();

	// Convert user data to expected format
	const userWithProfile = user as UserWithProfile;
	const parentData: ParentData = {
		name: userWithProfile?.profile
			? `${userWithProfile.profile.first_name} ${userWithProfile.profile.last_name}`.trim()
			: user?.email.split("@")[0] || "Parent",
		relation: "Parent", // This would come from parent profile data
		email: user?.email || "parent@hcs.edu",
		phone: userWithProfile?.profile?.phone_number || "+91 98765 43210",
		profilePicture:
			userWithProfile?.profile?.avatar_url || "/default-profile.png",
		children: [
			// This would come from parent-child relationship data
			{
				id: "child-1",
				name: "Child Name",
				class: "Class 10-A",
				rollNumber: "23001",
				profilePicture: "/default-profile.png",
				section: "A",
			},
		],
	};

	const renderActiveSection = () => {
		switch (activeSection) {
			case "academic-progress":
				return <AcademicProgress selectedChild={selectedChild} />;
			case "attendance":
				return <AttendanceSummary selectedChild={selectedChild} />;
			case "assignments":
				return <AssignmentTracking selectedChild={selectedChild} />;
			case "communication":
				return <TeacherCommunication selectedChild={selectedChild} />;
			case "fee-payment":
				return <FeePayment selectedChild={selectedChild} />;
			case "circulars":
				return <CircularDownloads selectedChild={selectedChild} />;
			case "leave-applications":
				return <LeaveApplications selectedChild={selectedChild} />;
			case "event-rating":
				return <EventRating selectedChild={selectedChild} />;
			default:
				return (
					<ParentDashboard
						parentData={parentData}
						selectedChild={selectedChild}
					/>
				);
		}
	};

	return (
		<ParentRoute>
			<div className="min-h-screen bg-background overflow-hidden w-full">
				<ParentHeader
					parentData={parentData}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					selectedChild={selectedChild}
					setSelectedChild={setSelectedChild}
				/>

				<div className="flex h-[calc(100vh-4rem)] w-full">
					<ParentSidebar
						activeSection={activeSection}
						setActiveSection={setActiveSection}
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>

					<main className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent w-full">
						<div className="p-4 md:p-6 lg:p-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-8 lg:pb-10 w-full max-w-none">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								{renderActiveSection()}
							</motion.div>
						</div>
					</main>
				</div>
			</div>
		</ParentRoute>
	);
}
