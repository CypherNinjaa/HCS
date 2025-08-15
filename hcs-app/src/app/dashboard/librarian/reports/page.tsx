import { LibrarianHeader } from "@/components/librarian/librarian-header";
import { LibrarianSidebar } from "@/components/librarian/librarian-sidebar";
import { ReportsAnalytics } from "@/components/librarian/reports-analytics";

const librarianData = {
	id: "LIB001",
	name: "Dr. Anjali Sharma",
	email: "anjali.sharma@hcs.edu",
	phone: "+91 98765 43210",
	profilePicture: "/default-profile.png",
	employeeId: "EMP001",
	department: "Library Services",
	designation: "Chief Librarian",
	joiningDate: "2020-01-15",
	permissions: ["all"],
	libraryStats: {
		totalBooks: 15420,
		issuedBooks: 1250,
		overdueBooks: 87,
		reservedBooks: 45,
		activeMembers: 2890,
		finesCollected: 12500,
	},
	recentActivities: [
		{
			id: 1,
			type: "book_issued",
			description: "Issued 'Advanced Mathematics' to Rahul Sharma",
			timestamp: "2025-01-14T10:30:00Z",
			studentId: "STU001",
		},
		{
			id: 2,
			type: "book_returned",
			description: "Received 'Science Textbook' from Priya Singh",
			timestamp: "2025-01-14T09:15:00Z",
			studentId: "STU002",
		},
		{
			id: 3,
			type: "fine_collected",
			description: "Collected ₹50 fine from Amit Kumar",
			timestamp: "2025-01-14T08:45:00Z",
			studentId: "STU003",
		},
	],
};

export default function ReportsPage() {
	return (
		<div className="min-h-screen bg-background">
			<LibrarianHeader librarianData={librarianData} />
			<div className="flex">
				<LibrarianSidebar librarianData={librarianData} />
				<main className="flex-1 p-6 lg:ml-64">
					<ReportsAnalytics />
				</main>
			</div>
		</div>
	);
}
