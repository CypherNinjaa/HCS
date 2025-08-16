"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { ClassesSubjects } from "@/components/teacher/classes-subjects";
import { AttendanceDetailed } from "@/components/teacher/attendance-detailed";
import AssignmentsDetailed from "@/components/teacher/assignments-detailed";
import MCQTestsDetailed from "@/components/teacher/mcq-tests-detailed";
import OnlineClassesDetailed from "@/components/teacher/online-classes-detailed";
import MarksEntryDetailed from "@/components/teacher/marks-entry-detailed";
import StudentAnalyticsDetailed from "@/components/teacher/student-analytics-detailed";
import ParentCommunicationDetailed from "@/components/teacher/parent-communication-detailed";
import {
	ExamPapers,
	McqAnalytics,
	Reports,
	GamificationDashboard,
	TeacherLeaderboard,
	AiSuggestions,
} from "@/components/teacher/teacher-components";
import { TeacherRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { UserWithProfile } from "@/types/auth";

interface TeacherData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	subjects: string[];
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

export default function TeacherPortal() {
	const [activeSection, setActiveSection] = useState<string>("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile, sidebar component will handle desktop
	const { user } = useAuth();

	// Convert user data to expected format
	const userWithProfile = user as UserWithProfile;
	const teacherData: TeacherData = {
		id: user?.id || "teacher-1",
		name: userWithProfile?.profile
			? `${userWithProfile.profile.first_name} ${userWithProfile.profile.last_name}`.trim()
			: user?.email.split("@")[0] || "Teacher",
		email: user?.email || "teacher@hcs.edu",
		phone: userWithProfile?.profile?.phone_number || "+91 98765 43210",
		profilePicture:
			userWithProfile?.profile?.avatar_url || "/default-profile.png",
		employeeId: "HCS-T-001", // This would come from staff profile data
		department: "Science", // This would come from staff profile data
		designation: "Senior Teacher", // This would come from staff profile data
		joiningDate: "2020-06-15", // This would come from staff profile data
		subjects: ["Physics", "Chemistry", "Mathematics"], // This would come from staff assignment data
		classes: [
			// This would come from class assignment data
			{
				id: "class-1",
				name: "Class 10",
				section: "A",
				students: 45,
				subjects: ["Physics", "Chemistry"],
			},
			{
				id: "class-2",
				name: "Class 10",
				section: "B",
				students: 42,
				subjects: ["Physics", "Mathematics"],
			},
			{
				id: "class-3",
				name: "Class 9",
				section: "A",
				students: 38,
				subjects: ["Physics"],
			},
		],
	};

	const renderActiveSection = () => {
		switch (activeSection) {
			case "classes-subjects":
				return <ClassesSubjects teacherData={teacherData} />;
			case "attendance":
				return <AttendanceDetailed teacherData={teacherData} />;
			case "assignments":
				return <AssignmentsDetailed teacherData={teacherData} />;
			case "online-classes":
				return <OnlineClassesDetailed teacherData={teacherData} />;
			case "exam-papers":
				return <ExamPapers teacherData={teacherData} />;
			case "marks-entry":
				return <MarksEntryDetailed teacherData={teacherData} />;
			case "analytics":
				return <StudentAnalyticsDetailed teacherData={teacherData} />;
			case "communication":
				return <ParentCommunicationDetailed teacherData={teacherData} />;
			case "mcq-tests":
				return <MCQTestsDetailed teacherData={teacherData} />;
			case "mcq-analytics":
				return <McqAnalytics teacherData={teacherData} />;
			case "reports":
				return <Reports teacherData={teacherData} />;
			case "gamification":
				return <GamificationDashboard teacherData={teacherData} />;
			case "leaderboard":
				return <TeacherLeaderboard teacherData={teacherData} />;
			case "ai-suggestions":
				return <AiSuggestions teacherData={teacherData} />;
			default:
				return <TeacherDashboard teacherData={teacherData} />;
		}
	};

	return (
		<TeacherRoute>
			<div className="min-h-screen bg-background overflow-hidden w-full">
				<TeacherHeader
					teacherData={teacherData}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				<div className="flex h-[calc(100vh-4rem)] w-full">
					<TeacherSidebar
						activeSection={activeSection}
						setActiveSection={setActiveSection}
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>

					<main
						className={`
						flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent w-full
						transition-all duration-300
						${sidebarOpen ? "md:ml-0" : "md:ml-0"}
					`}
					>
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
		</TeacherRoute>
	);
}
