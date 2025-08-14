"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Search,
	Save,
	Download,
	Upload,
	Edit,
	Calculator,
	CheckCircle,
} from "lucide-react";

interface Student {
	id: string;
	name: string;
	rollNumber: string;
	marks: { [subject: string]: number | null };
}

interface Exam {
	id: string;
	name: string;
	type: "unit-test" | "mid-term" | "final" | "assignment" | "quiz";
	maxMarks: number;
	date: string;
	subjects: string[];
}

interface Class {
	id: string;
	name: string;
	section: string;
	students: number;
	subjects: string[];
}

interface TeacherData {
	classes: Class[];
}

interface MarksEntryDetailedProps {
	teacherData: TeacherData;
}

const MarksEntryDetailed: React.FC<MarksEntryDetailedProps> = ({
	teacherData,
}) => {
	const [selectedClass, setSelectedClass] = useState<Class | null>(
		teacherData.classes[0] || null
	);
	const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
	const [selectedSubject, setSelectedSubject] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");

	// Mock exams data
	const [exams] = useState<Exam[]>([
		{
			id: "1",
			name: "Unit Test 1",
			type: "unit-test",
			maxMarks: 50,
			date: "2024-12-10",
			subjects: ["Mathematics", "Science", "English"],
		},
		{
			id: "2",
			name: "Mid Term Examination",
			type: "mid-term",
			maxMarks: 100,
			date: "2024-12-15",
			subjects: [
				"Mathematics",
				"Science",
				"English",
				"Social Studies",
				"Hindi",
			],
		},
		{
			id: "3",
			name: "Assignment 1",
			type: "assignment",
			maxMarks: 25,
			date: "2024-12-08",
			subjects: ["Mathematics", "Science"],
		},
	]);

	// Generate mock students with marks
	const generateStudentsWithMarks = React.useCallback((): Student[] => {
		if (!selectedClass) return [];

		const students: Student[] = [];
		for (let i = 1; i <= selectedClass.students; i++) {
			const marks: { [subject: string]: number | null } = {};

			// Generate some random marks for demo
			selectedClass.subjects.forEach((subject: string) => {
				if (Math.random() > 0.3) {
					// 70% chance of having marks
					marks[subject] =
						Math.floor(Math.random() * (selectedExam?.maxMarks || 100)) + 1;
				} else {
					marks[subject] = null; // Not yet entered
				}
			});

			students.push({
				id: `student-${selectedClass.id}-${i}`,
				name: `Student ${i.toString().padStart(2, "0")}`,
				rollNumber: `${selectedClass.name.replace("Class ", "")}-${
					selectedClass.section
				}-${i.toString().padStart(3, "0")}`,
				marks,
			});
		}
		return students;
	}, [selectedClass, selectedExam]);

	const [students, setStudents] = useState<Student[]>(
		generateStudentsWithMarks()
	);

	// Update students when class or exam changes
	React.useEffect(() => {
		setStudents(generateStudentsWithMarks());
	}, [selectedClass, selectedExam, generateStudentsWithMarks]);

	const updateMarks = (
		studentId: string,
		subject: string,
		marks: number | null
	) => {
		setStudents((prev) =>
			prev.map((student) =>
				student.id === studentId
					? { ...student, marks: { ...student.marks, [subject]: marks } }
					: student
			)
		);
	};

	const calculateStats = () => {
		if (!selectedSubject || !selectedExam)
			return { average: 0, highest: 0, lowest: 0, passed: 0 };

		const marksArray = students
			.map((s) => s.marks[selectedSubject])
			.filter((m) => m !== null) as number[];

		if (marksArray.length === 0)
			return { average: 0, highest: 0, lowest: 0, passed: 0 };

		const average = marksArray.reduce((a, b) => a + b, 0) / marksArray.length;
		const highest = Math.max(...marksArray);
		const lowest = Math.min(...marksArray);
		const passed = marksArray.filter(
			(m) => m >= selectedExam.maxMarks * 0.4
		).length;

		return { average: Math.round(average), highest, lowest, passed };
	};

	const getGrade = (marks: number, maxMarks: number) => {
		const percentage = (marks / maxMarks) * 100;
		if (percentage >= 90)
			return { grade: "A+", color: "text-green-600 dark:text-green-400" };
		if (percentage >= 80)
			return { grade: "A", color: "text-green-600 dark:text-green-400" };
		if (percentage >= 70)
			return { grade: "B+", color: "text-blue-600 dark:text-blue-400" };
		if (percentage >= 60)
			return { grade: "B", color: "text-blue-600 dark:text-blue-400" };
		if (percentage >= 50)
			return { grade: "C+", color: "text-yellow-600 dark:text-yellow-400" };
		if (percentage >= 40)
			return { grade: "C", color: "text-yellow-600 dark:text-yellow-400" };
		return { grade: "F", color: "text-red-600 dark:text-red-400" };
	};

	const filteredStudents = students.filter(
		(student) =>
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const stats = calculateStats();

	const saveMarks = () => {
		// Here you would save to your backend
		console.log("Saving marks:", {
			classId: selectedClass?.id,
			examId: selectedExam?.id,
			subject: selectedSubject,
			marks: students.map((s) => ({
				studentId: s.id,
				marks: s.marks[selectedSubject],
			})),
		});
		alert("Marks saved successfully!");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
						Marks Entry System
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Enter and manage student marks with spreadsheet-style interface
					</p>
				</div>
				<div className="flex gap-2">
					<button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
						<Upload className="w-4 h-4" />
						Import
					</button>
					<button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
						<Download className="w-4 h-4" />
						Export
					</button>
				</div>
			</div>

			{/* Selection Controls */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Class
					</label>
					<select
						value={selectedClass?.id || ""}
						onChange={(e) => {
							const cls = teacherData.classes.find(
								(c) => c.id === e.target.value
							);
							setSelectedClass(cls || null);
							setSelectedSubject("");
						}}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					>
						{teacherData.classes.map((cls) => (
							<option key={cls.id} value={cls.id}>
								{cls.name} - {cls.section}
							</option>
						))}
					</select>
				</Card>

				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Exam
					</label>
					<select
						value={selectedExam?.id || ""}
						onChange={(e) => {
							const exam = exams.find((ex) => ex.id === e.target.value);
							setSelectedExam(exam || null);
						}}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					>
						<option value="">Select Exam</option>
						{exams.map((exam) => (
							<option key={exam.id} value={exam.id}>
								{exam.name} ({exam.maxMarks} marks)
							</option>
						))}
					</select>
				</Card>

				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Subject
					</label>
					<select
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
						disabled={!selectedClass}
					>
						<option value="">Select Subject</option>
						{selectedClass?.subjects.map((subject: string) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
				</Card>

				<Card className="p-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Search Students
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
						/>
					</div>
				</Card>
			</div>

			{/* Stats Cards */}
			{selectedSubject && selectedExam && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
						<div className="flex items-center gap-3">
							<Calculator className="w-8 h-8 text-blue-600" />
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Average
								</p>
								<p className="text-2xl font-bold text-blue-600">
									{stats.average}
								</p>
							</div>
						</div>
					</Card>

					<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
						<div className="flex items-center gap-3">
							<CheckCircle className="w-8 h-8 text-green-600" />
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Highest
								</p>
								<p className="text-2xl font-bold text-green-600">
									{stats.highest}
								</p>
							</div>
						</div>
					</Card>

					<Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
						<div className="flex items-center gap-3">
							<Edit className="w-8 h-8 text-red-600" />
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Lowest
								</p>
								<p className="text-2xl font-bold text-red-600">
									{stats.lowest}
								</p>
							</div>
						</div>
					</Card>

					<Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
						<div className="flex items-center gap-3">
							<CheckCircle className="w-8 h-8 text-purple-600" />
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Passed
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{stats.passed}/{students.length}
								</p>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Marks Entry Table */}
			{selectedClass && selectedExam && selectedSubject && (
				<Card className="p-6 bg-white dark:bg-gray-800">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Marks Entry - {selectedExam.name} ({selectedSubject})
						</h3>
						<button
							onClick={saveMarks}
							className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
						>
							<Save className="w-4 h-4" />
							Save Marks
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
										Roll No.
									</th>
									<th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
										Student Name
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Marks (/{selectedExam.maxMarks})
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Grade
									</th>
									<th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
										Percentage
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredStudents.map((student, index) => {
									const marks = student.marks[selectedSubject];
									const grade = marks
										? getGrade(marks, selectedExam.maxMarks)
										: null;
									const percentage = marks
										? Math.round((marks / selectedExam.maxMarks) * 100)
										: 0;

									return (
										<tr
											key={student.id}
											className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ${
												index % 2 === 0
													? "bg-white dark:bg-gray-800"
													: "bg-gray-50 dark:bg-gray-750"
											}`}
										>
											<td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
												{student.rollNumber}
											</td>
											<td className="py-3 px-4 text-gray-900 dark:text-white">
												{student.name}
											</td>
											<td className="py-3 px-4 text-center">
												<input
													type="number"
													min="0"
													max={selectedExam.maxMarks}
													value={marks || ""}
													onChange={(e) => {
														const value = e.target.value
															? parseInt(e.target.value)
															: null;
														if (
															value === null ||
															(value >= 0 && value <= selectedExam.maxMarks)
														) {
															updateMarks(student.id, selectedSubject, value);
														}
													}}
													className="w-20 p-2 text-center border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
													placeholder="--"
												/>
											</td>
											<td className="py-3 px-4 text-center">
												{grade && (
													<span className={`font-bold ${grade.color}`}>
														{grade.grade}
													</span>
												)}
											</td>
											<td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
												{marks ? `${percentage}%` : "--"}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
						<p>• Enter marks between 0 and {selectedExam?.maxMarks}</p>
						<p>
							• Grades: A+ (90-100%), A (80-89%), B+ (70-79%), B (60-69%), C+
							(50-59%), C (40-49%), F (Below 40%)
						</p>
						<p>
							• Changes are saved automatically when you click &quot;Save
							Marks&quot;
						</p>
					</div>
				</Card>
			)}

			{/* Instructions */}
			{(!selectedClass || !selectedExam || !selectedSubject) && (
				<Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
					<div className="text-center">
						<Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
							Select Class, Exam & Subject
						</h3>
						<p className="text-blue-700 dark:text-blue-300">
							Choose a class, exam, and subject from the dropdowns above to
							start entering marks
						</p>
					</div>
				</Card>
			)}
		</div>
	);
};

export default MarksEntryDetailed;
