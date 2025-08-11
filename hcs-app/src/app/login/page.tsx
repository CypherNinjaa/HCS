import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="flex justify-center">
						<div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xl">HCS</span>
						</div>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Choose your portal to continue
					</p>
				</div>

				<div className="mt-8 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Button variant="outline" className="h-20" asChild>
							<Link href="/portal/student" className="flex flex-col">
								<span className="text-2xl">🎓</span>
								<span>Student</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-20" asChild>
							<Link href="/portal/teacher" className="flex flex-col">
								<span className="text-2xl">👨‍🏫</span>
								<span>Teacher</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-20" asChild>
							<Link href="/portal/parent" className="flex flex-col">
								<span className="text-2xl">👨‍👩‍👧‍👦</span>
								<span>Parent</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-20" asChild>
							<Link href="/portal/admin" className="flex flex-col">
								<span className="text-2xl">⚙️</span>
								<span>Admin</span>
							</Link>
						</Button>
					</div>

					<div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-gray-50 text-gray-500">
									Or sign in with credentials
								</span>
							</div>
						</div>

						<form className="mt-6 space-y-4">
							<div>
								<label htmlFor="email" className="sr-only">
									Email address
								</label>
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									placeholder="Email address or username"
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									placeholder="Password"
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-gray-900"
									>
										Remember me
									</label>
								</div>

								<div className="text-sm">
									<Link
										href="/forgot-password"
										className="font-medium text-blue-600 hover:text-blue-500"
									>
										Forgot your password?
									</Link>
								</div>
							</div>

							<div>
								<Button type="submit" className="w-full">
									Sign in
								</Button>
							</div>
						</form>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							New to Happy Child School?{" "}
							<Link
								href="/admissions"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Apply for admission
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
