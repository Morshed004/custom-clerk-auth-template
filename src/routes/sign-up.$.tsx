import { useSignUp } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	Eye,
	EyeOff,
	Lock,
	Mail,
	UserPlus,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sign-up/$")({
	component: SignUpPage,
});

function SignUpPage() {
	const { isLoaded, signUp } = useSignUp();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		if (name === "password") {
			calculatePasswordStrength(value);
		}
	};

	const calculatePasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/[0-9]/)) strength++;
		if (password.match(/[^a-zA-Z0-9]/)) strength++;
		setPasswordStrength(strength);
	};

	const getPasswordStrengthColor = () => {
		if (passwordStrength === 0) return "bg-gray-200";
		if (passwordStrength === 1) return "bg-red-500";
		if (passwordStrength === 2) return "bg-orange-500";
		if (passwordStrength === 3) return "bg-yellow-500";
		return "bg-green-500";
	};

	const getPasswordStrengthText = () => {
		if (passwordStrength === 0) return "No password";
		if (passwordStrength === 1) return "Weak";
		if (passwordStrength === 2) return "Fair";
		if (passwordStrength === 3) return "Good";
		return "Strong";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded) return;

		setError("");
		setLoading(true);

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (passwordStrength < 3) {
			setError("Please use a stronger password");
			setLoading(false);
			return;
		}

		try {
			await signUp.create({
				emailAddress: formData.email,
				password: formData.password,
			});

			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			navigate({ to: "/verify" });
		} catch (err: any) {
			setError(err?.errors?.[0]?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
			<div className="max-w-md w-full">
				{/* Main Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					{/* Top Accent Bar - Linear style */}
					<div className="h-1 bg-[#5E6AD2]"></div>

					<div className="p-8">
						{/* Logo/Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-12 h-12 bg-[#5E6AD2] rounded-xl flex items-center justify-center shadow-sm">
								<UserPlus className="w-6 h-6 text-white" />
							</div>
						</div>

						<h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">
							Create an account
						</h2>
						<p className="text-gray-500 text-center mb-8 text-sm">
							Get started with your free account
						</p>

						{/* Error Alert - Linear style */}
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-6 rounded-md text-sm">
								<div className="flex items-center gap-2">
									<AlertCircle className="w-4 h-4 shrink-0" />
									<span>{error}</span>
								</div>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email Field */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1.5"
								>
									Email
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

							{/* Password Field */}
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
										placeholder="Create a strong password"
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

								{/* Password Strength Indicator - Linear style */}
								{formData.password && (
									<div className="mt-2 space-y-1.5">
										<div className="flex gap-1">
											{[1, 2, 3, 4].map((level) => (
												<div
													key={level}
													className={`h-1 flex-1 rounded-full transition-all ${
														level <= passwordStrength
															? getPasswordStrengthColor()
															: "bg-gray-200"
													}`}
												/>
											))}
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-500">
												Password strength:{" "}
												<span className="font-medium text-gray-700">
													{getPasswordStrengthText()}
												</span>
											</span>
											{passwordStrength === 4 && (
												<CheckCircle className="w-3 h-3 text-green-500" />
											)}
										</div>
										<p className="text-xs text-gray-400">
											Use 8+ chars with letters, numbers & symbols
										</p>
									</div>
								)}
							</div>

							{/* Confirm Password Field */}
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700 mb-1.5"
								>
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 text-gray-400" />
									</div>
									<input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										name="confirmPassword"
										placeholder="Confirm your password"
										required
										value={formData.confirmPassword}
										onChange={handleChange}
										className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E6AD2] focus:border-transparent text-sm transition-shadow"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
										) : (
											<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
										)}
									</button>
								</div>
								{formData.confirmPassword &&
									formData.password !== formData.confirmPassword && (
										<p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											Passwords don't match
										</p>
									)}
								{formData.confirmPassword &&
									formData.password === formData.confirmPassword &&
									formData.password && (
										<p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
											<CheckCircle className="w-3 h-3" />
											Passwords match
										</p>
									)}
							</div>

							{/* Submit Button - Linear style */}
							<button
								type="submit"
								disabled={!isLoaded || loading}
								className="w-full bg-[#5E6AD2] hover:bg-[#4C58B8] text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Creating account...
									</>
								) : (
									<>
										Sign Up
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</button>
						</form>
					</div>
				</div>

				{/* Sign In Link - Linear style */}
				<div className="text-center mt-6">
					<p className="text-sm text-gray-500">
						Already have an account?{" "}
						<button
							type="button"
							onClick={() => navigate({ to: "/sign-in/$" })}
							className="text-[#5E6AD2] hover:text-[#4C58B8] font-medium hover:underline transition-colors"
						>
							Sign in
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
