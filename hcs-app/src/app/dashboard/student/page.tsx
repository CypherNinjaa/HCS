"use client";

import { useState } from "react";
import { StudentHeader } from "@/components/student/student-header";
import { StudentSidebar } from "@/components/student/student-sidebar";
import { DashboardOverview } from "@/components/student/dashboard-overview";
import { ClassSchedule } from "@/components/student/class-schedule";
import { AttendanceReports } from "@/components/student/attendance-reports";
import { AssignmentSubmissions } from "@/components/student/assignment-submissions";
import { LiveClasses } from "@/components/student/live-classes";
import { ExamPortal } from "@/components/student/exam-portal";
import { FeeStatus } from "@/components/student/fee-status";
import { Messages } from "@/components/student/messages";
import { ELibrary } from "@/components/student/e-library";
import { LeaveRequests } from "@/components/student/leave-requests";
import { MCQTests } from "@/components/student/mcq-tests";
import { Achievements } from "@/components/student/achievements";
import LearningPaths from "@/components/student/learning-paths";

type ActiveSection =
	| "dashboard"
	| "schedule"
	| "attendance"
	| "assignments"
	| "live-classes"
	| "exams"
	| "fees"
	| "messages"
	| "library"
	| "leave"
	| "mcq"
	| "achievements"
	| "learning";

export default function StudentPortal() {
	const [activeSection, setActiveSection] =
		useState<ActiveSection>("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Mock user data - replace with actual authentication
	const studentData = {
		id: "STU001",
		name: "Alex Johnson",
		class: "Class 10-A",
		rollNumber: "2024001",
		profileImage: "/placeholder-avatar.jpg",
		totalPoints: 2450,
		level: "Gold Scholar",
		attendance: 94.5,
	};

	const renderActiveSection = () => {
		switch (activeSection) {
			case "dashboard":
				return <DashboardOverview studentData={studentData} />;
			case "schedule":
				return <ClassSchedule />;
			case "attendance":
				return <AttendanceReports />;
			case "assignments":
				return <AssignmentSubmissions />;
			case "live-classes":
				return <LiveClasses />;
			case "exams":
				return <ExamPortal />;
			case "fees":
				return <FeeStatus />;
			case "messages":
				return <Messages />;
			case "library":
				return <ELibrary />;
			case "leave":
				return <LeaveRequests />;
			case "mcq":
				return <MCQTests />;
			case "achievements":
				return <Achievements />;
			case "learning":
				return (
					<LearningPaths
						studentData={{
							name: studentData.name,
							class: studentData.class,
							rollNumber: studentData.rollNumber,
							profilePicture: studentData.profileImage,
						}}
					/>
				);
			default:
				return <DashboardOverview studentData={studentData} />;
		}
	};

	return (
		<div className="min-h-screen bg-background overflow-hidden w-full">
			<StudentHeader
				studentData={studentData}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			<div className="flex h-[calc(100vh-4rem)] w-full">
				<StudentSidebar
					activeSection={activeSection}
					setActiveSection={setActiveSection}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				<main className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent w-full">
					<div className="p-4 md:p-6 lg:p-8 pt-10 md:pt-10 lg:pt-24 pb-6 md:pb-8 lg:pb-10 w-full max-w-none">
						{renderActiveSection()}
					</div>
				</main>
			</div>
		</div>
	);
}
