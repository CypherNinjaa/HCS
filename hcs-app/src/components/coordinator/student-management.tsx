"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Users,
	Search,
	Eye,
	Edit,
	Mail,
	Phone,
	Calendar,
	GraduationCap,
	TrendingUp,
} from "lucide-react";

interface Student {
	id: string;
	name: string;
	rollNumber: string;
	class: string;
	section: string;
	email: string;
	phone: string;
	parentName: string;
	parentPhone: string;
	attendance: number;
	performance: number;
	status: "active" | "inactive" | "transferred";
	admissionDate: string;
	bloodGroup: string;
	address: string;
}

interface CoordinatorData {
	managedClasses: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		classTeacher: string;
		subjects: string[];
	}>;
}

interface StudentManagementProps {
	coordinatorData: CoordinatorData;
}

export function StudentManagement({ coordinatorData }: StudentManagementProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [showDetails, setShowDetails] = useState(false);

	// Mock student data
	const [students] = useState<Student[]>([
		{
			id: "std-001",
			name: "Aarav Sharma",
			rollNumber: "8A001",
			class: "VIII",
			section: "A",
			email: "aarav.sharma@email.com",
			phone: "+91-9876543210",
			parentName: "Mr. Rajesh Sharma",
			parentPhone: "+91-9876543211",
			attendance: 92,
			performance: 85,
			status: "active",
			admissionDate: "2023-04-15",
			bloodGroup: "B+",
			address: "123 ABC Colony, Delhi",
		},
		{
			id: "std-002",
			name: "Priya Patel",
			rollNumber: "8A002",
			class: "VIII",
			section: "A",
			email: "priya.patel@email.com",
			phone: "+91-9876543212",
			parentName: "Mrs. Sunita Patel",
			parentPhone: "+91-9876543213",
			attendance: 95,
			performance: 92,
			status: "active",
			admissionDate: "2023-04-10",
			bloodGroup: "A+",
			address: "456 XYZ Road, Mumbai",
		},
		{
			id: "std-003",
			name: "Rohit Kumar",
			rollNumber: "9A001",
			class: "IX",
			section: "A",
			email: "rohit.kumar@email.com",
			phone: "+91-9876543214",
			parentName: "Mr. Suresh Kumar",
			parentPhone: "+91-9876543215",
			attendance: 88,
			performance: 78,
			status: "active",
			admissionDate: "2022-04-20",
			bloodGroup: "O+",
			address: "789 PQR Street, Pune",
		},
		{
			id: "std-004",
			name: "Anita Singh",
			rollNumber: "10A001",
			class: "X",
			section: "A",
			email: "anita.singh@email.com",
			phone: "+91-9876543216",
			parentName: "Mrs. Kavita Singh",
			parentPhone: "+91-9876543217",
			attendance: 94,
			performance: 89,
			status: "active",
			admissionDate: "2021-04-25",
			bloodGroup: "AB+",
			address: "321 LMN Avenue, Bangalore",
		},
	]);

	const filteredStudents = students.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesClass =
			selectedClass === "all" ||
			`${student.class}-${student.section}` === selectedClass;
		const matchesStatus =
			selectedStatus === "all" || student.status === selectedStatus;

		return matchesSearch && matchesClass && matchesStatus;
	});

	const handleViewDetails = (student: Student) => {
		setSelectedStudent(student);
		setShowDetails(true);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "inactive":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
			case "transferred":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
		}
	};

	const getPerformanceColor = (performance: number) => {
		if (performance >= 90) return "text-green-600 dark:text-green-400";
		if (performance >= 75) return "text-blue-600 dark:text-blue-400";
		if (performance >= 60) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Student Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						View and manage student information
					</p>
				</div>
				<div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
					Total Students: {filteredStudents.length}
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Search Students
						</label>
						<div className="relative">
							<Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search by name, roll number, or email..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Filter by Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="all">All Classes</option>
							{coordinatorData.managedClasses.map((cls) => (
								<option
									key={cls.id}
									value={`${cls.name.split(" ")[1]}-${cls.section}`}
								>
									{cls.name} - {cls.section}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Filter by Status
						</label>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="transferred">Transferred</option>
						</select>
					</div>
				</div>
			</div>

			{/* Students Table */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Users className="h-5 w-5" />
						Student List ({filteredStudents.length})
					</h2>
				</div>

				{filteredStudents.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Student
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Class
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Contact
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Performance
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{filteredStudents.map((student, index) => (
									<motion.tr
										key={student.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
										className="hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
													<span className="text-white font-semibold text-sm">
														{student.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</span>
												</div>
												<div className="ml-4">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{student.name}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														Roll: {student.rollNumber}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<GraduationCap className="h-4 w-4 text-blue-500" />
												<span className="text-sm text-gray-900 dark:text-white">
													{student.class} - {student.section}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
													<Mail className="h-3 w-3 text-gray-400" />
													{student.email}
												</div>
												<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
													<Phone className="h-3 w-3 text-gray-400" />
													{student.phone}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<TrendingUp className="h-4 w-4 text-gray-400" />
													<span
														className={`text-sm font-medium ${getPerformanceColor(
															student.performance
														)}`}
													>
														{student.performance}%
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-gray-400" />
													<span className="text-sm text-gray-500 dark:text-gray-400">
														{student.attendance}% attendance
													</span>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
													student.status
												)}`}
											>
												{student.status.charAt(0).toUpperCase() +
													student.status.slice(1)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex gap-2">
												<button
													onClick={() => handleViewDetails(student)}
													className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
												>
													<Eye className="h-4 w-4" />
												</button>
												<button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
													<Edit className="h-4 w-4" />
												</button>
											</div>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No students found
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							Try adjusting your search or filter criteria.
						</p>
					</div>
				)}
			</div>

			{/* Student Details Modal */}
			{showDetails && selectedStudent && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
					>
						<div className="flex justify-between items-start mb-6">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								Student Details
							</h3>
							<button
								onClick={() => setShowDetails(false)}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Student Info */}
							<div className="space-y-4">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
										<span className="text-white font-bold text-lg">
											{selectedStudent.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</span>
									</div>
									<div>
										<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
											{selectedStudent.name}
										</h4>
										<p className="text-gray-500 dark:text-gray-400">
											{selectedStudent.class} - {selectedStudent.section} •
											Roll: {selectedStudent.rollNumber}
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Email
										</label>
										<p className="text-gray-900 dark:text-white">
											{selectedStudent.email}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Phone
										</label>
										<p className="text-gray-900 dark:text-white">
											{selectedStudent.phone}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Blood Group
										</label>
										<p className="text-gray-900 dark:text-white">
											{selectedStudent.bloodGroup}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Admission Date
										</label>
										<p className="text-gray-900 dark:text-white">
											{selectedStudent.admissionDate}
										</p>
									</div>
								</div>
							</div>

							{/* Parent Info & Performance */}
							<div className="space-y-4">
								<div>
									<h5 className="font-semibold text-gray-900 dark:text-white mb-3">
										Parent Information
									</h5>
									<div className="space-y-2">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
												Parent Name
											</label>
											<p className="text-gray-900 dark:text-white">
												{selectedStudent.parentName}
											</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
												Parent Phone
											</label>
											<p className="text-gray-900 dark:text-white">
												{selectedStudent.parentPhone}
											</p>
										</div>
									</div>
								</div>

								<div>
									<h5 className="font-semibold text-gray-900 dark:text-white mb-3">
										Academic Performance
									</h5>
									<div className="space-y-3">
										<div>
											<div className="flex justify-between text-sm mb-1">
												<span className="text-gray-600 dark:text-gray-400">
													Overall Performance
												</span>
												<span
													className={`font-medium ${getPerformanceColor(
														selectedStudent.performance
													)}`}
												>
													{selectedStudent.performance}%
												</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
												<div
													className="bg-blue-500 h-2 rounded-full transition-all duration-300"
													style={{ width: `${selectedStudent.performance}%` }}
												/>
											</div>
										</div>
										<div>
											<div className="flex justify-between text-sm mb-1">
												<span className="text-gray-600 dark:text-gray-400">
													Attendance
												</span>
												<span className="font-medium text-green-600 dark:text-green-400">
													{selectedStudent.attendance}%
												</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
												<div
													className="bg-green-500 h-2 rounded-full transition-all duration-300"
													style={{ width: `${selectedStudent.attendance}%` }}
												/>
											</div>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
										Address
									</label>
									<p className="text-gray-900 dark:text-white">
										{selectedStudent.address}
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-4 mt-6">
							<button
								onClick={() => setShowDetails(false)}
								className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
							>
								Close
							</button>
							<button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
								Edit Student
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
