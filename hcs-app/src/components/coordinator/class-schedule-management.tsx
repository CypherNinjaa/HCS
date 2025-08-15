"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	Plus,
	Edit,
	Trash2,
	Save,
	X,
	Users,
	BookOpen,
} from "lucide-react";

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

interface Schedule {
	id: string;
	classId: string;
	className: string;
	subject: string;
	teacher: string;
	day: string;
	startTime: string;
	endTime: string;
	room: string;
}

interface ClassScheduleManagementProps {
	coordinatorData: CoordinatorData;
}

export function ClassScheduleManagement({
	coordinatorData,
}: ClassScheduleManagementProps) {
	const [selectedClass, setSelectedClass] = useState(
		coordinatorData.managedClasses[0]?.id || ""
	);
	const [selectedDay, setSelectedDay] = useState("Monday");
	const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);

	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Mock schedule data
	const [schedules, setSchedules] = useState<Schedule[]>([
		{
			id: "sch-1",
			classId: "class-8a",
			className: "Class VIII-A",
			subject: "Mathematics",
			teacher: "Mr. Kumar",
			day: "Monday",
			startTime: "09:00",
			endTime: "09:45",
			room: "Room 101",
		},
		{
			id: "sch-2",
			classId: "class-8a",
			className: "Class VIII-A",
			subject: "English",
			teacher: "Mrs. Sharma",
			day: "Monday",
			startTime: "09:45",
			endTime: "10:30",
			room: "Room 102",
		},
		{
			id: "sch-3",
			classId: "class-8a",
			className: "Class VIII-A",
			subject: "Science",
			teacher: "Mr. Patel",
			day: "Monday",
			startTime: "11:15",
			endTime: "12:00",
			room: "Science Lab",
		},
		{
			id: "sch-4",
			classId: "class-9a",
			className: "Class IX-A",
			subject: "Mathematics",
			teacher: "Mr. Kumar",
			day: "Monday",
			startTime: "10:30",
			endTime: "11:15",
			room: "Room 201",
		},
	]);

	const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
		classId: selectedClass,
		day: selectedDay,
		subject: "",
		teacher: "",
		startTime: "",
		endTime: "",
		room: "",
	});

	const filteredSchedules = schedules
		.filter(
			(schedule) =>
				schedule.classId === selectedClass && schedule.day === selectedDay
		)
		.sort((a, b) => a.startTime.localeCompare(b.startTime));

	const selectedClassData = coordinatorData.managedClasses.find(
		(cls) => cls.id === selectedClass
	);

	const handleAddSchedule = () => {
		if (
			newSchedule.subject &&
			newSchedule.teacher &&
			newSchedule.startTime &&
			newSchedule.endTime
		) {
			const schedule: Schedule = {
				id: `sch-${Date.now()}`,
				classId: selectedClass,
				className:
					selectedClassData?.name + "-" + selectedClassData?.section || "",
				subject: newSchedule.subject!,
				teacher: newSchedule.teacher!,
				day: selectedDay,
				startTime: newSchedule.startTime!,
				endTime: newSchedule.endTime!,
				room: newSchedule.room || "TBA",
			};
			setSchedules([...schedules, schedule]);
			setNewSchedule({
				classId: selectedClass,
				day: selectedDay,
				subject: "",
				teacher: "",
				startTime: "",
				endTime: "",
				room: "",
			});
			setShowAddForm(false);
		}
	};

	const handleEditSchedule = (schedule: Schedule) => {
		setEditingSchedule(schedule);
	};

	const handleSaveEdit = () => {
		if (editingSchedule) {
			setSchedules(
				schedules.map((schedule) =>
					schedule.id === editingSchedule.id ? editingSchedule : schedule
				)
			);
			setEditingSchedule(null);
		}
	};

	const handleDeleteSchedule = (scheduleId: string) => {
		setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Class Schedule Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage and organize class timetables
					</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
				>
					<Plus className="h-5 w-5" />
					Add Schedule
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Select Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							{coordinatorData.managedClasses.map((cls) => (
								<option key={cls.id} value={cls.id}>
									{cls.name} - {cls.section}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Select Day
						</label>
						<select
							value={selectedDay}
							onChange={(e) => setSelectedDay(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							{days.map((day) => (
								<option key={day} value={day}>
									{day}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Schedule Table */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						{selectedClassData?.name} - {selectedClassData?.section} •{" "}
						{selectedDay}
					</h2>
				</div>

				{filteredSchedules.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Time
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Subject
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Teacher
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Room
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{filteredSchedules.map((schedule) => (
									<motion.tr
										key={schedule.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingSchedule?.id === schedule.id ? (
												<div className="flex gap-2">
													<input
														type="time"
														value={editingSchedule.startTime}
														onChange={(e) =>
															setEditingSchedule({
																...editingSchedule,
																startTime: e.target.value,
															})
														}
														className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
													/>
													<input
														type="time"
														value={editingSchedule.endTime}
														onChange={(e) =>
															setEditingSchedule({
																...editingSchedule,
																endTime: e.target.value,
															})
														}
														className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
													/>
												</div>
											) : (
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4 text-gray-400" />
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														{schedule.startTime} - {schedule.endTime}
													</span>
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingSchedule?.id === schedule.id ? (
												<input
													type="text"
													value={editingSchedule.subject}
													onChange={(e) =>
														setEditingSchedule({
															...editingSchedule,
															subject: e.target.value,
														})
													}
													className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
												/>
											) : (
												<div className="flex items-center gap-2">
													<BookOpen className="h-4 w-4 text-blue-500" />
													<span className="text-sm text-gray-900 dark:text-white">
														{schedule.subject}
													</span>
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingSchedule?.id === schedule.id ? (
												<input
													type="text"
													value={editingSchedule.teacher}
													onChange={(e) =>
														setEditingSchedule({
															...editingSchedule,
															teacher: e.target.value,
														})
													}
													className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
												/>
											) : (
												<div className="flex items-center gap-2">
													<Users className="h-4 w-4 text-green-500" />
													<span className="text-sm text-gray-900 dark:text-white">
														{schedule.teacher}
													</span>
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingSchedule?.id === schedule.id ? (
												<input
													type="text"
													value={editingSchedule.room}
													onChange={(e) =>
														setEditingSchedule({
															...editingSchedule,
															room: e.target.value,
														})
													}
													className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
												/>
											) : (
												<span className="text-sm text-gray-500 dark:text-gray-400">
													{schedule.room}
												</span>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingSchedule?.id === schedule.id ? (
												<div className="flex gap-2">
													<button
														onClick={handleSaveEdit}
														className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
													>
														<Save className="h-4 w-4" />
													</button>
													<button
														onClick={() => setEditingSchedule(null)}
														className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
													>
														<X className="h-4 w-4" />
													</button>
												</div>
											) : (
												<div className="flex gap-2">
													<button
														onClick={() => handleEditSchedule(schedule)}
														className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
													>
														<Edit className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleDeleteSchedule(schedule.id)}
														className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											)}
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No schedules found
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							Add a new schedule to get started.
						</p>
					</div>
				)}
			</div>

			{/* Add Schedule Modal */}
			{showAddForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Add New Schedule
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Subject
								</label>
								<input
									type="text"
									value={newSchedule.subject || ""}
									onChange={(e) =>
										setNewSchedule({ ...newSchedule, subject: e.target.value })
									}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									placeholder="Enter subject name"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Teacher
								</label>
								<input
									type="text"
									value={newSchedule.teacher || ""}
									onChange={(e) =>
										setNewSchedule({ ...newSchedule, teacher: e.target.value })
									}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									placeholder="Enter teacher name"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Start Time
									</label>
									<input
										type="time"
										value={newSchedule.startTime || ""}
										onChange={(e) =>
											setNewSchedule({
												...newSchedule,
												startTime: e.target.value,
											})
										}
										className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										End Time
									</label>
									<input
										type="time"
										value={newSchedule.endTime || ""}
										onChange={(e) =>
											setNewSchedule({
												...newSchedule,
												endTime: e.target.value,
											})
										}
										className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Room
								</label>
								<input
									type="text"
									value={newSchedule.room || ""}
									onChange={(e) =>
										setNewSchedule({ ...newSchedule, room: e.target.value })
									}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									placeholder="Enter room number"
								/>
							</div>
						</div>
						<div className="flex gap-4 mt-6">
							<button
								onClick={handleAddSchedule}
								className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
							>
								Add Schedule
							</button>
							<button
								onClick={() => setShowAddForm(false)}
								className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
							>
								Cancel
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
