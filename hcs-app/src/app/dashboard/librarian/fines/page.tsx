import { FineManagement } from "@/components/librarian/fine-management";
import { LibrarianHeader } from "@/components/librarian/librarian-header";
import { LibrarianSidebar } from "@/components/librarian/librarian-sidebar";

// Mock data - replace with actual data fetching
const mockLibrarianData = {
	id: "lib_001",
	name: "Dr. Anjali Sharma",
	email: "anjali.sharma@happychildschool.edu",
	phone: "+91 98765 43210",
	profilePicture: "/default-profile.png",
	employeeId: "LIB001",
	department: "Library Services",
	designation: "Chief Librarian",
	joiningDate: "2020-08-15",
	permissions: [
		"manage_books",
		"track_issues",
		"generate_reports",
		"manage_fines",
		"access_digital_room",
	],
	libraryStats: {
		totalBooks: 15420,
		issuedBooks: 1250,
		overdueBooks: 85,
		reservedBooks: 45,
		activeMembers: 2840,
		finesCollected: 12500,
	},
	recentActivities: [
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

export default function FineManagementPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="flex h-screen">
				{/* Sidebar */}
				<LibrarianSidebar librarianData={mockLibrarianData} />

				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Header */}
					<LibrarianHeader librarianData={mockLibrarianData} />

					{/* Page Content */}
					<main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
						<FineManagement librarianData={mockLibrarianData} />
					</main>
				</div>
			</div>
		</div>
	);
}
