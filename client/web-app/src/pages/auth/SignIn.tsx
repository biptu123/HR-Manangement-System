import { useState } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole, UserRound, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignIn = () => {
    // Form State
    const [formData, setFormData] = useState({ loginId: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, name: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle your authentication logic here
        console.log("Form Submitted:", formData);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-8">
            <div className="w-full max-w-[420px]"> {/* Made the outer wrapper more compact */}
                <Card className="rounded-2xl border border-[#e4e4e1] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-8 sm:p-10"> {/* Balanced internal spacing */}
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
                                        className="h-10 rounded-lg border border-[#d7d7d2] bg-white pl-9 pr-3 text-sm text-[#333333] shadow-none placeholder:text-[#ababab] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
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
                                        className="h-10 rounded-lg border border-[#d7d7d2] bg-white pl-9 pr-10 text-sm text-[#333333] shadow-none placeholder:text-[#ababab] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#555555]"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-10 w-full rounded-lg bg-[#4f8f1f] text-sm font-medium text-white shadow-none hover:bg-[#437a1a] transition-colors"
                            >
                                Sign In
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
