"use client";

import { motion } from "framer-motion";
import {
	DollarSign,
	CreditCard,
	TrendingUp,
	AlertTriangle,
	Plus,
} from "lucide-react";

export function FeeManagement() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Fee Management
					</h1>
					<p className="text-muted-foreground">
						Track fee collection, payments, and financial records
					</p>
				</div>
				<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
					<Plus className="h-4 w-4" />
					Record Payment
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Total Collection",
						value: "₹74,45,340",
						icon: DollarSign,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "This Month",
						value: "₹12,45,670",
						icon: CreditCard,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Collection Rate",
						value: "87%",
						icon: TrendingUp,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Pending",
						value: "156",
						icon: AlertTriangle,
						color: "from-orange-500 to-red-500",
					},
				].map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-card rounded-xl p-6 border border-border"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-foreground">
										{stat.value}
									</p>
									<p className="text-sm text-muted-foreground">
										{stat.title}
									</p>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-card rounded-xl p-6 border border-border"
			>
				<h2 className="text-lg font-semibold text-foreground mb-4">
					Fee Collection Features
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="font-medium text-foreground mb-2">
							Current Implementation
						</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>✅ Cash payment recording</li>
							<li>✅ Fee status tracking</li>
							<li>✅ Payment history</li>
							<li>✅ Overdue notifications</li>
							<li>✅ Receipt generation</li>
						</ul>
					</div>
					<div>
						<h3 className="font-medium text-foreground mb-2">
							Coming Soon
						</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>🔄 UPI payment integration</li>
							<li>🔄 Credit/Debit card payments</li>
							<li>🔄 Net banking support</li>
							<li>🔄 Automated reminders</li>
							<li>🔄 Installment plans</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
