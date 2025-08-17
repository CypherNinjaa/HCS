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

	// Mock coordinator data - in real app, this would come from your database
	const coordinatorData: CoordinatorData = {
		id: "coord-001",
		name: "Mrs. Sarah Johnson",
		email: "sarah.johnson@happychildschool.edu",
		phone: "+91-9876543210",
		profilePicture: "/default-profile.svg",
		employeeId: "HCS-COORD-001",
		department: "Academic Coordination",
		designation: "Student Coordinator",
		joiningDate: "2022-06-15",
		permissions: [
			"manage_students",
			"manage_schedules",
			"view_reports",
			"assign_teachers",
			"bulk_operations",
		],
		managedClasses: [
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
			{
				id: "class-9a",
				name: "Class IX",
				section: "A",
				students: 38,
				classTeacher: "Mr. Patel",
				subjects: [
					"Mathematics",
					"Science",
					"English",
					"Hindi",
					"Social Studies",
					"Computer Science",
				],
			},
			{
				id: "class-9b",
				name: "Class IX",
				section: "B",
				students: 36,
				classTeacher: "Mrs. Gupta",
				subjects: [
					"Mathematics",
					"Science",
					"English",
					"Hindi",
					"Social Studies",
					"Computer Science",
				],
			},
			{
				id: "class-10a",
				name: "Class X",
				section: "A",
				students: 40,
				classTeacher: "Mr. Singh",
				subjects: [
					"Mathematics",
					"Science",
					"English",
					"Hindi",
					"Social Studies",
					"Computer Science",
				],
			},
		],
		managedTeachers: [
			{
				id: "teacher-001",
				name: "Mr. Rajesh Kumar",
				email: "rajesh.kumar@school.edu",
				subjects: ["Mathematics", "Physics"],
				classes: ["Class VIII-A", "Class IX-A", "Class X-A"],
			},
			{
				id: "teacher-002",
				name: "Mrs. Priya Sharma",
				email: "priya.sharma@school.edu",
				subjects: ["English", "Literature"],
				classes: ["Class VIII-B", "Class IX-B"],
			},
			{
				id: "teacher-003",
				name: "Mr. Amit Patel",
				email: "amit.patel@school.edu",
				subjects: ["Science", "Chemistry"],
				classes: ["Class IX-A", "Class X-A"],
			},
			{
				id: "teacher-004",
				name: "Mrs. Neha Gupta",
				email: "neha.gupta@school.edu",
				subjects: ["Hindi", "Social Studies"],
				classes: ["Class VIII-A", "Class IX-B", "Class X-A"],
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
	);
}
