"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, X, Search } from "lucide-react";

interface Student {
	id: string;
	name: string;
	rollNumber: string;
	profilePicture?: string;
	present: boolean | null;
}

interface Class {
	id: string;
	name: string;
	section: string;
	students: number;
	subjects: string[];
}

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
	classes: Class[];
}

interface AttendanceDetailedProps {
	teacherData: TeacherData;
}

export function AttendanceDetailed({ teacherData }: AttendanceDetailedProps) {
	const [selectedClass, setSelectedClass] = useState<Class | null>(
		teacherData.classes[0] || null
	);
	const [currentDate, setCurrentDate] = useState(
		new Date().toISOString().split("T")[0]
	);

	// Generate mock students for the selected class
	const generateStudents = (classData: Class): Student[] => {
		const students: Student[] = [];
		for (let i = 1; i <= classData.students; i++) {
			students.push({
				id: `student-${classData.id}-${i}`,
				name: `Student ${i.toString().padStart(2, "0")}`,
				rollNumber: `${classData.name.replace("Class ", "")}-${
					classData.section
				}-${i.toString().padStart(3, "0")}`,
				present: null,
			});
		}
		return students;
	};

	const [students, setStudents] = useState<Student[]>(
		selectedClass ? generateStudents(selectedClass) : []
	);
	const [searchTerm, setSearchTerm] = useState("");

	const markAttendance = (studentId: string, isPresent: boolean) => {
		setStudents((prev) =>
			prev.map((student) =>
				student.id === studentId ? { ...student, present: isPresent } : student
			)
		);
	};

	const markAllPresent = () => {
		setStudents((prev) =>
			prev.map((student) => ({ ...student, present: true }))
		);
	};

	const markAllAbsent = () => {
		setStudents((prev) =>
			prev.map((student) => ({ ...student, present: false }))
		);
	};

	const submitAttendance = () => {
		const attendanceData = {
			classId: selectedClass?.id,
			date: currentDate,
			attendance: students.map((s) => ({
				studentId: s.id,
				present: s.present,
			})),
		};
		console.log("Submitting attendance:", attendanceData);
		// Here you would send to API
		alert("Attendance submitted successfully!");
	};

	const filteredStudents = students.filter(
		(student) =>
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const presentCount = students.filter((s) => s.present === true).length;
	const absentCount = students.filter((s) => s.present === false).length;
	const unmarkedCount = students.filter((s) => s.present === null).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">
					Attendance Marking ✅
				</h1>
				<p className="text-purple-100">
					Quick and easy attendance for all your classes
				</p>
			</motion.div>

			{/* Class Selection & Date */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="p-4 bg-white dark:bg-gray-800">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Select Class
					</label>
					<select
						value={selectedClass?.id || ""}
						onChange={(e) => {
							const classData = teacherData.classes.find(
								(c) => c.id === e.target.value
							);
							setSelectedClass(classData || null);
							setStudents(classData ? generateStudents(classData) : []);
						}}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					>
						{teacherData.classes.map((cls) => (
							<option key={cls.id} value={cls.id}>
								{cls.name} - {cls.section} ({cls.subjects.join(", ")})
							</option>
						))}
					</select>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Date
					</label>
					<input
						type="date"
						value={currentDate}
						onChange={(e) => setCurrentDate(e.target.value)}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					/>
				</Card>

				<Card className="p-4 bg-white dark:bg-gray-800">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Quick Stats
					</label>
					<div className="flex gap-2 text-xs">
						<span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
							Present: {presentCount}
						</span>
						<span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
							Absent: {absentCount}
						</span>
						<span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
							Unmarked: {unmarkedCount}
						</span>
					</div>
				</Card>
			</div>

			{/* Search & Actions */}
			<Card className="p-4 bg-white dark:bg-gray-800">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search students..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
						/>
					</div>
					<div className="flex gap-2">
						<button
							onClick={markAllPresent}
							className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
						>
							Mark All Present
						</button>
						<button
							onClick={markAllAbsent}
							className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
						>
							Mark All Absent
						</button>
					</div>
				</div>
			</Card>

			{/* Student List */}
			<Card className="p-6 bg-white dark:bg-gray-800">
				<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					Students ({filteredStudents.length})
				</h3>
				<div className="space-y-3">
					{filteredStudents.map((student, index) => (
						<motion.div
							key={student.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
								student.present === true
									? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
									: student.present === false
									? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
									: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
							}`}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
									{student.name.charAt(0)}
								</div>
								<div>
									<p className="font-medium text-gray-900 dark:text-white">
										{student.name}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Roll: {student.rollNumber}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => markAttendance(student.id, true)}
									className={`p-2 rounded-lg transition-colors ${
										student.present === true
											? "bg-green-500 text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30"
									}`}
								>
									<Check className="w-4 h-4" />
								</button>
								<button
									onClick={() => markAttendance(student.id, false)}
									className={`p-2 rounded-lg transition-colors ${
										student.present === false
											? "bg-red-500 text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30"
									}`}
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</Card>

			{/* Submit Button */}
			<Card className="p-4 bg-white dark:bg-gray-800">
				<div className="flex justify-between items-center">
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{unmarkedCount > 0 ? (
							<span className="text-yellow-600 dark:text-yellow-400">
								⚠️ {unmarkedCount} students unmarked
							</span>
						) : (
							<span className="text-green-600 dark:text-green-400">
								✅ All students marked
							</span>
						)}
					</div>
					<button
						onClick={submitAttendance}
						disabled={unmarkedCount > 0}
						className={`px-6 py-2 rounded-lg font-medium transition-colors ${
							unmarkedCount > 0
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600 text-white"
						}`}
					>
						Submit Attendance
					</button>
				</div>
			</Card>
		</div>
	);
}
