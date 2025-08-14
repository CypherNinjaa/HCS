"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	CreditCard,
	Calendar,
	CheckCircle,
	AlertCircle,
	Clock,
	Download,
	Receipt,
	DollarSign,
	Smartphone,
	Building,
	Shield,
	ArrowRight,
	History,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FeeItem {
	id: string;
	category: string;
	description: string;
	amount: number;
	dueDate: string;
	status: "paid" | "pending" | "overdue";
	paymentDate?: string;
	receiptNumber?: string;
}

interface PaymentHistory {
	id: string;
	date: string;
	amount: number;
	method: string;
	category: string;
	receiptNumber: string;
	status: "completed" | "failed" | "pending";
}

interface FeePaymentProps {
	selectedChild: string;
}

export function FeePayment({}: FeePaymentProps) {
	const [activeTab, setActiveTab] = useState<
		"current" | "history" | "receipts"
	>("current");
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<
		"card" | "bank" | "wallet"
	>("card");

	// Sample fee data
	const feeItems: FeeItem[] = [
		{
			id: "1",
			category: "Tuition Fee",
			description: "Monthly tuition fee for August 2024",
			amount: 1500,
			dueDate: "2024-08-31",
			status: "pending",
		},
		{
			id: "2",
			category: "Library Fee",
			description: "Annual library membership fee",
			amount: 150,
			dueDate: "2024-09-15",
			status: "pending",
		},
		{
			id: "3",
			category: "Lab Fee",
			description: "Science laboratory fee for semester",
			amount: 300,
			dueDate: "2024-08-20",
			status: "overdue",
		},
		{
			id: "4",
			category: "Transport Fee",
			description: "School bus fee for August 2024",
			amount: 200,
			dueDate: "2024-07-31",
			status: "paid",
			paymentDate: "2024-07-28",
			receiptNumber: "RCP-2024-001",
		},
		{
			id: "5",
			category: "Event Fee",
			description: "Annual sports day participation fee",
			amount: 75,
			dueDate: "2024-09-01",
			status: "pending",
		},
	];

	const paymentHistory: PaymentHistory[] = [
		{
			id: "1",
			date: "2024-07-28",
			amount: 200,
			method: "Credit Card",
			category: "Transport Fee",
			receiptNumber: "RCP-2024-001",
			status: "completed",
		},
		{
			id: "2",
			date: "2024-07-15",
			amount: 1500,
			method: "Bank Transfer",
			category: "Tuition Fee",
			receiptNumber: "RCP-2024-002",
			status: "completed",
		},
		{
			id: "3",
			date: "2024-06-30",
			amount: 1500,
			method: "Digital Wallet",
			category: "Tuition Fee",
			receiptNumber: "RCP-2024-003",
			status: "completed",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "pending":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "overdue":
			case "failed":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "paid":
			case "completed":
				return <CheckCircle className="w-4 h-4" />;
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "overdue":
			case "failed":
				return <AlertCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const getDaysUntilDue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const pendingFees = feeItems.filter(
		(item) => item.status === "pending" || item.status === "overdue"
	);
	const totalPending = pendingFees.reduce((sum, item) => sum + item.amount, 0);
	const selectedTotal = feeItems
		.filter((item) => selectedItems.includes(item.id))
		.reduce((sum, item) => sum + item.amount, 0);

	const toggleItemSelection = (itemId: string) => {
		setSelectedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const handlePayment = () => {
		if (selectedItems.length === 0) return;
		// Here you would integrate with payment gateway
		console.log("Processing payment for items:", selectedItems);
		console.log("Payment method:", paymentMethod);
		console.log("Total amount:", selectedTotal);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
			>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">Fee Payment 💳</h1>
				<p className="text-green-100">
					Manage and pay school fees securely online
				</p>
			</motion.div>

			{/* Summary Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Pending
							</p>
							<p className="text-2xl font-bold text-red-600 dark:text-red-400">
								${totalPending}
							</p>
						</div>
						<div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
							<DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						{pendingFees.length} pending items
					</p>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								This Month Paid
							</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">
								$200
							</p>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						1 payment completed
					</p>
				</Card>

				<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Next Due Date
							</p>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								Aug 20
							</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
							<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Lab fee payment due
					</p>
				</Card>
			</motion.div>

			{/* Navigation Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"
			>
				{[
					{ key: "current", label: "Current Fees", icon: CreditCard },
					{ key: "history", label: "Payment History", icon: History },
					{ key: "receipts", label: "Receipts", icon: Receipt },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() =>
							setActiveTab(tab.key as "current" | "history" | "receipts")
						}
						className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
							activeTab === tab.key
								? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						<tab.icon className="w-4 h-4" />
						<span className="font-medium">{tab.label}</span>
					</button>
				))}
			</motion.div>

			{/* Current Fees Tab */}
			{activeTab === "current" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					{/* Fee Items */}
					<div className="space-y-4">
						{feeItems.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											{(item.status === "pending" ||
												item.status === "overdue") && (
												<input
													type="checkbox"
													checked={selectedItems.includes(item.id)}
													onChange={() => toggleItemSelection(item.id)}
													className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
											)}
											<div
												className={`p-3 rounded-lg ${getStatusColor(
													item.status
												)}`}
											>
												{getStatusIcon(item.status)}
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{item.category}
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{item.description}
												</p>
												<div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
													<div className="flex items-center space-x-1">
														<Calendar className="w-4 h-4" />
														<span>
															Due: {new Date(item.dueDate).toLocaleDateString()}
														</span>
														{item.status !== "paid" && (
															<span
																className={`ml-2 font-medium ${
																	getDaysUntilDue(item.dueDate) < 0
																		? "text-red-500"
																		: getDaysUntilDue(item.dueDate) <= 7
																		? "text-yellow-500"
																		: "text-green-500"
																}`}
															>
																(
																{getDaysUntilDue(item.dueDate) < 0
																	? `${Math.abs(
																			getDaysUntilDue(item.dueDate)
																	  )} days overdue`
																	: `${getDaysUntilDue(
																			item.dueDate
																	  )} days left`}
																)
															</span>
														)}
													</div>
													{item.paymentDate && (
														<div className="flex items-center space-x-1">
															<CheckCircle className="w-4 h-4" />
															<span>
																Paid:{" "}
																{new Date(
																	item.paymentDate
																).toLocaleDateString()}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-gray-900 dark:text-white">
												${item.amount}
											</p>
											<span
												className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
													item.status
												)}`}
											>
												{item.status.toUpperCase()}
											</span>
											{item.receiptNumber && (
												<div className="mt-2">
													<Button variant="ghost" size="sm">
														<Receipt className="w-4 h-4 mr-1" />
														Receipt
													</Button>
												</div>
											)}
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>

					{/* Payment Section */}
					{selectedItems.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
						>
							<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg min-w-[400px]">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											Payment Summary
										</h3>
										<p className="text-2xl font-bold text-green-600 dark:text-green-400">
											${selectedTotal}
										</p>
									</div>

									<div className="space-y-2">
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{selectedItems.length} item(s) selected
										</p>

										{/* Payment Method Selection */}
										<div className="flex space-x-2">
											<button
												onClick={() => setPaymentMethod("card")}
												className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
													paymentMethod === "card"
														? "border-green-500 bg-green-50 dark:bg-green-900/20"
														: "border-gray-200 dark:border-gray-700"
												}`}
											>
												<CreditCard className="w-5 h-5 mx-auto mb-1" />
												<p className="text-xs font-medium">Card</p>
											</button>
											<button
												onClick={() => setPaymentMethod("bank")}
												className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
													paymentMethod === "bank"
														? "border-green-500 bg-green-50 dark:bg-green-900/20"
														: "border-gray-200 dark:border-gray-700"
												}`}
											>
												<Building className="w-5 h-5 mx-auto mb-1" />
												<p className="text-xs font-medium">Bank</p>
											</button>
											<button
												onClick={() => setPaymentMethod("wallet")}
												className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
													paymentMethod === "wallet"
														? "border-green-500 bg-green-50 dark:bg-green-900/20"
														: "border-gray-200 dark:border-gray-700"
												}`}
											>
												<Smartphone className="w-5 h-5 mx-auto mb-1" />
												<p className="text-xs font-medium">Wallet</p>
											</button>
										</div>
									</div>

									<Button
										onClick={handlePayment}
										className="w-full bg-green-500 hover:bg-green-600 text-white"
									>
										<Shield className="w-4 h-4 mr-2" />
										Pay Securely
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</Card>
						</motion.div>
					)}
				</motion.div>
			)}

			{/* Payment History Tab */}
			{activeTab === "history" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-4"
				>
					{paymentHistory.map((payment, index) => (
						<motion.div
							key={payment.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div
											className={`p-3 rounded-lg ${getStatusColor(
												payment.status
											)}`}
										>
											{getStatusIcon(payment.status)}
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{payment.category}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{payment.method} •{" "}
												{new Date(payment.date).toLocaleDateString()}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Receipt: {payment.receiptNumber}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-xl font-bold text-gray-900 dark:text-white">
											${payment.amount}
										</p>
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
												payment.status
											)}`}
										>
											{payment.status.toUpperCase()}
										</span>
										<div className="mt-2">
											<Button variant="ghost" size="sm">
												<Download className="w-4 h-4 mr-1" />
												Download
											</Button>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Receipts Tab */}
			{activeTab === "receipts" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
				>
					<Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Available Receipts
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{paymentHistory
								.filter((p) => p.status === "completed")
								.map((payment, index) => (
									<motion.div
										key={payment.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
									>
										<div className="flex items-center space-x-3 mb-3">
											<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
												<FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
											</div>
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{payment.receiptNumber}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{payment.category}
												</p>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													${payment.amount}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{new Date(payment.date).toLocaleDateString()}
												</p>
											</div>
											<Button variant="ghost" size="sm">
												<Download className="w-4 h-4" />
											</Button>
										</div>
									</motion.div>
								))}
						</div>
					</Card>
				</motion.div>
			)}
		</div>
	);
}
