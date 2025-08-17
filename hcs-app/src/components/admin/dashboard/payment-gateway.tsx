"use client";

import { motion } from "framer-motion";
import { CreditCard, Shield, Settings, CheckCircle } from "lucide-react";

export function PaymentGateway() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Payment Gateway Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Configure online payment systems and settings
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						title: "Payment Methods",
						value: "5",
						icon: CreditCard,
						color: "from-blue-500 to-cyan-500",
					},
					{
						title: "Security Level",
						value: "High",
						icon: Shield,
						color: "from-green-500 to-emerald-500",
					},
					{
						title: "Success Rate",
						value: "99.2%",
						icon: CheckCircle,
						color: "from-purple-500 to-pink-500",
					},
					{
						title: "Gateway Status",
						value: "Active",
						icon: Settings,
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
							className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
								>
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{stat.value}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
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
				className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					Roadmap: Online Payment Integration
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="font-medium text-gray-900 dark:text-white mb-2">
							Planned Features
						</h3>
						<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
							<li>🔄 UPI payment integration (PhonePe, Google Pay, Paytm)</li>
							<li>🔄 Credit/Debit card support (Visa, MasterCard, RuPay)</li>
							<li>🔄 Net banking for all major banks</li>
							<li>🔄 Digital wallets integration</li>
							<li>🔄 EMI and installment options</li>
						</ul>
					</div>
					<div>
						<h3 className="font-medium text-gray-900 dark:text-white mb-2">
							Security Features
						</h3>
						<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
							<li>🔄 SSL encryption for all transactions</li>
							<li>🔄 PCI DSS compliance</li>
							<li>🔄 Two-factor authentication</li>
							<li>🔄 Fraud detection and prevention</li>
							<li>🔄 Real-time payment notifications</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
