"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	CreditCard,
	Download,
	CheckCircle,
	Clock,
	AlertCircle,
	Calendar,
	IndianRupee,
	Receipt,
	Filter,
	Search,
	Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeeStructure {
	id: string;
	category: string;
	amount: number;
	dueDate: string;
	status: "paid" | "pending" | "overdue";
	description: string;
}

interface PaymentHistory {
	id: string;
	transactionId: string;
	feeCategory: string;
	amount: number;
	paidDate: string;
	paymentMethod: string;
	status: "completed" | "processing" | "failed";
	receiptUrl?: string;
}

export function FeeStatus() {
	const [selectedTab, setSelectedTab] = useState<
		"current" | "history" | "structure"
	>("current");
	const [paymentInProgress, setPaymentInProgress] = useState<string | null>(
		null
	);

	const currentFees: FeeStructure[] = [
		{
			id: "1",
			category: "Tuition Fee - Quarter 3",
			amount: 15000,
			dueDate: "2024-08-25",
			status: "pending",
			description: "Academic tuition fee for July-September quarter",
		},
		{
			id: "2",
			category: "Library Fee",
			amount: 500,
			dueDate: "2024-08-20",
			status: "overdue",
			description: "Annual library membership and book access fee",
		},
		{
			id: "3",
			category: "Sports Fee",
			amount: 1200,
			dueDate: "2024-08-30",
			status: "pending",
			description: "Sports equipment and facility maintenance fee",
		},
	];

	const paymentHistory: PaymentHistory[] = [
		{
			id: "1",
			transactionId: "TXN202408001",
			feeCategory: "Tuition Fee - Quarter 2",
			amount: 15000,
			paidDate: "2024-07-15",
			paymentMethod: "Online Banking",
			status: "completed",
			receiptUrl: "/receipts/receipt_202408001.pdf",
		},
		{
			id: "2",
			transactionId: "TXN202407002",
			feeCategory: "Exam Fee - Mid Term",
			amount: 800,
			paidDate: "2024-07-10",
			paymentMethod: "Credit Card",
			status: "completed",
			receiptUrl: "/receipts/receipt_202407002.pdf",
		},
		{
			id: "3",
			transactionId: "TXN202407003",
			feeCategory: "Lab Fee",
			amount: 2000,
			paidDate: "2024-06-28",
			paymentMethod: "UPI",
			status: "completed",
			receiptUrl: "/receipts/receipt_202407003.pdf",
		},
	];

	const feeStructure = [
		{
			category: "Tuition Fee (Per Quarter)",
			amount: 15000,
			frequency: "Quarterly",
		},
		{ category: "Admission Fee", amount: 5000, frequency: "One Time" },
		{ category: "Exam Fee", amount: 800, frequency: "Per Exam" },
		{ category: "Library Fee", amount: 500, frequency: "Annual" },
		{ category: "Lab Fee", amount: 2000, frequency: "Annual" },
		{ category: "Sports Fee", amount: 1200, frequency: "Annual" },
		{ category: "Transport Fee", amount: 3000, frequency: "Quarterly" },
		{ category: "Activity Fee", amount: 1500, frequency: "Annual" },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
			case "completed":
				return "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400";
			case "pending":
			case "processing":
				return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400";
			case "overdue":
			case "failed":
				return "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400";
			default:
				return "bg-gray-50 text-gray-700 dark:bg-gray-950/20 dark:text-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "paid":
			case "completed":
				return <CheckCircle className="w-4 h-4" />;
			case "pending":
			case "processing":
				return <Clock className="w-4 h-4" />;
			case "overdue":
			case "failed":
				return <AlertCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getTotalPending = () => {
		return currentFees
			.filter((fee) => fee.status === "pending" || fee.status === "overdue")
			.reduce((total, fee) => total + fee.amount, 0);
	};

	const getTotalPaid = () => {
		return paymentHistory
			.filter((payment) => payment.status === "completed")
			.reduce((total, payment) => total + payment.amount, 0);
	};

	const handlePayment = (feeId: string) => {
		setPaymentInProgress(feeId);
		// Simulate payment processing
		setTimeout(() => {
			setPaymentInProgress(null);
			// In real implementation, this would redirect to payment gateway
			alert("Redirecting to payment gateway...");
		}, 2000);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col md:flex-row md:items-center justify-between"
			>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
						Fee Status
					</h1>
					<p className="text-muted-foreground">
						Manage your fees and view payment history
					</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<div className="relative">
						<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search transactions..." className="pl-9 w-64" />
					</div>
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
				</div>
			</motion.div>

			{/* Summary Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
							<AlertCircle className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Due</div>
							<div className="text-xs text-red-600">2 pending</div>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{formatAmount(getTotalPending())}
						</h3>
						<p className="text-sm text-muted-foreground">Total Outstanding</p>
					</div>
				</Card>

				<Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Paid</div>
							<div className="text-xs text-green-600">This year</div>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{formatAmount(getTotalPaid())}
						</h3>
						<p className="text-sm text-muted-foreground">Total Paid</p>
					</div>
				</Card>

				<Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
							<Wallet className="w-6 h-6 text-white" />
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Next Due</div>
							<div className="text-xs text-blue-600">Aug 20</div>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-foreground mb-1">
							{formatAmount(500)}
						</h3>
						<p className="text-sm text-muted-foreground">Library Fee</p>
					</div>
				</Card>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex space-x-1 bg-muted rounded-lg p-1"
			>
				{[
					{
						key: "current" as const,
						label: "Current Dues",
						count: currentFees.filter((f) => f.status !== "paid").length,
					},
					{
						key: "history" as const,
						label: "Payment History",
						count: paymentHistory.length,
					},
					{
						key: "structure" as const,
						label: "Fee Structure",
						count: feeStructure.length,
					},
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => setSelectedTab(tab.key)}
						className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
							selectedTab === tab.key
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.label}
						<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted-foreground/10">
							{tab.count}
						</span>
					</button>
				))}
			</motion.div>

			{/* Content */}
			{selectedTab === "current" && (
				<div className="space-y-4">
					{currentFees.map((fee, index) => (
						<motion.div
							key={fee.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}
						>
							<Card
								className={`p-6 border-border hover:shadow-lg transition-shadow ${
									fee.status === "overdue"
										? "bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-800"
										: "bg-card"
								}`}
							>
								<div className="flex flex-col lg:flex-row lg:items-center justify-between">
									<div className="flex-1 space-y-3">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-foreground mb-1">
													{fee.category}
												</h3>
												<p className="text-muted-foreground text-sm">
													{fee.description}
												</p>
											</div>
											<div
												className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
													fee.status
												)}`}
											>
												{getStatusIcon(fee.status)}
												<span className="ml-1 capitalize">{fee.status}</span>
											</div>
										</div>

										<div className="flex items-center space-x-6 text-sm">
											<div className="flex items-center">
												<IndianRupee className="w-4 h-4 mr-1 text-muted-foreground" />
												<span className="font-medium text-foreground">
													{formatAmount(fee.amount)}
												</span>
											</div>
											<div className="flex items-center">
												<Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
												<span
													className={`${
														fee.status === "overdue"
															? "text-red-600"
															: "text-muted-foreground"
													}`}
												>
													Due: {formatDate(fee.dueDate)}
												</span>
											</div>
										</div>

										{fee.status === "overdue" && (
											<div className="bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
												<div className="flex items-center text-red-700 dark:text-red-400">
													<AlertCircle className="w-4 h-4 mr-2" />
													<span className="text-sm font-medium">
														Overdue! Late fees may apply.
													</span>
												</div>
											</div>
										)}
									</div>

									<div className="lg:ml-6 mt-4 lg:mt-0">
										{fee.status === "paid" ? (
											<Button variant="outline" disabled>
												<CheckCircle className="w-4 h-4 mr-2" />
												Paid
											</Button>
										) : (
											<Button
												onClick={() => handlePayment(fee.id)}
												disabled={paymentInProgress === fee.id}
												className={
													fee.status === "overdue"
														? "bg-red-500 hover:bg-red-600"
														: ""
												}
											>
												{paymentInProgress === fee.id ? (
													<>
														<Clock className="w-4 h-4 mr-2 animate-spin" />
														Processing...
													</>
												) : (
													<>
														<CreditCard className="w-4 h-4 mr-2" />
														Pay Now
													</>
												)}
											</Button>
										)}
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{selectedTab === "history" && (
				<div className="space-y-4">
					{paymentHistory.map((payment, index) => (
						<motion.div
							key={payment.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}
						>
							<Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
								<div className="flex flex-col lg:flex-row lg:items-center justify-between">
									<div className="flex-1 space-y-3">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-foreground mb-1">
													{payment.feeCategory}
												</h3>
												<p className="text-muted-foreground text-sm">
													Transaction ID: {payment.transactionId}
												</p>
											</div>
											<div
												className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
													payment.status
												)}`}
											>
												{getStatusIcon(payment.status)}
												<span className="ml-1 capitalize">
													{payment.status}
												</span>
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
											<div className="flex items-center">
												<IndianRupee className="w-4 h-4 mr-1 text-muted-foreground" />
												<span className="font-medium text-foreground">
													{formatAmount(payment.amount)}
												</span>
											</div>
											<div className="flex items-center">
												<Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
												<span className="text-muted-foreground">
													{formatDate(payment.paidDate)}
												</span>
											</div>
											<div className="flex items-center">
												<CreditCard className="w-4 h-4 mr-1 text-muted-foreground" />
												<span className="text-muted-foreground">
													{payment.paymentMethod}
												</span>
											</div>
										</div>
									</div>

									<div className="lg:ml-6 mt-4 lg:mt-0 space-x-2">
										{payment.receiptUrl && payment.status === "completed" && (
											<Button variant="outline" size="sm">
												<Download className="w-4 h-4 mr-2" />
												Receipt
											</Button>
										)}
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{selectedTab === "structure" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Card className="p-6 bg-card border-border">
						<h3 className="text-lg font-semibold text-foreground mb-6">
							Academic Year 2024-25 Fee Structure
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-3 text-muted-foreground font-medium">
											Category
										</th>
										<th className="text-right py-3 text-muted-foreground font-medium">
											Amount
										</th>
										<th className="text-right py-3 text-muted-foreground font-medium">
											Frequency
										</th>
									</tr>
								</thead>
								<tbody>
									{feeStructure.map((item, index) => (
										<tr key={index} className="border-b border-border/50">
											<td className="py-4 text-foreground">{item.category}</td>
											<td className="py-4 text-right font-medium text-foreground">
												{formatAmount(item.amount)}
											</td>
											<td className="py-4 text-right text-muted-foreground">
												{item.frequency}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr className="border-t-2 border-border">
										<td className="py-4 font-semibold text-foreground">
											Total Annual Fee (Estimated)
										</td>
										<td className="py-4 text-right font-bold text-lg text-foreground">
											{formatAmount(72300)}
										</td>
										<td className="py-4"></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card>
				</motion.div>
			)}

			{/* Empty States */}
			{((selectedTab === "current" && currentFees.length === 0) ||
				(selectedTab === "history" && paymentHistory.length === 0)) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center py-12"
				>
					<Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-foreground mb-2">
						{selectedTab === "current"
							? "No pending fees"
							: "No payment history"}
					</h3>
					<p className="text-muted-foreground">
						{selectedTab === "current"
							? "All your fees are up to date!"
							: "No payment transactions found."}
					</p>
				</motion.div>
			)}
		</div>
	);
}
