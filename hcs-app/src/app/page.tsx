"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [animatedCounters, setAnimatedCounters] = useState({
		students: 0,
		teachers: 0,
		years: 0,
		success: 0,
	});

	// Animated counters effect
	useEffect(() => {
		const targets = { students: 1200, teachers: 80, years: 15, success: 95 };
		const duration = 2000;
		const steps = 60;
		const stepDuration = duration / steps;

		const intervals = Object.keys(targets).map((key) => {
			const target = targets[key as keyof typeof targets];
			const increment = target / steps;
			let current = 0;

			return setInterval(() => {
				current += increment;
				if (current >= target) {
					current = target;
					clearInterval(intervals[Object.keys(targets).indexOf(key)]);
				}
				setAnimatedCounters((prev) => ({
					...prev,
					[key]: Math.floor(current),
				}));
			}, stepDuration);
		});

		return () => intervals.forEach(clearInterval);
	}, []);

	// Auto-sliding news
	const newsItems = [
		"🎉 Annual Sports Day 2025 - March 15th",
		"📚 New Smart Classrooms Inaugurated",
		"🏆 Science Fair Winners Announced",
		"🎭 Cultural Festival Coming Soon",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % newsItems.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [newsItems.length]);

	const topStudents = [
		{
			name: "Arjun Sharma",
			grade: "10th",
			badge: "🏆",
			achievement: "Science Olympiad Gold",
		},
		{
			name: "Priya Patel",
			grade: "9th",
			badge: "🎨",
			achievement: "Art Competition Winner",
		},
		{
			name: "Rahul Kumar",
			grade: "8th",
			badge: "📚",
			achievement: "Academic Excellence",
		},
	];

	return (
		<div className="min-h-screen bg-[#F5F8FB]">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(221,226,232,0.4)]">
				<div className="container flex h-20 items-center justify-between px-6">
					<div className="flex items-center space-x-3">
						<div className="h-12 w-12 bg-gradient-to-br from-[#417AF5] to-[#7B4FE8] rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(65,122,245,0.3)]">
							<span className="text-white font-bold text-lg">HCS</span>
						</div>
						<div>
							<span className="font-bold text-2xl text-[#24243A]">
								Happy Child School
							</span>
							<p className="text-sm text-gray-500">Excellence in Education</p>
						</div>
					</div>

					<nav className="hidden lg:flex items-center space-x-8">
						<Link
							href="/"
							className="text-[#417AF5] font-medium px-4 py-2 rounded-xl bg-[#E9F0FB] transition-all hover:shadow-lg"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="text-[#24243A] font-medium hover:text-[#417AF5] transition-colors"
						>
							About
						</Link>
						<Link
							href="/academics"
							className="text-[#24243A] font-medium hover:text-[#417AF5] transition-colors"
						>
							Academics
						</Link>
						<Link
							href="/facilities"
							className="text-[#24243A] font-medium hover:text-[#417AF5] transition-colors"
						>
							Facilities
						</Link>
						<Link
							href="/admissions"
							className="text-[#24243A] font-medium hover:text-[#417AF5] transition-colors"
						>
							Admissions
						</Link>
						<Link
							href="/contact"
							className="text-[#24243A] font-medium hover:text-[#417AF5] transition-colors"
						>
							Contact
						</Link>
					</nav>

					<div className="flex items-center space-x-4">
						<Button
							variant="outline"
							className="border-[#417AF5] text-[#417AF5] hover:bg-[#E9F0FB]"
							asChild
						>
							<Link href="/login">Portal Login</Link>
						</Button>
						<Button
							className="bg-gradient-to-r from-[#417AF5] to-[#7B4FE8] hover:from-[#3A6EE8] hover:to-[#6D47D4] shadow-[0_8px_20px_rgba(65,122,245,0.3)]"
							asChild
						>
							<Link href="/admissions">Apply Now</Link>
						</Button>
					</div>
				</div>
			</header>

			{/* Welcome Banner with Mission */}
			<section className="relative bg-gradient-to-br from-[#E9F0FB] via-[#F4F0FC] to-[#E5F7F0] py-24 overflow-hidden">
				<div className="container px-6">
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
						<div className="space-y-8">
							<div className="inline-block">
								<span className="px-6 py-3 bg-white rounded-full text-[#417AF5] font-semibold shadow-[0_8px_30px_rgba(65,122,245,0.15)]">
									🌟 Building Tomorrow&apos;s Leaders Today
								</span>
							</div>

							<h1 className="text-5xl xl:text-7xl font-black text-[#24243A] leading-tight">
								Welcome to
								<span className="bg-gradient-to-r from-[#417AF5] to-[#7B4FE8] bg-clip-text text-transparent block mt-2">
									Happy Child School
								</span>
							</h1>

							<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
								Where innovation meets education! We nurture young minds with
								cutting-edge facilities, expert teachers, and a curriculum
								designed for the digital age.
							</p>

							<div className="flex flex-col sm:flex-row gap-6">
								<Button
									size="lg"
									className="bg-gradient-to-r from-[#417AF5] to-[#7B4FE8] hover:from-[#3A6EE8] hover:to-[#6D47D4] text-lg px-8 py-6 rounded-2xl shadow-[0_12px_40px_rgba(65,122,245,0.3)] hover:shadow-[0_16px_50px_rgba(65,122,245,0.4)] transition-all"
									asChild
								>
									<Link href="/admissions">🎓 Apply for Admission</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-2 border-[#417AF5] text-[#417AF5] hover:bg-[#E9F0FB] text-lg px-8 py-6 rounded-2xl transition-all"
									asChild
								>
									<Link href="/virtual-tour">🏫 Virtual Tour</Link>
								</Button>
							</div>
						</div>

						{/* Hero Image / Animation Area */}
						<div className="relative">
							<div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)]">
								<div className="text-center space-y-6">
									<h3 className="text-3xl font-bold text-[#24243A] mb-8">
										Quick Portal Access
									</h3>
									<div className="grid grid-cols-2 gap-6">
										<Link href="/portal/student" className="group">
											<div className="bg-[#E9F0FB] p-6 rounded-2xl hover:bg-[#417AF5] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(65,122,245,0.3)] hover:-translate-y-2">
												<div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
													🎓
												</div>
												<span className="font-semibold text-[#24243A] group-hover:text-white">
													Student Portal
												</span>
											</div>
										</Link>
										<Link href="/portal/teacher" className="group">
											<div className="bg-[#F4F0FC] p-6 rounded-2xl hover:bg-[#7B4FE8] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(123,79,232,0.3)] hover:-translate-y-2">
												<div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
													👨‍🏫
												</div>
												<span className="font-semibold text-[#24243A] group-hover:text-white">
													Teacher Portal
												</span>
											</div>
										</Link>
										<Link href="/portal/parent" className="group">
											<div className="bg-[#E5F7F0] p-6 rounded-2xl hover:bg-[#1DBF73] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(29,191,115,0.3)] hover:-translate-y-2">
												<div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
													👨‍👩‍👧‍👦
												</div>
												<span className="font-semibold text-[#24243A] group-hover:text-white">
													Parent Portal
												</span>
											</div>
										</Link>
										<Link href="/portal/admin" className="group">
											<div className="bg-[#F7D6DC] p-6 rounded-2xl hover:bg-[#F38225] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(243,130,37,0.3)] hover:-translate-y-2">
												<div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
													⚙️
												</div>
												<span className="font-semibold text-[#24243A] group-hover:text-white">
													Admin Panel
												</span>
											</div>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Auto-sliding News Highlights */}
			<section className="py-4 bg-gradient-to-r from-[#417AF5] to-[#7B4FE8] text-white overflow-hidden">
				<div className="container px-6">
					<div className="flex items-center space-x-4">
						<span className="font-semibold whitespace-nowrap">
							📢 Latest News:
						</span>
						<div className="flex-1 overflow-hidden">
							<div
								className="flex transition-transform duration-500 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{newsItems.map((news, index) => (
									<div key={index} className="min-w-full">
										<span className="text-lg font-medium">{news}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Animated Counters Section */}
			<section className="py-20 bg-white">
				<div className="container px-6">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center p-8 bg-[#E9F0FB] rounded-3xl shadow-[0_12px_40px_rgba(221,226,232,0.3)] hover:shadow-[0_16px_50px_rgba(65,122,245,0.2)] transition-all hover:-translate-y-2">
							<div className="text-5xl font-black text-[#417AF5] mb-2">
								{animatedCounters.students}+
							</div>
							<div className="text-[#24243A] font-semibold text-lg">
								Happy Students
							</div>
							<div className="text-4xl mt-2">🎓</div>
						</div>
						<div className="text-center p-8 bg-[#F4F0FC] rounded-3xl shadow-[0_12px_40px_rgba(221,226,232,0.3)] hover:shadow-[0_16px_50px_rgba(123,79,232,0.2)] transition-all hover:-translate-y-2">
							<div className="text-5xl font-black text-[#7B4FE8] mb-2">
								{animatedCounters.teachers}+
							</div>
							<div className="text-[#24243A] font-semibold text-lg">
								Expert Teachers
							</div>
							<div className="text-4xl mt-2">👨‍🏫</div>
						</div>
						<div className="text-center p-8 bg-[#E5F7F0] rounded-3xl shadow-[0_12px_40px_rgba(221,226,232,0.3)] hover:shadow-[0_16px_50px_rgba(29,191,115,0.2)] transition-all hover:-translate-y-2">
							<div className="text-5xl font-black text-[#1DBF73] mb-2">
								{animatedCounters.years}+
							</div>
							<div className="text-[#24243A] font-semibold text-lg">
								Years Excellence
							</div>
							<div className="text-4xl mt-2">🏆</div>
						</div>
						<div className="text-center p-8 bg-[#FFF4E6] rounded-3xl shadow-[0_12px_40px_rgba(221,226,232,0.3)] hover:shadow-[0_16px_50px_rgba(243,130,37,0.2)] transition-all hover:-translate-y-2">
							<div className="text-5xl font-black text-[#F38225] mb-2">
								{animatedCounters.success}%
							</div>
							<div className="text-[#24243A] font-semibold text-lg">
								Success Rate
							</div>
							<div className="text-4xl mt-2">⭐</div>
						</div>
					</div>
				</div>
			</section>

			{/* Top Performing Students with Gamified Badges */}
			<section className="py-20 bg-[#F5F8FB]">
				<div className="container px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-black text-[#24243A] mb-6">
							🌟 Our Star Performers
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Celebrating excellence and achievements of our outstanding
							students
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{topStudents.map((student, index) => (
							<div
								key={index}
								className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)] hover:shadow-[0_25px_70px_rgba(221,226,232,0.5)] transition-all hover:-translate-y-3"
							>
								<div className="text-center">
									<div className="w-24 h-24 bg-gradient-to-br from-[#417AF5] to-[#7B4FE8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_12px_30px_rgba(65,122,245,0.3)]">
										<span className="text-4xl">{student.badge}</span>
									</div>
									<h3 className="text-2xl font-bold text-[#24243A] mb-2">
										{student.name}
									</h3>
									<p className="text-[#417AF5] font-semibold mb-4">
										{student.grade} Grade
									</p>
									<div className="bg-gradient-to-r from-[#E9F0FB] to-[#F4F0FC] rounded-2xl p-4">
										<p className="text-[#24243A] font-medium">
											{student.achievement}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mini Calendar Widget */}
			<section className="py-20 bg-white">
				<div className="container px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<h2 className="text-4xl font-black text-[#24243A] mb-6">
								📅 Upcoming Events
							</h2>
							<div className="space-y-4">
								<div className="flex items-center p-6 bg-[#E9F0FB] rounded-2xl shadow-[0_8px_30px_rgba(221,226,232,0.3)]">
									<div className="w-16 h-16 bg-[#417AF5] rounded-2xl flex items-center justify-center mr-4">
										<span className="text-white font-bold text-xl">15</span>
									</div>
									<div>
										<h4 className="font-bold text-[#24243A]">
											Annual Sports Day
										</h4>
										<p className="text-gray-600">March 2025</p>
									</div>
								</div>

								<div className="flex items-center p-6 bg-[#F4F0FC] rounded-2xl shadow-[0_8px_30px_rgba(221,226,232,0.3)]">
									<div className="w-16 h-16 bg-[#7B4FE8] rounded-2xl flex items-center justify-center mr-4">
										<span className="text-white font-bold text-xl">22</span>
									</div>
									<div>
										<h4 className="font-bold text-[#24243A]">
											Science Exhibition
										</h4>
										<p className="text-gray-600">March 2025</p>
									</div>
								</div>

								<div className="flex items-center p-6 bg-[#E5F7F0] rounded-2xl shadow-[0_8px_30px_rgba(221,226,232,0.3)]">
									<div className="w-16 h-16 bg-[#1DBF73] rounded-2xl flex items-center justify-center mr-4">
										<span className="text-white font-bold text-xl">28</span>
									</div>
									<div>
										<h4 className="font-bold text-[#24243A]">
											Cultural Festival
										</h4>
										<p className="text-gray-600">March 2025</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)]">
							<h3 className="text-2xl font-bold text-[#24243A] mb-6 text-center">
								Academic Calendar
							</h3>
							<div className="grid grid-cols-7 gap-2 text-center mb-4">
								{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
									(day) => (
										<div key={day} className="p-2 font-semibold text-[#24243A]">
											{day}
										</div>
									)
								)}
							</div>
							<div className="grid grid-cols-7 gap-2">
								{Array.from({ length: 35 }, (_, i) => {
									const day = i - 6;
									const isCurrentMonth = day > 0 && day <= 31;
									const isEvent = [15, 22, 28].includes(day);

									return (
										<div
											key={i}
											className={`p-3 text-center rounded-xl transition-all ${
												isCurrentMonth
													? isEvent
														? "bg-gradient-to-br from-[#417AF5] to-[#7B4FE8] text-white font-bold shadow-lg"
														: "hover:bg-[#E9F0FB] text-[#24243A] cursor-pointer"
													: "text-gray-300"
											}`}
										>
											{isCurrentMonth ? day : ""}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Interactive Testimonial Carousel */}
			<section className="py-20 bg-gradient-to-br from-[#E9F0FB] to-[#F4F0FC]">
				<div className="container px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-black text-[#24243A] mb-6">
							💬 What Our Family Says
						</h2>
						<p className="text-xl text-gray-600">
							Hear from our parents and students about their experience
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)]">
							<div className="flex items-center mb-6">
								<div className="w-16 h-16 bg-gradient-to-br from-[#417AF5] to-[#7B4FE8] rounded-full flex items-center justify-center mr-4">
									<span className="text-white text-2xl">👨‍👩‍👧</span>
								</div>
								<div>
									<h4 className="font-bold text-[#24243A]">
										Mr. & Mrs. Sharma
									</h4>
									<p className="text-gray-600">Parent - Grade 8</p>
								</div>
							</div>
							<p className="text-gray-700 italic mb-4">
								&quot;The digital learning platform has transformed how our
								daughter studies. The gamification keeps her engaged and
								motivated!&quot;
							</p>
							<div className="flex text-[#F5C16E]">⭐⭐⭐⭐⭐</div>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)]">
							<div className="flex items-center mb-6">
								<div className="w-16 h-16 bg-gradient-to-br from-[#1DBF73] to-[#417AF5] rounded-full flex items-center justify-center mr-4">
									<span className="text-white text-2xl">🎓</span>
								</div>
								<div>
									<h4 className="font-bold text-[#24243A]">Ananya Patel</h4>
									<p className="text-gray-600">Student - Grade 10</p>
								</div>
							</div>
							<p className="text-gray-700 italic mb-4">
								&quot;The MCQ tests and instant feedback help me understand my
								progress. I love collecting badges for achievements!&quot;
							</p>
							<div className="flex text-[#F5C16E]">⭐⭐⭐⭐⭐</div>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(221,226,232,0.4)]">
							<div className="flex items-center mb-6">
								<div className="w-16 h-16 bg-gradient-to-br from-[#7B4FE8] to-[#F38225] rounded-full flex items-center justify-center mr-4">
									<span className="text-white text-2xl">👨‍🏫</span>
								</div>
								<div>
									<h4 className="font-bold text-[#24243A]">Ms. Priya Singh</h4>
									<p className="text-gray-600">Mathematics Teacher</p>
								</div>
							</div>
							<p className="text-gray-700 italic mb-4">
								&quot;The teacher portal makes managing classes effortless.
								Student analytics help me personalize learning for each
								child.&quot;
							</p>
							<div className="flex text-[#F5C16E]">⭐⭐⭐⭐⭐</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#24243A] text-white py-16">
				<div className="container px-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
						<div>
							<div className="flex items-center space-x-3 mb-6">
								<div className="h-12 w-12 bg-gradient-to-br from-[#417AF5] to-[#7B4FE8] rounded-2xl flex items-center justify-center">
									<span className="text-white font-bold text-lg">HCS</span>
								</div>
								<div>
									<span className="font-bold text-xl">Happy Child School</span>
									<p className="text-sm text-gray-400">
										Excellence in Education
									</p>
								</div>
							</div>
							<p className="text-gray-400 leading-relaxed">
								Nurturing excellence in education since 2009. Building
								tomorrow&apos;s leaders with innovative teaching methods and
								cutting-edge technology.
							</p>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6 text-[#417AF5]">
								Quick Links
							</h4>
							<ul className="space-y-3 text-gray-400">
								<li>
									<Link
										href="/about"
										className="hover:text-[#417AF5] transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										href="/academics"
										className="hover:text-[#417AF5] transition-colors"
									>
										Academics
									</Link>
								</li>
								<li>
									<Link
										href="/admissions"
										className="hover:text-[#417AF5] transition-colors"
									>
										Admissions
									</Link>
								</li>
								<li>
									<Link
										href="/facilities"
										className="hover:text-[#417AF5] transition-colors"
									>
										Facilities
									</Link>
								</li>
								<li>
									<Link
										href="/gallery"
										className="hover:text-[#417AF5] transition-colors"
									>
										Gallery
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="hover:text-[#417AF5] transition-colors"
									>
										Contact
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6 text-[#7B4FE8]">
								Student Portals
							</h4>
							<ul className="space-y-3 text-gray-400">
								<li>
									<Link
										href="/portal/student"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										Student Login
									</Link>
								</li>
								<li>
									<Link
										href="/portal/teacher"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										Teacher Login
									</Link>
								</li>
								<li>
									<Link
										href="/portal/parent"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										Parent Login
									</Link>
								</li>
								<li>
									<Link
										href="/portal/admin"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										Admin Panel
									</Link>
								</li>
								<li>
									<Link
										href="/e-learning"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										E-Learning
									</Link>
								</li>
								<li>
									<Link
										href="/library"
										className="hover:text-[#7B4FE8] transition-colors"
									>
										Digital Library
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-bold text-lg mb-6 text-[#1DBF73]">
								Contact Info
							</h4>
							<ul className="space-y-4 text-gray-400">
								<li className="flex items-center space-x-3">
									<span className="text-[#1DBF73]">📍</span>
									<span>123 Education Street, Learning City, 560001</span>
								</li>
								<li className="flex items-center space-x-3">
									<span className="text-[#1DBF73]">📞</span>
									<span>+91 98765 43210</span>
								</li>
								<li className="flex items-center space-x-3">
									<span className="text-[#1DBF73]">✉️</span>
									<span>info@happychildschool.edu</span>
								</li>
								<li className="flex items-center space-x-3">
									<span className="text-[#1DBF73]">🌐</span>
									<span>www.happychildschool.edu</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-700 pt-8 text-center">
						<p className="text-gray-400">
							&copy; 2025 Happy Child School. All rights reserved. |
							<Link
								href="/privacy"
								className="text-[#417AF5] hover:underline ml-2"
							>
								Privacy Policy
							</Link>{" "}
							|
							<Link
								href="/terms"
								className="text-[#417AF5] hover:underline ml-2"
							>
								Terms of Service
							</Link>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
