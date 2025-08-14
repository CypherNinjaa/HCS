"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Save, X } from "lucide-react";

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

interface AddNewStudentProps {
	coordinatorData: CoordinatorData;
}

export function AddNewStudent({ coordinatorData }: AddNewStudentProps) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		bloodGroup: "",
		address: "",
		parentName: "",
		parentPhone: "",
		parentEmail: "",
		class: "",
		section: "",
		rollNumber: "",
		admissionDate: new Date().toISOString().split("T")[0],
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log("New student data:", formData);
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleReset = () => {
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			dateOfBirth: "",
			bloodGroup: "",
			address: "",
			parentName: "",
			parentPhone: "",
			parentEmail: "",
			class: "",
			section: "",
			rollNumber: "",
			admissionDate: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<UserPlus className="h-7 w-7" />
					Add New Student
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Register a new student in the system
				</p>
			</div>

			{/* Form */}
			<motion.form
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				onSubmit={handleSubmit}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Personal Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
							Personal Information
						</h3>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								First Name *
							</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter first name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Last Name *
							</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter last name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Email *
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter email address"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Phone *
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter phone number"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Date of Birth *
							</label>
							<input
								type="date"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Blood Group
							</label>
							<select
								name="bloodGroup"
								value={formData.bloodGroup}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="">Select Blood Group</option>
								<option value="A+">A+</option>
								<option value="A-">A-</option>
								<option value="B+">B+</option>
								<option value="B-">B-</option>
								<option value="AB+">AB+</option>
								<option value="AB-">AB-</option>
								<option value="O+">O+</option>
								<option value="O-">O-</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Address *
							</label>
							<textarea
								name="address"
								value={formData.address}
								onChange={handleInputChange}
								required
								rows={3}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter complete address"
							/>
						</div>
					</div>

					{/* Academic & Parent Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
							Academic Information
						</h3>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Class *
							</label>
							<select
								name="class"
								value={formData.class}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="">Select Class</option>
								{coordinatorData.managedClasses.map((cls) => (
									<option key={cls.id} value={cls.name.split(" ")[1]}>
										{cls.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Section *
							</label>
							<select
								name="section"
								value={formData.section}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="">Select Section</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Roll Number *
							</label>
							<input
								type="text"
								name="rollNumber"
								value={formData.rollNumber}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter roll number"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Admission Date *
							</label>
							<input
								type="date"
								name="admissionDate"
								value={formData.admissionDate}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
							Parent Information
						</h3>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Parent Name *
							</label>
							<input
								type="text"
								name="parentName"
								value={formData.parentName}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter parent name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Parent Phone *
							</label>
							<input
								type="tel"
								name="parentPhone"
								value={formData.parentPhone}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter parent phone"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Parent Email
							</label>
							<input
								type="email"
								name="parentEmail"
								value={formData.parentEmail}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								placeholder="Enter parent email"
							/>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 mt-8">
					<button
						type="submit"
						className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
					>
						<Save className="h-5 w-5" />
						Add Student
					</button>
					<button
						type="button"
						onClick={handleReset}
						className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
					>
						<X className="h-5 w-5" />
						Reset Form
					</button>
				</div>
			</motion.form>
		</div>
	);
}
