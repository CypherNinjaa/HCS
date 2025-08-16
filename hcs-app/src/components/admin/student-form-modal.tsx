"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, GraduationCap, Heart, Users } from "lucide-react";
import {
	CreateStudentRequest,
	UpdateStudentRequest,
	Student,
	Class,
} from "@/types/student";
import { studentService } from "@/services/student.service";
import { handleApiError } from "@/lib/api-client";

interface StudentFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	student?: Student | null;
	mode: "create" | "edit";
}

export function StudentFormModal({
	isOpen,
	onClose,
	onSuccess,
	student,
	mode,
}: StudentFormModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [classes, setClasses] = useState<Class[]>([]);
	const [formData, setFormData] = useState<CreateStudentRequest>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		dateOfBirth: "",
		classId: "",
		rollNumber: "",
		admissionDate: "",
		bloodGroup: "",
		medicalConditions: "",
		parentName: "",
		parentPhone: "",
		parentEmail: "",
	});

	// Load classes when modal opens
	useEffect(() => {
		if (isOpen) {
			loadClasses();
		}
	}, [isOpen]);

	// Populate form data when editing
	useEffect(() => {
		if (mode === "edit" && student) {
			setFormData({
				firstName: student.firstName,
				lastName: student.lastName,
				email: student.email,
				phone: student.phone,
				address: student.address,
				dateOfBirth: student.dateOfBirth.split("T")[0], // Convert to YYYY-MM-DD format
				classId: student.classId,
				rollNumber: student.rollNumber,
				admissionDate: student.admissionDate.split("T")[0],
				bloodGroup: student.bloodGroup || "",
				medicalConditions: student.medicalConditions || "",
				parentName: "", // These would need to come from the API
				parentPhone: "",
				parentEmail: "",
			});
		} else if (mode === "create") {
			// Reset form for create mode
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				address: "",
				dateOfBirth: "",
				classId: "",
				rollNumber: "",
				admissionDate: new Date().toISOString().split("T")[0], // Default to today
				bloodGroup: "",
				medicalConditions: "",
				parentName: "",
				parentPhone: "",
				parentEmail: "",
			});
		}
	}, [mode, student]);

	const loadClasses = async () => {
		try {
			const response = await studentService.getClasses();
			if (response.success) {
				setClasses(response.data);
			}
		} catch (error) {
			console.error("Failed to load classes:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			if (mode === "create") {
				await studentService.createStudent(formData);
			} else if (mode === "edit" && student) {
				const updateData: UpdateStudentRequest = {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone,
					address: formData.address,
					dateOfBirth: formData.dateOfBirth,
					classId: formData.classId,
					rollNumber: formData.rollNumber,
					bloodGroup: formData.bloodGroup || undefined,
					medicalConditions: formData.medicalConditions || undefined,
				};
				await studentService.updateStudent(student.id, updateData);
			}

			onSuccess();
			onClose();
		} catch (error) {
			setError(handleApiError(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-card rounded-xl shadow-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-border">
							<h2 className="text-2xl font-bold text-foreground">
								{mode === "create" ? "Add New Student" : "Edit Student"}
							</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Form */}
						<div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
							{error && (
								<div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
									<p className="text-red-700 dark:text-red-300 text-sm">
										{error}
									</p>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Personal Information */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<User className="h-5 w-5" />
										Personal Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												First Name *
											</label>
											<input
												type="text"
												name="firstName"
												value={formData.firstName}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="Enter first name"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Last Name *
											</label>
											<input
												type="text"
												name="lastName"
												value={formData.lastName}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="Enter last name"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Date of Birth *
											</label>
											<input
												type="date"
												name="dateOfBirth"
												value={formData.dateOfBirth}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Blood Group
											</label>
											<select
												name="bloodGroup"
												value={formData.bloodGroup}
												onChange={handleChange}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">Select blood group</option>
												{bloodGroups.map((group) => (
													<option key={group} value={group}>
														{group}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>

								{/* Contact Information */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<Mail className="h-5 w-5" />
										Contact Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Email Address *
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="student@example.com"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Phone Number *
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="+919876543210"
											/>
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm font-medium text-foreground mb-2">
											Address *
										</label>
										<textarea
											name="address"
											value={formData.address}
											onChange={handleChange}
											required
											rows={3}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											placeholder="Enter complete address"
										/>
									</div>
								</div>

								{/* Academic Information */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<GraduationCap className="h-5 w-5" />
										Academic Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Class *
											</label>
											<select
												name="classId"
												value={formData.classId}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">Select class</option>
												{classes.map((cls) => (
													<option key={cls.id} value={cls.id}>
														{cls.name}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Roll Number *
											</label>
											<input
												type="text"
												name="rollNumber"
												value={formData.rollNumber}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="001"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Admission Date *
											</label>
											<input
												type="date"
												name="admissionDate"
												value={formData.admissionDate}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											/>
										</div>
									</div>
								</div>

								{/* Parent Information */}
								{mode === "create" && (
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Users className="h-5 w-5" />
											Parent Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Parent Name *
												</label>
												<input
													type="text"
													name="parentName"
													value={formData.parentName}
													onChange={handleChange}
													required
													className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="Enter parent name"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Parent Phone *
												</label>
												<input
													type="tel"
													name="parentPhone"
													value={formData.parentPhone}
													onChange={handleChange}
													required
													className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="+919876543210"
												/>
											</div>
											<div className="md:col-span-2">
												<label className="block text-sm font-medium text-foreground mb-2">
													Parent Email *
												</label>
												<input
													type="email"
													name="parentEmail"
													value={formData.parentEmail}
													onChange={handleChange}
													required
													className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="parent@example.com"
												/>
											</div>
										</div>
									</div>
								)}

								{/* Medical Information */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<Heart className="h-5 w-5" />
										Medical Information
									</h3>
									<div>
										<label className="block text-sm font-medium text-foreground mb-2">
											Medical Conditions
										</label>
										<textarea
											name="medicalConditions"
											value={formData.medicalConditions}
											onChange={handleChange}
											rows={3}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											placeholder="Enter any medical conditions or allergies"
										/>
									</div>
								</div>

								{/* Submit Buttons */}
								<div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
									<button
										type="button"
										onClick={onClose}
										className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isLoading}
										className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading
											? "Saving..."
											: mode === "create"
											? "Add Student"
											: "Update Student"}
									</button>
								</div>
							</form>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
