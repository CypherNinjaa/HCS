"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CoordinatorHeader } from "@/components/coordinator/coordinator-header";
import { CoordinatorSidebar } from "@/components/coordinator/coordinator-sidebar";
import { CoordinatorDashboard } from "@/components/coordinator/coordinator-dashboard";
import { ClassScheduleManagement } from "@/components/coordinator/class-schedule-management";
import { StudentManagement } from "@/components/coordinator/student-management";
import { StudentPromotionDemotion } from "@/components/coordinator/student-promotion-demotion";
import { BulkStudentOperations } from "@/components/coordinator/bulk-student-operations";
import { AddNewStudent } from "@/components/coordinator/add-new-student";
import { RemoveStudent } from "@/components/coordinator/remove-student";
import { AssignmentProgress } from "@/components/coordinator/assignment-progress";
import { SubstituteTeachers } from "@/components/coordinator/substitute-teachers";
import { AcademicProgressSummary } from "@/components/coordinator/academic-progress-summary";
import { ExtracurricularTracking } from "@/components/coordinator/extracurricular-tracking";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { UserWithProfile } from "@/types/auth";

interface CoordinatorData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	permissions: string[];
	managedClasses: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		classTeacher: string;
		subjects: string[];
	}>;
	managedTeachers: Array<{
		id: string;
		name: string;
		email: string;
		subjects: string[];
		classes: string[];
	}>;
}

export default function CoordinatorPortal() {
	const [activeSection, setActiveSection] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true so sidebar is visible by default
	const { user } = useAuth();

	// Handle responsive sidebar behavior
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setSidebarOpen(true); // Always open on large screens
			} else {
				setSidebarOpen(false); // Closed on mobile
			}
		};

		// Set initial state
		handleResize();

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Convert user data to expected format
	const userWithProfile = user as UserWithProfile;
	const coordinatorData: CoordinatorData = {
		id: user?.id || "coord-001",
		name: userWithProfile?.profile
			? `${userWithProfile.profile.first_name} ${userWithProfile.profile.last_name}`.trim()
			: user?.email.split("@")[0] || "Coordinator",
		email: user?.email || "coordinator@hcs.edu",
		phone: userWithProfile?.profile?.phone_number || "+91-9876543210",
		profilePicture:
			userWithProfile?.profile?.avatar_url || "/default-profile.svg",
		employeeId: "HCS-COORD-001", // This would come from staff profile data
		department: "Academic Coordination", // This would come from staff profile data
		designation: "Student Coordinator", // This would come from staff profile data
		joiningDate: "2022-06-15", // This would come from staff profile data
		permissions: [
			// This would come from role permissions data
			"manage_students",
			"manage_schedules",
			"view_reports",
			"assign_teachers",
			"bulk_operations",
		],
		managedClasses: [
			// This would come from coordinator assignment data
			{
				id: "class-8a",
				name: "Class VIII",
				section: "A",
				students: 35,
				classTeacher: "Mr. Kumar",
				subjects: [
					"Mathematics",
					"Science",
					"English",
					"Hindi",
					"Social Studies",
				],
			},
			{
				id: "class-8b",
				name: "Class VIII",
				section: "B",
				students: 32,
				classTeacher: "Mrs. Sharma",
				subjects: [
					"Mathematics",
					"Science",
					"English",
					"Hindi",
					"Social Studies",
				],
			},
		],
		managedTeachers: [
			// This would come from coordinator assignment data
			{
				id: "teacher-001",
				name: "Mr. Rajesh Kumar",
				email: "rajesh.kumar@school.edu",
				subjects: ["Mathematics", "Physics"],
				classes: ["Class VIII-A", "Class IX-A", "Class X-A"],
			},
		],
	};

	const renderActiveSection = () => {
		switch (activeSection) {
			case "dashboard":
				return <CoordinatorDashboard coordinatorData={coordinatorData} />;
			case "class-schedules":
				return <ClassScheduleManagement coordinatorData={coordinatorData} />;
			case "student-management":
				return <StudentManagement coordinatorData={coordinatorData} />;
			case "promotion-demotion":
				return <StudentPromotionDemotion coordinatorData={coordinatorData} />;
			case "bulk-operations":
				return <BulkStudentOperations coordinatorData={coordinatorData} />;
			case "add-student":
				return <AddNewStudent coordinatorData={coordinatorData} />;
			case "remove-student":
				return <RemoveStudent coordinatorData={coordinatorData} />;
			case "assignment-progress":
				return <AssignmentProgress coordinatorData={coordinatorData} />;
			case "substitute-teachers":
				return <SubstituteTeachers coordinatorData={coordinatorData} />;
			case "academic-summary":
				return <AcademicProgressSummary coordinatorData={coordinatorData} />;
			case "extracurricular":
				return <ExtracurricularTracking coordinatorData={coordinatorData} />;
			default:
				return <CoordinatorDashboard coordinatorData={coordinatorData} />;
		}
	};

	return (
		<ProtectedRoute requiredRoles={["admin", "coordinator"]}>
			<div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
				{/* Header */}
				<CoordinatorHeader
					coordinatorData={coordinatorData}
					onMenuClick={() => setSidebarOpen(!sidebarOpen)}
				/>

				<div className="flex h-[calc(100vh-4rem)]">
					{/* Sidebar */}
					<CoordinatorSidebar
						activeSection={activeSection}
						setActiveSection={setActiveSection}
						isOpen={sidebarOpen}
						setIsOpen={setSidebarOpen}
					/>

					{/* Main Content */}
					<main className="flex-1 lg:ml-64 transition-all duration-300 overflow-y-auto">
						<div className="p-4 lg:p-6">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="max-w-7xl mx-auto"
							>
								{renderActiveSection()}
							</motion.div>
						</div>
					</main>
				</div>

				{/* Mobile sidebar overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}
			</div>
		</ProtectedRoute>
	);
}
