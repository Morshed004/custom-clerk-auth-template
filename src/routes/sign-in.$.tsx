import { useAuth, useSignIn } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	Lock,
	LogIn,
	Mail,
	Eye,
	EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/sign-in/$")({
	component: SignInPage,
});

type ClerkError = {
	errors?: { message?: string }[];
};

function SignInPage() {
	const { isLoaded: authIsLoaded, isSignedIn } = useAuth();
	const { isLoaded, signIn, setActive } = useSignIn();
	const navigate = useNavigate();

	useEffect(() => {
		if (authIsLoaded && isSignedIn) {
			navigate({ to: "/" });
		}
	}, [authIsLoaded, isSignedIn, navigate]);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	if (!authIsLoaded) return null;
	if (isSignedIn) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) return;

		setError("");
		setLoading(true);

		try {
			const result = await signIn.create({
				identifier: formData.email,
				password: formData.password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				navigate({ to: "/" });
			} else {
				setError("Login not complete");
			}
		} catch (err: unknown) {
			const clerkError = err as ClerkError;
			setError(clerkError.errors?.[0]?.message || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
			<div className="max-w-md w-full">
				{/* Main Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					{/* Top Accent Bar */}
					<div className="h-1 bg-[#5E6AD2]"></div>

					<div className="p-8">
						{/* Logo/Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-12 h-12 bg-[#5E6AD2] rounded-xl flex items-center justify-center shadow-sm">
								<LogIn className="w-6 h-6 text-white" />
							</div>
						</div>

						<h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">
							Welcome Back
						</h2>
						<p className="text-gray-500 text-center mb-6 text-sm">
							Sign in to your account
						</p>

						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-6 rounded-md text-sm">
								<div className="flex items-center gap-2">
									<AlertCircle className="w-4 h-4 shrink-0" />
									<span>{error}</span>
								</div>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1.5"
								>
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-4 w-4 text-gray-400" />
									</div>
									<input
										id="email"
										type="email"
										name="email"
										placeholder="hello@example.com"
										required
										value={formData.email}
										onChange={handleChange}
										className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E6AD2] focus:border-transparent text-sm transition-shadow"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1.5"
								>
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 text-gray-400" />
									</div>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										name="password"
										placeholder="••••••••"
										required
										value={formData.password}
										onChange={handleChange}
										className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E6AD2] focus:border-transparent text-sm transition-shadow"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
										) : (
											<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
										)}
									</button>
								</div>
							</div>

							<button
								type="submit"
								disabled={!isLoaded || loading}
								className="w-full bg-[#5E6AD2] hover:bg-[#4C58B8] text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Signing in...
									</>
								) : (
									<>
										Sign In
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</button>
						</form>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200"></div>
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="px-3 bg-white text-gray-400">OR</span>
							</div>
						</div>

						{/* Sign up link */}
						<div className="text-center">
							<p className="text-sm text-gray-500">
								Don't have an account?{" "}
								<button
									type="button"
									onClick={() => navigate({ to: "/sign-up/$" })}
									className="text-[#5E6AD2] hover:text-[#4C58B8] font-medium hover:underline transition-colors"
								>
									Sign up
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
