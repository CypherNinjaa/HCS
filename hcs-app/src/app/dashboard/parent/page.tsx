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

	// Sample parent data
	const parentData: ParentData = {
		name: "Priya Sharma",
		relation: "Mother",
		email: "priya.sharma@email.com",
		phone: "+91 98765 43210",
		profilePicture: "/api/placeholder/150/150",
		children: [
			{
				id: "child-1",
				name: "Arjun Sharma",
				class: "Class 10-A",
				rollNumber: "23001",
				profilePicture: "/api/placeholder/100/100",
				section: "A",
			},
			{
				id: "child-2",
				name: "Ananya Sharma",
				class: "Class 7-B",
				rollNumber: "23155",
				profilePicture: "/api/placeholder/100/100",
				section: "B",
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
	);
}
