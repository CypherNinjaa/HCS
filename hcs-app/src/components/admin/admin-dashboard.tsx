"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AdminOverview } from "./dashboard/admin-overview";
import { LiveAnalytics } from "./dashboard/live-analytics";
import { StudentManagement } from "./dashboard/student-management";
import { TeacherManagementNew as TeacherManagement } from "./dashboard/teacher-management-new";
import { ClassManagement } from "./dashboard/class-management";
import { FeeManagement } from "./dashboard/fee-management";
import { ExamManagement } from "./dashboard/exam-management";
import { TransportRoutes } from "./dashboard/transport-routes";
import { ContentManagement } from "./dashboard/content-management";
import { PaymentGateway } from "./dashboard/payment-gateway";
import {
	RolePermissions,
	MultilingualContent,
	GamificationSystem,
	PushNotifications,
	UserAccountManagement,
	ActivityMonitor,
	SystemSettings,
} from "./dashboard/remaining-components";

interface AdminDashboardProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
}

export function AdminDashboard({
	activeSection,
	setActiveSection,
}: AdminDashboardProps) {
	const renderActiveSection = () => {
		switch (activeSection) {
			case "dashboard":
				return <AdminOverview setActiveSection={setActiveSection} />;
			case "analytics":
				return <LiveAnalytics />;
			case "students":
				return <StudentManagement />;
			case "teachers":
				return <TeacherManagement />;
			case "classes":
				return <ClassManagement />;
			case "fees":
				return <FeeManagement />;
			case "exams":
				return <ExamManagement />;
			case "transport":
				return <TransportRoutes />;
			case "content":
				return <ContentManagement />;
			case "payments":
				return <PaymentGateway />;
			case "permissions":
				return <RolePermissions />;
			case "translations":
				return <MultilingualContent />;
			case "gamification":
				return <GamificationSystem />;
			case "notifications":
				return <PushNotifications />;
			case "user-management":
				return <UserAccountManagement />;
			case "activity-monitor":
				return <ActivityMonitor />;
			case "system-settings":
				return <SystemSettings />;
			default:
				return <AdminOverview setActiveSection={setActiveSection} />;
		}
	};

	return (
		<div className="p-4 lg:p-6 max-w-7xl mx-auto">
			<AnimatePresence mode="wait">
				<motion.div
					key={activeSection}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="w-full"
				>
					{renderActiveSection()}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
