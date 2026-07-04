import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, UserRound, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignIn = () => {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({ loginId: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            // LoginRequest schema expects "id" and "password"
            const payload = {
                id: formData.loginId,
                password: formData.password,
            };

            const response = await axios.post(
                "https://hrms-api.walgi.com/api/login",
                payload,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            const { user, token } = response.data;

            // Store token for subsequent authenticated requests
            localStorage.setItem("auth_token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            console.log("[Login Success] User:", user);
            navigate("/dashboard"); // adjust to your actual post-login route
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("[Login Error] Server responded:", {
                        status: error.response.status,
                        data: error.response.data,
                    });

                    if (error.response.status === 401) {
                        // AuthenticationException shape: { message }
                        setErrorMessage(
                            error.response.data?.message || "Invalid credentials."
                        );
                    } else if (error.response.data?.errors) {
                        // ValidationException shape: { message, errors: { field: string[] } }
                        const messages = Object.values(error.response.data.errors)
                            .flat()
                            .join("\n");
                        setErrorMessage(messages);
                    } else {
                        setErrorMessage(
                            error.response.data?.message ||
                            `Login failed (status ${error.response.status})`
                        );
                    }
                } else if (error.request) {
                    console.error("[Login Error] No response received:", error.request);
                    setErrorMessage(
                        "Network error: couldn't reach the server. Check your connection or CORS settings."
                    );
                } else {
                    console.error("[Login Error] Request setup failed:", error.message);
                    setErrorMessage(error.message);
                }
            } else {
                console.error("[Login Error] Unexpected error:", error);
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-8">
            <div className="w-full max-w-[420px]">
                <Card className="rounded-2xl border border-[#e4e4e1] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-8 sm:p-10">
                        {/* Brand */}
                        <div className="mb-2 text-center">
                            <h1 className="text-3xl font-semibold tracking-tight text-[#4f8f1f]">
                                HRMS
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="mb-6 text-center text-sm text-[#666666]">
                            Sign in to your HRMS account
                        </p>

                        {errorMessage && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                {errorMessage}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[#444444]">
                                    Login ID / Email
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
                                    <Input
                                        type="text"
                                        name="loginId"
                                        value={formData.loginId}
                                        onChange={handleChange}
                                        placeholder="Enter login ID or email"
                                        required
                                        disabled={isSubmitting}
                                        className="h-10 rounded-lg border border-[#d7d7d2] bg-white pl-9 pr-3 text-sm text-[#333333] shadow-none placeholder:text-[#ababab] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-[#444444]">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs text-[#666666] hover:text-[#4f8f1f] hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                        disabled={isSubmitting}
                                        className="h-10 rounded-lg border border-[#d7d7d2] bg-white pl-9 pr-10 text-sm text-[#333333] shadow-none placeholder:text-[#ababab] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isSubmitting}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#555555]"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 h-10 w-full rounded-lg bg-[#4f8f1f] text-sm font-medium text-white shadow-none hover:bg-[#437a1a] transition-colors disabled:opacity-75 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-xs text-[#7c7c7c]">
                    <div className="flex items-center gap-3">
                        <button className="hover:text-[#333333] transition-colors">Privacy Policy</button>
                        <span>·</span>
                        <button className="hover:text-[#333333] transition-colors">Terms of Service</button>
                    </div>

                    <p>
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/sign-up"
                            className="font-medium text-[#4f8f1f] hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
