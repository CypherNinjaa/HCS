"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	User,
	Mail,
	GraduationCap,
	Book,
	Key,
	Eye,
	EyeOff,
	RefreshCw,
	Copy,
} from "lucide-react";
import {
	CreateTeacherRequest,
	UpdateTeacherRequest,
	Teacher,
	TeacherFormData,
	BLOOD_GROUPS,
	COMMON_SUBJECTS,
	COMMON_DEPARTMENTS,
	QUALIFICATION_OPTIONS,
	QualificationType,
} from "@/types/teacher";
import { teacherService } from "@/services/teacher.service";
import { handleApiError } from "@/lib/api-client";

interface TeacherFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teacher?: Teacher | null;
	mode: "create" | "edit";
}

export function TeacherFormModal({
	isOpen,
	onClose,
	onSuccess,
	teacher,
	mode,
}: TeacherFormModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [generatedCredentials, setGeneratedCredentials] = useState<{
		email: string;
		password: string;
	} | null>(null);
	const [formData, setFormData] = useState<TeacherFormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		dateOfBirth: "",
		joiningDate: "",
		qualification: "",
		experience: "",
		subjects: [],
		department: "",
		designation: "",
		salary: "",
		emergencyContact: "",
		bloodGroup: "",
		teacherPassword: "",
	});

	// Populate form data when editing
	useEffect(() => {
		if (mode === "edit" && teacher) {
			setFormData({
				firstName: teacher.firstName,
				lastName: teacher.lastName,
				email: teacher.email,
				phone: teacher.phone || "",
				address: teacher.address || "",
				dateOfBirth: teacher.dateOfBirth
					? teacher.dateOfBirth.split("T")[0]
					: "",
				joiningDate: teacher.joiningDate.split("T")[0],
				qualification: teacher.qualification,
				experience: teacher.experience || "",
				subjects: teacher.subjects,
				department: teacher.department || "",
				designation: teacher.designation || "",
				salary: teacher.salary || "",
				emergencyContact: teacher.emergencyContact || "",
				bloodGroup: teacher.bloodGroup || "",
				teacherPassword: "",
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
				joiningDate: new Date().toISOString().split("T")[0], // Default to today
				qualification: "",
				experience: "",
				subjects: [],
				department: "",
				designation: "",
				salary: "",
				emergencyContact: "",
				bloodGroup: "",
				teacherPassword: "",
			});
		}
	}, [mode, teacher]);

	// Generate credentials when names change (create mode only)
	useEffect(() => {
		if (
			mode === "create" &&
			formData.firstName &&
			formData.lastName &&
			!formData.email
		) {
			const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
			const email = `${username}@happychildschool.com`;

			setFormData((prev) => ({ ...prev, email }));
		}
	}, [formData.firstName, formData.lastName, formData.email, mode]);

	// Generate password when email changes (create mode only)
	useEffect(() => {
		if (mode === "create" && formData.email && !formData.teacherPassword) {
			const password = generatePassword();
			setFormData((prev) => ({ ...prev, teacherPassword: password }));
			setGeneratedCredentials({ email: formData.email, password });
		}
	}, [formData.email, formData.teacherPassword, mode]);

	// Update generated credentials when form data changes
	useEffect(() => {
		if (mode === "create" && formData.email && formData.teacherPassword) {
			setGeneratedCredentials({
				email: formData.email,
				password: formData.teacherPassword,
			});
		}
	}, [formData.email, formData.teacherPassword, mode]);

	const generatePassword = () => {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
		let password = "";
		for (let i = 0; i < 10; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			if (mode === "create") {
				const createData: CreateTeacherRequest = {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone || undefined,
					address: formData.address || undefined,
					dateOfBirth: formData.dateOfBirth || undefined,
					joiningDate: formData.joiningDate,
					qualification: formData.qualification as QualificationType,
					experience: parseInt(formData.experience) || 0,
					subjects: formData.subjects,
					department: formData.department,
					designation: formData.designation || undefined,
					salary: parseFloat(formData.salary) || undefined,
					emergencyContact: formData.emergencyContact || undefined,
					bloodGroup: formData.bloodGroup || undefined,
					teacherPassword: formData.teacherPassword || undefined,
				};

				await teacherService.createTeacher(createData);

				// Show success message with credentials
				if (generatedCredentials) {
					alert(
						`Teacher account created successfully!\n\nLogin Credentials:\nEmail: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}\n\nPlease save these credentials securely!`
					);
				}
			} else if (mode === "edit" && teacher) {
				const updateData: UpdateTeacherRequest = {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone || undefined,
					address: formData.address || undefined,
					dateOfBirth: formData.dateOfBirth || undefined,
					qualification: formData.qualification as QualificationType,
					experience: parseInt(formData.experience) || undefined,
					subjects: formData.subjects,
					department: formData.department,
					designation: formData.designation || undefined,
					salary: parseFloat(formData.salary) || undefined,
					emergencyContact: formData.emergencyContact || undefined,
					bloodGroup: formData.bloodGroup || undefined,
				};
				await teacherService.updateTeacher(teacher.id, updateData);
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

	const handleSubjectChange = (subject: string) => {
		setFormData((prev) => ({
			...prev,
			subjects: prev.subjects.includes(subject)
				? prev.subjects.filter((s) => s !== subject)
				: [...prev.subjects, subject],
		}));
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

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
								{mode === "create" ? "Add New Teacher" : "Edit Teacher"}
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
												Date of Birth
											</label>
											<input
												type="date"
												name="dateOfBirth"
												value={formData.dateOfBirth}
												onChange={handleChange}
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
												{BLOOD_GROUPS.map((group) => (
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
											<div className="flex gap-2">
												<input
													type="email"
													name="email"
													value={formData.email}
													onChange={handleChange}
													required
													className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="teacher@example.com"
												/>
												{mode === "create" &&
													formData.firstName &&
													formData.lastName && (
														<button
															type="button"
															onClick={() => {
																const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
																const email = `${username}@happychildschool.com`;
																setFormData((prev) => ({ ...prev, email }));
															}}
															className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
															title="Auto-generate email"
														>
															Auto
														</button>
													)}
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Phone Number
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="+919876543210"
											/>
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm font-medium text-foreground mb-2">
											Address
										</label>
										<textarea
											name="address"
											value={formData.address}
											onChange={handleChange}
											rows={3}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											placeholder="Enter complete address"
										/>
									</div>
									<div className="mt-4">
										<label className="block text-sm font-medium text-foreground mb-2">
											Emergency Contact
										</label>
										<input
											type="tel"
											name="emergencyContact"
											value={formData.emergencyContact}
											onChange={handleChange}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											placeholder="+919876543210"
										/>
									</div>
								</div>

								{/* Professional Information */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<GraduationCap className="h-5 w-5" />
										Professional Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Qualification *
											</label>
											<select
												name="qualification"
												value={formData.qualification}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">Select qualification</option>
												{QUALIFICATION_OPTIONS.map((qual) => (
													<option key={qual.value} value={qual.value}>
														{qual.label}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Experience (Years)
											</label>
											<input
												type="number"
												name="experience"
												value={formData.experience}
												onChange={handleChange}
												min="0"
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="0"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Department *
											</label>
											<select
												name="department"
												value={formData.department}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">Select department</option>
												{COMMON_DEPARTMENTS.map((dept) => (
													<option key={dept} value={dept}>
														{dept}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Designation
											</label>
											<input
												type="text"
												name="designation"
												value={formData.designation}
												onChange={handleChange}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="e.g., Senior Teacher, HOD"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Joining Date *
											</label>
											<input
												type="date"
												name="joiningDate"
												value={formData.joiningDate}
												onChange={handleChange}
												required
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Monthly Salary (₹)
											</label>
											<input
												type="number"
												name="salary"
												value={formData.salary}
												onChange={handleChange}
												min="0"
												className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="50000"
											/>
										</div>
									</div>
								</div>

								{/* Subjects */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<Book className="h-5 w-5" />
										Subjects * (Select at least one)
									</h3>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
										{COMMON_SUBJECTS.map((subject) => (
											<button
												key={subject}
												type="button"
												onClick={() => handleSubjectChange(subject)}
												className={`p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
													formData.subjects.includes(subject)
														? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
														: "border-border hover:border-blue-300 hover:bg-muted text-foreground"
												}`}
											>
												<div className="flex items-center justify-between">
													<span>{subject}</span>
													{formData.subjects.includes(subject) && (
														<div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
															<svg
																className="w-2.5 h-2.5 text-white"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													)}
												</div>
											</button>
										))}
									</div>
									{formData.subjects.length === 0 && (
										<p className="text-sm text-red-500 mt-2">
											Please select at least one subject
										</p>
									)}
								</div>

								{/* Login Credentials - Show only in create mode */}
								{mode === "create" && generatedCredentials && (
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Key className="h-5 w-5" />
											Generated Login Credentials
										</h3>
										<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4">
											<p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
												⚠️ <strong>Important:</strong> Save these credentials
												safely. They will be needed for first-time login.
											</p>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-xs font-medium text-muted-foreground mb-1">
														Email (Username)
													</label>
													<div className="flex items-center space-x-2">
														<input
															type="text"
															value={generatedCredentials.email}
															onChange={(e) => {
																const newEmail = e.target.value;
																setFormData((prev) => ({
																	...prev,
																	email: newEmail,
																}));
																setGeneratedCredentials((prev) =>
																	prev ? { ...prev, email: newEmail } : null
																);
															}}
															className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															placeholder="teacher@happychildschool.com"
														/>
														<button
															type="button"
															onClick={() =>
																copyToClipboard(generatedCredentials.email)
															}
															className="p-2 hover:bg-muted rounded-md transition-colors"
															title="Copy email"
														>
															<Copy className="h-4 w-4" />
														</button>
													</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-muted-foreground mb-1">
														Password
													</label>
													<div className="flex items-center space-x-2">
														<input
															type={showPassword ? "text" : "password"}
															value={generatedCredentials.password}
															onChange={(e) => {
																const newPassword = e.target.value;
																setFormData((prev) => ({
																	...prev,
																	teacherPassword: newPassword,
																}));
																setGeneratedCredentials((prev) =>
																	prev
																		? { ...prev, password: newPassword }
																		: null
																);
															}}
															className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															placeholder="Enter password"
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)}
															className="p-2 hover:bg-muted rounded-md transition-colors"
															title={
																showPassword ? "Hide password" : "Show password"
															}
														>
															{showPassword ? (
																<EyeOff className="h-4 w-4" />
															) : (
																<Eye className="h-4 w-4" />
															)}
														</button>
														<button
															type="button"
															onClick={() =>
																copyToClipboard(generatedCredentials.password)
															}
															className="p-2 hover:bg-muted rounded-md transition-colors"
															title="Copy password"
														>
															<Copy className="h-4 w-4" />
														</button>
														<button
															type="button"
															onClick={() => {
																const newPassword = generatePassword();
																setFormData((prev) => ({
																	...prev,
																	teacherPassword: newPassword,
																}));
																setGeneratedCredentials((prev) =>
																	prev
																		? { ...prev, password: newPassword }
																		: null
																);
															}}
															className="p-2 hover:bg-muted rounded-md transition-colors"
															title="Generate new password"
														>
															<RefreshCw className="h-4 w-4" />
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

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
										disabled={isLoading || formData.subjects.length === 0}
										className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading
											? "Saving..."
											: mode === "create"
											? "Add Teacher"
											: "Update Teacher"}
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
