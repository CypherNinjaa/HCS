"use client";

import React, { useState, useMemo } from "react";
import {
	Search,
	Trash2,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Eye,
	Download,
} from "lucide-react";

interface Student {
	id: string;
	studentId: string;
	name: string;
	class: string;
	section: string;
	rollNumber: string;
	admissionDate: string;
	guardianName: string;
	guardianPhone: string;
	email: string;
	status: "active" | "suspended" | "dropout";
	reason?: string;
	academicPerformance: number;
	attendancePercentage: number;
	disciplinaryIssues: number;
	lastActiveDate: string;
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

interface RemoveStudentProps {
	coordinatorData: CoordinatorData;
}

export function RemoveStudent({}: RemoveStudentProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [removalReason, setRemovalReason] = useState("");
	const [effectiveDate, setEffectiveDate] = useState("");
	const [generateTC, setGenerateTC] = useState(true);

	const mockStudents = useMemo(
		(): Student[] => [
			{
				id: "1",
				studentId: "STU001",
				name: "Arjun Patel",
				class: "10",
				section: "A",
				rollNumber: "01",
				admissionDate: "2022-04-15",
				guardianName: "Rajesh Patel",
				guardianPhone: "+91 98765 43210",
				email: "arjun.patel@email.com",
				status: "active",
				academicPerformance: 85,
				attendancePercentage: 92,
				disciplinaryIssues: 0,
				lastActiveDate: "2024-01-15",
			},
			{
				id: "2",
				studentId: "STU002",
				name: "Priya Sharma",
				class: "9",
				section: "B",
				rollNumber: "15",
				admissionDate: "2021-06-20",
				guardianName: "Suresh Sharma",
				guardianPhone: "+91 87654 32109",
				email: "priya.sharma@email.com",
				status: "suspended",
				reason: "Disciplinary issues",
				academicPerformance: 65,
				attendancePercentage: 78,
				disciplinaryIssues: 3,
				lastActiveDate: "2024-01-10",
			},
			{
				id: "3",
				studentId: "STU003",
				name: "Rahul Kumar",
				class: "11",
				section: "A",
				rollNumber: "08",
				admissionDate: "2020-04-10",
				guardianName: "Amit Kumar",
				guardianPhone: "+91 76543 21098",
				email: "rahul.kumar@email.com",
				status: "dropout",
				reason: "Financial constraints",
				academicPerformance: 72,
				attendancePercentage: 85,
				disciplinaryIssues: 1,
				lastActiveDate: "2023-12-15",
			},
			{
				id: "4",
				studentId: "STU004",
				name: "Sneha Reddy",
				class: "12",
				section: "C",
				rollNumber: "12",
				admissionDate: "2019-07-05",
				guardianName: "Venkat Reddy",
				guardianPhone: "+91 65432 10987",
				email: "sneha.reddy@email.com",
				status: "active",
				academicPerformance: 95,
				attendancePercentage: 98,
				disciplinaryIssues: 0,
				lastActiveDate: "2024-01-15",
			},
			{
				id: "5",
				studentId: "STU005",
				name: "Vikram Singh",
				class: "8",
				section: "A",
				rollNumber: "20",
				admissionDate: "2022-08-12",
				guardianName: "Rajesh Singh",
				guardianPhone: "+91 54321 09876",
				email: "vikram.singh@email.com",
				status: "active",
				academicPerformance: 78,
				attendancePercentage: 88,
				disciplinaryIssues: 2,
				lastActiveDate: "2024-01-14",
			},
		],
		[]
	);

	const classes = useMemo(() => ["6", "7", "8", "9", "10", "11", "12"], []);

	const filteredStudents = useMemo(() => {
		return mockStudents.filter((student) => {
			const matchesSearch =
				student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesClass =
				selectedClass === "all" || student.class === selectedClass;
			const matchesStatus =
				selectedStatus === "all" || student.status === selectedStatus;

			return matchesSearch && matchesClass && matchesStatus;
		});
	}, [mockStudents, searchTerm, selectedClass, selectedStatus]);

	const handleRemoveStudent = (student: Student) => {
		setSelectedStudent(student);
		setShowConfirmDialog(true);
		setEffectiveDate(new Date().toISOString().split("T")[0]);
	};

	const confirmRemoval = () => {
		if (selectedStudent && removalReason && effectiveDate) {
			// Here you would typically make an API call to remove the student
			console.log("Removing student:", {
				student: selectedStudent,
				reason: removalReason,
				effectiveDate,
				generateTC,
			});

			setShowConfirmDialog(false);
			setSelectedStudent(null);
			setRemovalReason("");
			setEffectiveDate("");
			setGenerateTC(true);

			// Show success message (you might want to use a toast notification)
			alert("Student removed successfully!");
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "suspended":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "dropout":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getPerformanceColor = (score: number) => {
		if (score >= 90) return "text-green-600 dark:text-green-400";
		if (score >= 75) return "text-blue-600 dark:text-blue-400";
		if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Remove Student
				</h2>
				<div className="flex gap-3">
					<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
						<Download className="w-4 h-4" />
						Export Report
					</button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search students..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
					</div>

					<select
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Classes</option>
						{classes.map((cls) => (
							<option key={cls} value={cls}>
								Class {cls}
							</option>
						))}
					</select>

					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="suspended">Suspended</option>
						<option value="dropout">Dropout</option>
					</select>

					<div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
						Showing {filteredStudents.length} students
					</div>
				</div>
			</div>

			{/* Students List */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Student
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Class & Section
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Performance
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Attendance
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Guardian
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{filteredStudents.map((student) => (
								<tr
									key={student.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{student.name}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												ID: {student.studentId} | Roll: {student.rollNumber}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											Class {student.class} - {student.section}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div
											className={`text-sm font-medium ${getPerformanceColor(
												student.academicPerformance
											)}`}
										>
											{student.academicPerformance}%
										</div>
										{student.disciplinaryIssues > 0 && (
											<div className="text-xs text-red-600 dark:text-red-400">
												{student.disciplinaryIssues} issues
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div
											className={`text-sm ${getPerformanceColor(
												student.attendancePercentage
											)}`}
										>
											{student.attendancePercentage}%
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												student.status
											)}`}
										>
											{student.status.charAt(0).toUpperCase() +
												student.status.slice(1)}
										</span>
										{student.reason && (
											<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
												{student.reason}
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 dark:text-white">
											{student.guardianName}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{student.guardianPhone}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
											<button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
												<Eye className="w-4 h-4" />
											</button>
											<button
												onClick={() => handleRemoveStudent(student)}
												className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
												disabled={student.status === "dropout"}
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Confirmation Dialog */}
			{showConfirmDialog && selectedStudent && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
						<div className="flex items-center gap-3 mb-4">
							<AlertTriangle className="w-6 h-6 text-red-600" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Confirm Student Removal
							</h3>
						</div>

						<div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
								Student Details:
							</p>
							<p className="font-medium text-gray-900 dark:text-white">
								{selectedStudent.name}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Class {selectedStudent.class}-{selectedStudent.section} | ID:{" "}
								{selectedStudent.studentId}
							</p>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Reason for Removal *
								</label>
								<select
									value={removalReason}
									onChange={(e) => setRemovalReason(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									required
								>
									<option value="">Select reason...</option>
									<option value="transfer">Transfer to another school</option>
									<option value="expulsion">Disciplinary expulsion</option>
									<option value="dropout">Student dropout</option>
									<option value="financial">Financial constraints</option>
									<option value="medical">Medical reasons</option>
									<option value="family_relocation">Family relocation</option>
									<option value="academic_performance">
										Poor academic performance
									</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Effective Date *
								</label>
								<input
									type="date"
									value={effectiveDate}
									onChange={(e) => setEffectiveDate(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									required
								/>
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="generateTC"
									checked={generateTC}
									onChange={(e) => setGenerateTC(e.target.checked)}
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
								/>
								<label
									htmlFor="generateTC"
									className="ml-2 text-sm text-gray-700 dark:text-gray-300"
								>
									Generate Transfer Certificate (TC)
								</label>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={() => {
									setShowConfirmDialog(false);
									setSelectedStudent(null);
									setRemovalReason("");
									setEffectiveDate("");
									setGenerateTC(true);
								}}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
							>
								<XCircle className="w-4 h-4" />
								Cancel
							</button>
							<button
								onClick={confirmRemoval}
								disabled={!removalReason || !effectiveDate}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
							>
								<CheckCircle className="w-4 h-4" />
								Confirm Removal
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
