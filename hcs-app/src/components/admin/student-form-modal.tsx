"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	User,
	Mail,
	GraduationCap,
	Heart,
	Users,
	Key,
	Eye,
	EyeOff,
	RefreshCw,
	Copy,
} from "lucide-react";
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
	const [showStudentPassword, setShowStudentPassword] = useState(false);
	const [showParentPassword, setShowParentPassword] = useState(false);
	const [studentEmailUsername, setStudentEmailUsername] = useState("");
	const [studentEmailDomain, setStudentEmailDomain] = useState(
		"happychildschool.com"
	);
	const [studentCustomDomain, setStudentCustomDomain] = useState("");
	const [parentEmailUsername, setParentEmailUsername] = useState("");
	const [parentEmailDomain, setParentEmailDomain] = useState(
		"happychildschool.com"
	);
	const [parentCustomDomain, setParentCustomDomain] = useState("");
	const [generatedCredentials, setGeneratedCredentials] = useState<{
		studentEmail: string;
		studentPassword: string;
		parentEmail: string;
		parentPassword: string;
	} | null>(null);
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
				// Include generated credentials in the request
				const createData: CreateStudentRequest = {
					...formData,
					studentPassword: generatedCredentials?.studentPassword,
					parentPassword: generatedCredentials?.parentPassword,
				};

				await studentService.createStudent(createData);

				// Show success message with credentials info
				if (generatedCredentials) {
					alert(
						`Student and Parent accounts created successfully!\n\nStudent Login:\nEmail: ${generatedCredentials.studentEmail}\nPassword: ${generatedCredentials.studentPassword}\n\nParent Login:\nEmail: ${generatedCredentials.parentEmail}\nPassword: ${generatedCredentials.parentPassword}\n\nPlease save these credentials securely!`
					);
				}
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

	// Generate secure password
	const generatePassword = () => {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
		let password = "";
		for (let i = 0; i < 10; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	// Generate email from name
	// Auto-generate credentials when names change
	useEffect(() => {
		if (mode === "create" && formData.firstName && formData.lastName) {
			// Auto-suggest usernames based on names
			const suggestedStudentUsername = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
			const suggestedParentUsername = formData.parentName
				? `${formData.parentName.split(" ")[0]?.toLowerCase()}.${
						formData.parentName.split(" ")[1]?.toLowerCase() ||
						formData.lastName.toLowerCase()
				  }`
				: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}.parent`;

			setStudentEmailUsername(suggestedStudentUsername);
			setParentEmailUsername(suggestedParentUsername);

			// Build complete emails
			const studentDomain =
				studentEmailDomain === "custom"
					? studentCustomDomain
					: studentEmailDomain;
			const parentDomain =
				parentEmailDomain === "custom" ? parentCustomDomain : parentEmailDomain;

			const studentEmail = `${suggestedStudentUsername}@${studentDomain}`;
			const parentEmail = `${suggestedParentUsername}@${parentDomain}`;

			setFormData((prev) => ({
				...prev,
				email: studentEmail,
				parentEmail: parentEmail,
			}));

			setGeneratedCredentials({
				studentEmail,
				studentPassword: generatePassword(),
				parentEmail,
				parentPassword: generatePassword(),
			});
		}
	}, [
		formData.firstName,
		formData.lastName,
		formData.parentName,
		mode,
		studentEmailDomain,
		studentCustomDomain,
		parentEmailDomain,
		parentCustomDomain,
	]);

	// Update emails when username or domain changes
	const updateStudentEmail = useCallback(() => {
		if (studentEmailUsername) {
			const domain =
				studentEmailDomain === "custom"
					? studentCustomDomain
					: studentEmailDomain;
			const email = `${studentEmailUsername}@${domain}`;
			setFormData((prev) => ({ ...prev, email }));
			setGeneratedCredentials((prev) =>
				prev ? { ...prev, studentEmail: email } : null
			);
		}
	}, [studentEmailUsername, studentEmailDomain, studentCustomDomain]);

	const updateParentEmail = useCallback(() => {
		if (parentEmailUsername) {
			const domain =
				parentEmailDomain === "custom" ? parentCustomDomain : parentEmailDomain;
			const email = `${parentEmailUsername}@${domain}`;
			setFormData((prev) => ({ ...prev, parentEmail: email }));
			setGeneratedCredentials((prev) =>
				prev ? { ...prev, parentEmail: email } : null
			);
		}
	}, [parentEmailUsername, parentEmailDomain, parentCustomDomain]);

	// Update emails when domain changes
	useEffect(() => {
		updateStudentEmail();
	}, [updateStudentEmail]);

	useEffect(() => {
		updateParentEmail();
	}, [updateParentEmail]);

	// Copy to clipboard function
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			// You could add a toast notification here
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

											{/* Custom Email Creation Section */}
											<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
												<h4 className="font-medium text-foreground flex items-center gap-2">
													<Mail className="h-4 w-4" />
													Customize Email Addresses
												</h4>

												{/* Student Email Customization */}
												<div className="space-y-3">
													<h5 className="text-sm font-medium text-foreground">
														Student Email:
													</h5>
													<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
														<div>
															<label className="block text-xs font-medium text-muted-foreground mb-1">
																Username
															</label>
															<input
																type="text"
																value={studentEmailUsername}
																onChange={(e) =>
																	setStudentEmailUsername(e.target.value)
																}
																placeholder="e.g., john.doe"
																className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															/>
														</div>
														<div>
															<label className="block text-xs font-medium text-muted-foreground mb-1">
																Domain
															</label>
															<select
																value={studentEmailDomain}
																onChange={(e) =>
																	setStudentEmailDomain(e.target.value)
																}
																className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															>
																<option value="happychildschool.com">
																	@happychildschool.com
																</option>
																<option value="gmail.com">@gmail.com</option>
																<option value="yahoo.com">@yahoo.com</option>
																<option value="outlook.com">
																	@outlook.com
																</option>
																<option value="custom">Custom Domain</option>
															</select>
														</div>
														{studentEmailDomain === "custom" && (
															<div>
																<label className="block text-xs font-medium text-muted-foreground mb-1">
																	Custom Domain
																</label>
																<input
																	type="text"
																	value={studentCustomDomain}
																	onChange={(e) =>
																		setStudentCustomDomain(e.target.value)
																	}
																	placeholder="example.com"
																	className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
																/>
															</div>
														)}
													</div>
												</div>

												{/* Parent Email Customization */}
												<div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
													<h5 className="text-sm font-medium text-foreground">
														Parent Email:
													</h5>
													<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
														<div>
															<label className="block text-xs font-medium text-muted-foreground mb-1">
																Username
															</label>
															<input
																type="text"
																value={parentEmailUsername}
																onChange={(e) =>
																	setParentEmailUsername(e.target.value)
																}
																placeholder="e.g., parent.john"
																className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															/>
														</div>
														<div>
															<label className="block text-xs font-medium text-muted-foreground mb-1">
																Domain
															</label>
															<select
																value={parentEmailDomain}
																onChange={(e) =>
																	setParentEmailDomain(e.target.value)
																}
																className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
															>
																<option value="happychildschool.com">
																	@happychildschool.com
																</option>
																<option value="gmail.com">@gmail.com</option>
																<option value="yahoo.com">@yahoo.com</option>
																<option value="outlook.com">
																	@outlook.com
																</option>
																<option value="custom">Custom Domain</option>
															</select>
														</div>
														{parentEmailDomain === "custom" && (
															<div>
																<label className="block text-xs font-medium text-muted-foreground mb-1">
																	Custom Domain
																</label>
																<input
																	type="text"
																	value={parentCustomDomain}
																	onChange={(e) =>
																		setParentCustomDomain(e.target.value)
																	}
																	placeholder="example.com"
																	className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
																/>
															</div>
														)}
													</div>
												</div>
											</div>

											{/* Student Credentials */}
											<div className="space-y-3">
												<h4 className="font-medium text-foreground">
													Student Login:
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div>
														<label className="block text-xs font-medium text-muted-foreground mb-1">
															Email (Username)
														</label>
														<div className="flex items-center space-x-2">
															<input
																type="text"
																value={generatedCredentials.studentEmail}
																readOnly
																className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
															/>
															<button
																type="button"
																onClick={() =>
																	copyToClipboard(
																		generatedCredentials.studentEmail
																	)
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
																type={showStudentPassword ? "text" : "password"}
																value={generatedCredentials.studentPassword}
																readOnly
																className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
															/>
															<button
																type="button"
																onClick={() =>
																	setShowStudentPassword(!showStudentPassword)
																}
																className="p-2 hover:bg-muted rounded-md transition-colors"
																title={
																	showStudentPassword
																		? "Hide password"
																		: "Show password"
																}
															>
																{showStudentPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
															</button>
															<button
																type="button"
																onClick={() =>
																	copyToClipboard(
																		generatedCredentials.studentPassword
																	)
																}
																className="p-2 hover:bg-muted rounded-md transition-colors"
																title="Copy password"
															>
																<Copy className="h-4 w-4" />
															</button>
															<button
																type="button"
																onClick={() =>
																	setGeneratedCredentials((prev) =>
																		prev
																			? {
																					...prev,
																					studentPassword: generatePassword(),
																			  }
																			: null
																	)
																}
																className="p-2 hover:bg-muted rounded-md transition-colors"
																title="Generate new password"
															>
																<RefreshCw className="h-4 w-4" />
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* Parent Credentials */}
											<div className="space-y-3 pt-3 border-t border-blue-200 dark:border-blue-800">
												<h4 className="font-medium text-foreground">
													Parent Login:
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div>
														<label className="block text-xs font-medium text-muted-foreground mb-1">
															Email (Username)
														</label>
														<div className="flex items-center space-x-2">
															<input
																type="text"
																value={generatedCredentials.parentEmail}
																readOnly
																className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
															/>
															<button
																type="button"
																onClick={() =>
																	copyToClipboard(
																		generatedCredentials.parentEmail
																	)
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
																type={showParentPassword ? "text" : "password"}
																value={generatedCredentials.parentPassword}
																readOnly
																className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
															/>
															<button
																type="button"
																onClick={() =>
																	setShowParentPassword(!showParentPassword)
																}
																className="p-2 hover:bg-muted rounded-md transition-colors"
																title={
																	showParentPassword
																		? "Hide password"
																		: "Show password"
																}
															>
																{showParentPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
															</button>
															<button
																type="button"
																onClick={() =>
																	copyToClipboard(
																		generatedCredentials.parentPassword
																	)
																}
																className="p-2 hover:bg-muted rounded-md transition-colors"
																title="Copy password"
															>
																<Copy className="h-4 w-4" />
															</button>
															<button
																type="button"
																onClick={() =>
																	setGeneratedCredentials((prev) =>
																		prev
																			? {
																					...prev,
																					parentPassword: generatePassword(),
																			  }
																			: null
																	)
																}
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
									</div>
								)}

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
