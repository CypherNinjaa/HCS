"use client";

import { LibrarianDashboard } from "@/components/librarian/librarian-dashboard";
import { LibrarianHeader } from "@/components/librarian/librarian-header";
import { LibrarianSidebar } from "@/components/librarian/librarian-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { UserWithProfile } from "@/types/auth";

export default function LibrarianDashboardPage() {
	const { user } = useAuth();

	// Convert user data to expected format
	const userWithProfile = user as UserWithProfile;
	const mockLibrarianData = {
		id: user?.id || "lib_001",
		name: userWithProfile?.profile
			? `${userWithProfile.profile.first_name} ${userWithProfile.profile.last_name}`.trim()
			: user?.email.split("@")[0] || "Librarian",
		email: user?.email || "librarian@hcs.edu",
		phone: userWithProfile?.profile?.phone_number || "+91 98765 43210",
		profilePicture:
			userWithProfile?.profile?.avatar_url || "/default-profile.png",
		employeeId: "LIB001", // This would come from staff profile data
		department: "Library Services", // This would come from staff profile data
		designation: "Chief Librarian", // This would come from staff profile data
		joiningDate: "2020-08-15", // This would come from staff profile data
		permissions: [
			// This would come from role permissions data
			"manage_books",
			"track_issues",
			"generate_reports",
			"manage_fines",
			"access_digital_room",
		],
		libraryStats: {
			// This would come from library analytics data
			totalBooks: 15420,
			issuedBooks: 1250,
			overdueBooks: 85,
			reservedBooks: 45,
			activeMembers: 2840,
			finesCollected: 12500,
		},
		recentActivities: [
			// This would come from library transaction data
			{
				id: 1,
				type: "book_issue",
				description: "Mathematics Grade 10 issued to Rahul Sharma",
				timestamp: "2025-01-14T10:30:00Z",
				studentId: "STU001",
			},
			{
				id: 2,
				type: "book_return",
				description: "Science Textbook returned by Priya Singh",
				timestamp: "2025-01-14T09:15:00Z",
				studentId: "STU002",
			},
			{
				id: 3,
				type: "fine_collection",
				description: "₹50 fine collected from Amit Kumar",
				timestamp: "2025-01-14T08:45:00Z",
				studentId: "STU003",
			},
		],
	};

	return (
		<ProtectedRoute requiredRoles={["admin", "librarian"]}>
			<div className="min-h-screen bg-background">
				<div className="flex h-screen">
					{/* Sidebar */}
					<LibrarianSidebar librarianData={mockLibrarianData} />

					{/* Main Content */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* Header */}
						<LibrarianHeader librarianData={mockLibrarianData} />

						{/* Dashboard Content */}
						<main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
							<LibrarianDashboard librarianData={mockLibrarianData} />
						</main>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
