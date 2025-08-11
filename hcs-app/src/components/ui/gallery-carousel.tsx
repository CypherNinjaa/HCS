"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	Play,
	Pause,
	Camera,
	Video,
	MapPin,
} from "lucide-react";
import Image from "next/image";

interface GalleryItem {
	id: number;
	type: "image" | "video";
	src: string;
	title: string;
	description: string;
	location?: string;
	category: "facility" | "event" | "activity" | "achievement";
}

const galleryItems: GalleryItem[] = [
	{
		id: 1,
		type: "image",
		src: "/api/placeholder/800/600",
		title: "Modern Science Laboratory",
		description: "State-of-the-art equipment for hands-on learning",
		location: "Science Building, 2nd Floor",
		category: "facility",
	},
	{
		id: 2,
		type: "image",
		src: "/api/placeholder/800/600",
		title: "Annual Sports Day 2024",
		description: "Students showcasing their athletic talents",
		location: "Main Sports Ground",
		category: "event",
	},
	{
		id: 3,
		type: "video",
		src: "/api/placeholder/800/600",
		title: "Art & Craft Workshop",
		description: "Creative minds at work in our art studio",
		location: "Creative Arts Center",
		category: "activity",
	},
	{
		id: 4,
		type: "image",
		src: "/api/placeholder/800/600",
		title: "Digital Learning Hub",
		description: "Interactive smart classrooms with latest technology",
		location: "Technology Wing",
		category: "facility",
	},
	{
		id: 5,
		type: "image",
		src: "/api/placeholder/800/600",
		title: "National Award Winners",
		description: "Our students excelling at national competitions",
		location: "Assembly Hall",
		category: "achievement",
	},
	{
		id: 6,
		type: "image",
		src: "/api/placeholder/800/600",
		title: "Cultural Festival Performance",
		description: "Vibrant cultural performances by talented students",
		location: "Main Auditorium",
		category: "event",
	},
];

const categories = [
	{ key: "all", label: "All Gallery", icon: Camera },
	{ key: "facility", label: "Facilities", icon: MapPin },
	{ key: "event", label: "Events", icon: Camera },
	{ key: "activity", label: "Activities", icon: Play },
	{ key: "achievement", label: "Achievements", icon: Video },
];

