"use client";

import { useState } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminPanel() {
	const [activeSection, setActiveSection] = useState("dashboard");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			<AdminHeader
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<div className="flex">
				<AdminSidebar
					activeSection={activeSection}
					setActiveSection={setActiveSection}
					isOpen={isSidebarOpen}
					setIsOpen={setIsSidebarOpen}
				/>
				<main className="flex-1 lg:ml-64 pt-16 min-h-screen">
					<AdminDashboard
						activeSection={activeSection}
						setActiveSection={setActiveSection}
					/>
				</main>
			</div>
		</div>
	);
}
