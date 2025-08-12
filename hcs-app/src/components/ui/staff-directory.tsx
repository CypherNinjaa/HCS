"use client";

import { motion } from "framer-motion";
import {
	Users,
	GraduationCap,
	BookOpen,
	Mail,
	Star,
	Award,
} from "lucide-react";
import { useState } from "react";

export function StaffDirectory() {
	const [activeTab, setActiveTab] = useState("teachers");

	interface Teacher {
		name: string;
		subject: string;
		education: string;
		experience: string;
		specialization: string;
		achievements: string[];
		image: string;
		rating: number;
	}

	interface NonTeachingStaff {
		name: string;
		role: string;
		department: string;
		education: string;
		experience: string;
		specialization: string;
		image: string;
	}

	const teachers: Teacher[] = [
		{
			name: "Ms. Jennifer Adams",
			subject: "Mathematics",
			education: "M.Sc. Mathematics, UCLA",
			experience: "12 Years",
			specialization: "Advanced Calculus, Statistics",
			achievements: [
				"Math Excellence Award 2023",
				"Student Choice Teacher 2022",
			],
			image: "JA",
			rating: 4.9,
		},
		{
			name: "Dr. Robert Wilson",
			subject: "Physics",
			education: "Ph.D. Physics, MIT",
			experience: "15 Years",
			specialization: "Quantum Mechanics, Astrophysics",
			achievements: [
				"Science Innovation Award 2023",
				"Research Excellence 2021",
			],
			image: "RW",
			rating: 4.8,
		},
		{
			name: "Ms. Lisa Thompson",
			subject: "English Literature",
			education: "M.A. English, Oxford University",
			experience: "10 Years",
			specialization: "Creative Writing, World Literature",
			achievements: [
				"Literary Excellence Award 2023",
				"Creative Teaching Award 2022",
			],
			image: "LT",
			rating: 4.9,
		},
		{
			name: "Mr. Carlos Martinez",
			subject: "Computer Science",
			education: "M.Tech Computer Science, Stanford",
			experience: "8 Years",
			specialization: "AI/ML, Web Development",
			achievements: [
				"Tech Innovation Award 2023",
				"Digital Learning Pioneer 2022",
			],
			image: "CM",
			rating: 4.7,
		},
		{
			name: "Dr. Priya Patel",
			subject: "Biology",
			education: "Ph.D. Biology, Harvard",
			experience: "14 Years",
			specialization: "Genetics, Molecular Biology",
			achievements: [
				"Science Research Award 2023",
				"Lab Excellence Award 2021",
			],
			image: "PP",
			rating: 4.8,
		},
		{
			name: "Ms. Sophie Laurent",
			subject: "French Language",
			education: "M.A. French Literature, Sorbonne",
			experience: "9 Years",
			specialization: "Conversational French, French Culture",
			achievements: [
				"Language Excellence Award 2023",
				"Cultural Ambassador 2022",
			],
			image: "SL",
			rating: 4.9,
		},
	];

	const nonTeachingStaff: NonTeachingStaff[] = [
		{
			name: "Mr. James Parker",
			role: "IT Administrator",
			department: "Technology",
			education: "B.Tech Computer Engineering",
			experience: "7 Years",
			specialization: "Network Management, System Security",
			image: "JP",
		},
		{
			name: "Ms. Maria Gonzalez",
			role: "School Nurse",
			department: "Health Services",
			education: "B.Sc. Nursing, RN License",
			experience: "11 Years",
			specialization: "Child Health, Emergency Care",
			image: "MG",
		},
		{
			name: "Mr. Ahmed Hassan",
			role: "Sports Coordinator",
			department: "Physical Education",
			education: "M.P.Ed Physical Education",
			experience: "6 Years",
			specialization: "Athletic Training, Sports Psychology",
			image: "AH",
		},
		{
			name: "Ms. Rachel Green",
			role: "Librarian",
			department: "Library Services",
			education: "M.L.I.S Library Science",
			experience: "9 Years",
			specialization: "Digital Archives, Research Support",
			image: "RG",
		},
		{
			name: "Mr. Thomas Brown",
			role: "Lab Technician",
			department: "Science Department",
			education: "B.Sc. Chemistry",
			experience: "5 Years",
			specialization: "Lab Safety, Equipment Maintenance",
			image: "TB",
		},
		{
			name: "Ms. Anna Kim",
			role: "Administrative Assistant",
			department: "Administration",
			education: "B.A. Business Administration",
			experience: "8 Years",
			specialization: "Student Records, Office Management",
			image: "AK",
		},
	];

	const FlipCard = ({
		person,
		isTeacher = true,
	}: {
		person: Teacher | NonTeachingStaff;
		isTeacher?: boolean;
	}) => {
		const [isFlipped, setIsFlipped] = useState(false);

		// Type guards
		const isTeacherPerson = (p: Teacher | NonTeachingStaff): p is Teacher => {
			return "subject" in p;
		};

		const teacher = isTeacher && isTeacherPerson(person) ? person : null;
		const staff =
			!isTeacher && !isTeacherPerson(person)
				? (person as NonTeachingStaff)
				: null;

		return (
			<motion.div
				className="relative w-full h-80 perspective-1000"
				onHoverStart={() => setIsFlipped(true)}
				onHoverEnd={() => setIsFlipped(false)}
				whileHover={{ y: -8 }}
			>
				<motion.div
					className="w-full h-full relative preserve-3d cursor-pointer"
					animate={{ rotateY: isFlipped ? 180 : 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Front Side */}
					<div className="absolute inset-0 w-full h-full backface-hidden">
						<div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-lg h-full flex flex-col items-center justify-center text-center">
							{/* Avatar */}
							<div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
								{person.image}
							</div>

							{/* Name & Position */}
							<h3 className="text-lg font-bold text-foreground mb-2">
								{person.name}
							</h3>
							<p className="text-primary font-semibold mb-3">
								{teacher ? teacher.subject : staff ? staff.role : ""}
							</p>

							{/* Experience */}
							<div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
								<Award className="w-4 h-4" />
								{person.experience}
							</div>

							{/* Rating for teachers */}
							{teacher && teacher.rating && (
								<div className="flex items-center gap-1 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < Math.floor(teacher.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="text-sm text-muted-foreground ml-1">
										{teacher.rating}
									</span>
								</div>
							)}

							{/* Hover Indicator */}
							<div className="text-xs text-muted-foreground opacity-70">
								Hover for details
							</div>
						</div>
					</div>

					{/* Back Side */}
					<div
						className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
						style={{ transform: "rotateY(180deg)" }}
					>
						<div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-primary/20 shadow-lg h-full">
							{/* Header */}
							<div className="text-center mb-4">
								<h3 className="text-lg font-bold text-foreground mb-1">
									{person.name}
								</h3>
								<p className="text-primary font-semibold text-sm">
									{teacher
										? teacher.subject
										: staff
										? `${staff.role} - ${staff.department}`
										: ""}
								</p>
							</div>

							{/* Details */}
							<div className="space-y-3 text-sm">
								<div>
									<span className="font-semibold text-foreground">
										Education:
									</span>
									<p className="text-muted-foreground">{person.education}</p>
								</div>
								<div>
									<span className="font-semibold text-foreground">
										Experience:
									</span>
									<p className="text-muted-foreground">{person.experience}</p>
								</div>
								<div>
									<span className="font-semibold text-foreground">
										Specialization:
									</span>
									<p className="text-muted-foreground">
										{person.specialization}
									</p>
								</div>

								{/* Achievements for teachers */}
								{teacher && teacher.achievements && (
									<div>
										<span className="font-semibold text-foreground">
											Recent Achievements:
										</span>
										<ul className="text-muted-foreground mt-1 space-y-1">
											{teacher.achievements.map(
												(achievement: string, i: number) => (
													<li
														key={i}
														className="flex items-center gap-2 text-xs"
													>
														<div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
														{achievement}
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</div>

							{/* Contact Button */}
							<div className="absolute bottom-6 left-6 right-6">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="w-full bg-primary/20 hover:bg-primary hover:text-white text-primary border border-primary/50 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
								>
									<Mail className="w-4 h-4" />
									Contact
								</motion.button>
							</div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		);
	};

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border mb-6">
						<Users className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Our Amazing Team
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Staff <span className="text-gradient-primary">Directory</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Meet our dedicated team of educators and support staff who make
						learning an inspiring journey.
					</p>
				</motion.div>

				{/* Tab Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex justify-center mb-12"
				>
					<div className="bg-card/80 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
						<div className="flex gap-2">
							<button
								onClick={() => setActiveTab("teachers")}
								className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
									activeTab === "teachers"
										? "bg-primary text-white shadow-lg"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<GraduationCap className="w-4 h-4" />
								Teachers
							</button>
							<button
								onClick={() => setActiveTab("staff")}
								className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
									activeTab === "staff"
										? "bg-primary text-white shadow-lg"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<BookOpen className="w-4 h-4" />
								Support Staff
							</button>
						</div>
					</div>
				</motion.div>

				{/* Staff Grid */}
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
				>
					{(activeTab === "teachers" ? teachers : nonTeachingStaff).map(
						(person, index) => (
							<motion.div
								key={person.name}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<FlipCard
									person={person}
									isTeacher={activeTab === "teachers"}
								/>
							</motion.div>
						)
					)}
				</motion.div>

				{/* Department Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
				>
					{[
						{ number: "80+", label: "Total Staff", icon: "👥" },
						{ number: "60+", label: "Teachers", icon: "👩‍🏫" },
						{ number: "20+", label: "Support Staff", icon: "🔧" },
						{ number: "95%", label: "Retention Rate", icon: "📈" },
					].map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -4 }}
							className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
						>
							<div className="text-3xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-foreground mb-1">
								{stat.number}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>

				{/* Join Team CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50 max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Join Our Teaching Family
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							We&apos;re always looking for passionate educators and dedicated
							support staff to join our mission of inspiring young minds.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
							>
								View Open Positions
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-card/80 backdrop-blur-sm text-foreground px-8 py-3 rounded-xl font-semibold border border-border hover:shadow-lg transition-all duration-300"
							>
								Submit Resume
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>

			<style jsx>{`
				.perspective-1000 {
					perspective: 1000px;
				}
				.preserve-3d {
					transform-style: preserve-3d;
				}
				.backface-hidden {
					backface-visibility: hidden;
					-webkit-backface-visibility: hidden;
				}
				.rotate-y-180 {
					transform: rotateY(180deg);
				}
			`}</style>
		</section>
	);
}