export function GalleryCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isPlaying, setIsPlaying] = useState(true);
	const [filteredItems, setFilteredItems] = useState(galleryItems);

	useEffect(() => {
		if (selectedCategory === "all") {
			setFilteredItems(galleryItems);
		} else {
			setFilteredItems(
				galleryItems.filter((item) => item.category === selectedCategory)
			);
		}
		setCurrentIndex(0);
	}, [selectedCategory]);

	useEffect(() => {
		if (!isPlaying || filteredItems.length === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1
			);
		}, 4000);

		return () => clearInterval(interval);
	}, [isPlaying, filteredItems.length]);

	const goToPrevious = () => {
		setCurrentIndex(
			currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1
		);
	};

	const goToNext = () => {
		setCurrentIndex(
			currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1
		);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	if (filteredItems.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">No items found in this category</p>
			</div>
		);
	}

	const currentItem = filteredItems[currentIndex];

	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="max-w-7xl mx-auto">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
						School Gallery
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Explore our vibrant school life through this visual journey of
						facilities, events, and achievements
					</p>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex flex-wrap justify-center gap-3 mb-8"
				>
					{categories.map((category) => {
						const IconComponent = category.icon;
						return (
							<button
								key={category.key}
								onClick={() => setSelectedCategory(category.key)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
									selectedCategory === category.key
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105"
										: "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600"
								}`}
							>
								<IconComponent className="w-4 h-4" />
								{category.label}
							</button>
						);
					})}
				</motion.div>

				{/* Main Gallery Carousel */}
				<div className="relative">
					{/* Desktop View - Large Image with Thumbnails */}
					<div className="hidden md:block">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
						>
							<div className="relative h-96 lg:h-[500px]">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentIndex}
										initial={{ opacity: 0, x: 100 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -100 }}
										transition={{ duration: 0.5 }}
										className="absolute inset-0"
									>
										<Image
											src={currentItem.src}
											alt={currentItem.title}
											fill
											className="object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

										{/* Content Overlay */}
										<div className="absolute bottom-0 left-0 right-0 p-8 text-white">
											<div className="flex items-center gap-2 mb-2">
												{currentItem.type === "video" ? (
													<Video className="w-5 h-5" />
												) : (
													<Camera className="w-5 h-5" />
												)}
												<span className="text-sm font-medium opacity-90">
													{currentItem.type.toUpperCase()}
												</span>
											</div>
											<h3 className="text-2xl lg:text-3xl font-bold mb-2">
												{currentItem.title}
											</h3>
											<p className="text-lg opacity-90 mb-2">
												{currentItem.description}
											</p>
											{currentItem.location && (
												<div className="flex items-center gap-2 text-sm opacity-80">
													<MapPin className="w-4 h-4" />
													{currentItem.location}
												</div>
											)}
										</div>
									</motion.div>
								</AnimatePresence>

								{/* Navigation Arrows */}
								<button
									onClick={goToPrevious}
									className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
								>
									<ChevronLeft className="w-6 h-6" />
								</button>
								<button
									onClick={goToNext}
									className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
								>
									<ChevronRight className="w-6 h-6" />
								</button>

								{/* Play/Pause Button */}
								<button
									onClick={() => setIsPlaying(!isPlaying)}
									className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
								>
									{isPlaying ? (
										<Pause className="w-5 h-5" />
									) : (
										<Play className="w-5 h-5" />
									)}
								</button>
							</div>

							{/* Thumbnails */}
							<div className="p-6 bg-white dark:bg-slate-800">
								<div className="flex gap-3 overflow-x-auto pb-2">
									{filteredItems.map((item, index) => (
										<button
											key={item.id}
											onClick={() => goToSlide(index)}
											className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
												index === currentIndex
													? "border-blue-500 scale-105"
													: "border-gray-200 dark:border-slate-600 hover:border-blue-300"
											}`}
										>
											<Image
												src={item.src}
												alt={item.title}
												fill
												className="object-cover"
											/>
										</button>
									))}
								</div>
							</div>
						</motion.div>
					</div>

					{/* Mobile View - Carousel Cards */}
					<div className="md:hidden">
						<div className="relative">
							<div className="overflow-hidden rounded-2xl">
								<motion.div
									className="flex transition-transform duration-500 ease-out"
									style={{ transform: `translateX(-${currentIndex * 100}%)` }}
								>
									{filteredItems.map((item) => (
										<div key={item.id} className="w-full flex-shrink-0">
											<div className="relative h-80 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl mx-2">
												<Image
													src={item.src}
													alt={item.title}
													width={800}
													height={192}
													className="w-full h-48 object-cover"
												/>
												<div className="absolute top-2 right-2">
													{item.type === "video" ? (
														<div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
															<Video className="w-3 h-3" />
															VIDEO
														</div>
													) : (
														<div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
															<Camera className="w-3 h-3" />
															PHOTO
														</div>
													)}
												</div>
												<div className="p-4">
													<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
														{item.title}
													</h3>
													<p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
														{item.description}
													</p>
													{item.location && (
														<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
															<MapPin className="w-3 h-3" />
															{item.location}
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</motion.div>
							</div>

							{/* Mobile Navigation Dots */}
							<div className="flex justify-center gap-2 mt-6">
								{filteredItems.map((_, index) => (
									<button
										key={index}
										onClick={() => goToSlide(index)}
										className={`w-3 h-3 rounded-full transition-all duration-300 ${
											index === currentIndex
												? "bg-blue-500 scale-125"
												: "bg-gray-300 dark:bg-slate-600 hover:bg-blue-300"
										}`}
									/>
								))}
							</div>

							{/* Mobile Play/Pause */}
							<div className="flex justify-center mt-4">
								<button
									onClick={() => setIsPlaying(!isPlaying)}
									className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300"
								>
									{isPlaying ? (
										<Pause className="w-4 h-4" />
									) : (
										<Play className="w-4 h-4" />
									)}
									{isPlaying ? "Pause" : "Play"}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Gallery Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
				>
					{[
						{ label: "Total Photos", value: "500+", icon: Camera },
						{ label: "Video Stories", value: "50+", icon: Video },
						{ label: "Events Covered", value: "100+", icon: MapPin },
						{ label: "Happy Moments", value: "1000+", icon: Play },
					].map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<div
								key={index}
								className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
							>
								<IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-500" />
								<div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
									{stat.value}
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{stat.label}
								</div>
							</div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
