import { useSignUp, useUser } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
	MailCheck,
	AlertCircle,
	ArrowRight,
	CheckCircle,
	RefreshCw,
	Loader2,
} from "lucide-react";

export const Route = createFileRoute("/verify")({
	component: VerifyPage,
});

function VerifyPage() {
	const { isLoaded, signUp, setActive } = useSignUp();
	const navigate = useNavigate();
	const { isLoaded: userLoaded, isSignedIn, user } = useUser();

	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (!userLoaded) return;

		// If user is signed in and email is verified → redirect
		if (
			isSignedIn &&
			user?.primaryEmailAddress?.verification?.status === "verified"
		) {
			navigate({ to: "/" });
		}
	}, [userLoaded, isSignedIn, user, navigate]);

	// Auto-focus first input on mount
	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	if (!userLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-[#5E6AD2] animate-spin mx-auto mb-4" />
				</div>
			</div>
		);
	}

	const handleCodeChange = (index: number, value: string) => {
		if (value.length > 1) return;

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signUp) return;

		const verificationCode = code.join("");
		if (verificationCode.length !== 6) {
			setError("Please enter the complete 6-digit code");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const result = await signUp.attemptEmailAddressVerification({
				code: verificationCode,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				navigate({ to: "/" });
			} else {
				setError("Verification not complete");
			}
		} catch (err: any) {
			setError(err?.errors?.[0]?.message || "Invalid verification code");
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		if (!isLoaded || !signUp || resending) return;

		setResending(true);
		setResendSuccess(false);
		setError("");

		try {
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});
			setResendSuccess(true);
			setTimeout(() => setResendSuccess(false), 3000);
		} catch (err: any) {
			setError(err?.errors?.[0]?.message || "Failed to resend code");
		} finally {
			setResending(false);
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
						{/* Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-12 h-12 bg-[#5E6AD2] rounded-xl flex items-center justify-center shadow-sm">
								<MailCheck className="w-6 h-6 text-white" />
							</div>
						</div>

						<h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">
							Verify your email
						</h2>
						<p className="text-gray-500 text-center mb-6 text-sm">
							We've sent a 6-digit verification code to your email address
						</p>

						{/* Error Alert */}
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-6 rounded-md text-sm">
								<div className="flex items-center gap-2">
									<AlertCircle className="w-4 h-4 shrink-0" />
									<span>{error}</span>
								</div>
							</div>
						)}

						{/* Success Alert for Resend */}
						{resendSuccess && (
							<div className="bg-green-50 border border-green-200 text-green-700 p-3 mb-6 rounded-md text-sm">
								<div className="flex items-center gap-2">
									<CheckCircle className="w-4 h-4 shrink-0" />
									<span>New verification code sent successfully!</span>
								</div>
							</div>
						)}

						<form onSubmit={handleVerify} className="space-y-6">
							{/* 6-Digit Code Input */}
							<div>
								<label
									htmlFor="code"
									className="block text-sm font-medium text-gray-700 mb-3 text-center"
								>
									Enter verification code
								</label>
								<div className="flex gap-2 justify-center">
									{code.map((digit, index) => (
										<input
											id="code"
											key={index}
											ref={(el) => {
												inputRefs.current[index] = el;
											}}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={digit}
											onChange={(e) => handleCodeChange(index, e.target.value)}
											onKeyDown={(e) => handleKeyDown(index, e)}
											className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E6AD2] focus:border-transparent transition-shadow"
											required
										/>
									))}
								</div>
								<p className="text-xs text-gray-400 text-center mt-3">
									Enter the 6-digit code sent to your email
								</p>
							</div>

							{/* Verify Button */}
							<button
								type="submit"
								disabled={!isLoaded || loading}
								className="w-full bg-[#5E6AD2] hover:bg-[#4C58B8] text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Verifying...
									</>
								) : (
									<>
										Verify Email
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

						{/* Resend Code Button */}
						<button
							type="button"
							onClick={handleResendCode}
							disabled={resending}
							className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#5E6AD2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<RefreshCw
								className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
							/>
							{resending ? "Sending..." : "Resend verification code"}
						</button>
					</div>
				</div>

				{/* Back to Sign Up Link */}
				<div className="text-center mt-6">
					<button
						type="button"
						onClick={() => navigate({ to: "/sign-up/$" })}
						className="text-sm text-gray-500 hover:text-[#5E6AD2] transition-colors"
					>
						← Back to sign up
					</button>
				</div>
			</div>
		</div>
	);
}
