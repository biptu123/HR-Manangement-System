import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    Upload,
    UserRound,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignUpFormData {
    companyName: string;
    companyLogo: File | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const API_BASE_URL = "https://hrms-api.walgi.com/api";
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_LOGO_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const SignUp = () => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<SignUpFormData>({
        companyName: "",
        companyLogo: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === "companyLogo") {
            const file = files?.[0] ?? null;

            if (!file) {
                setFormData((prev) => ({
                    ...prev,
                    companyLogo: null,
                }));
                return;
            }

            if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
                alert("Please upload a PNG, JPG, JPEG, or WEBP image.");
                return;
            }

            if (file.size > MAX_LOGO_SIZE) {
                alert("Logo size must be less than 2MB.");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                companyLogo: file,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const uploadLogo = async (file: File): Promise<string> => {
        const uploadData = new FormData();
        uploadData.append("logo", file);

        const response = await axios.post(
            `${API_BASE_URL}/upload/logo`,
            uploadData,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const logoUrl = response.data?.logo_url;

        if (!logoUrl) {
            throw new Error("Logo upload succeeded but no logo_url was returned.");
        }

        return logoUrl;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            let logoUrl: string | undefined;

            if (formData.companyLogo) {
                logoUrl = await uploadLogo(formData.companyLogo);
            }

            const payload = {
                company_name: formData.companyName.trim(),
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                ...(logoUrl ? { logo_url: logoUrl } : {}),
            };

            await axios.post(`${API_BASE_URL}/register`, payload, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            alert("Account created successfully!");

            setFormData({
                companyName: "",
                companyLogo: null,
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData?.errors) {
                    const messages = Object.values(responseData.errors)
                        .flat()
                        .join("\n");
                    alert(messages);
                    return;
                }

                if (responseData?.message) {
                    alert(responseData.message);
                    return;
                }

                if (error.request) {
                    alert(
                        "Network error: failed to communicate with the API server. Check CORS / backend availability."
                    );
                    return;
                }
            }

            alert(error?.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f9f9f6] to-[#f1f1ed] px-4 py-12 antialiased">
            <div className="w-full max-w-[640px]">
                {/* Brand / Header */}
                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4f8f1f]/10 text-xl font-bold tracking-tight text-[#4f8f1f] shadow-sm">
                        H
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
                        Create your account
                    </h1>
                    <p className="mt-1.5 text-[14px] text-[#666662]">
                        Get started with HRMS for your company
                    </p>
                </div>

                <Card className="rounded-2xl border border-[#e2e2de] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Company Block */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Company Name
                                    </label>
                                    <div className="group relative">
                                        <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Acme Corp"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Company Logo
                                    </label>

                                    <label
                                        className={`flex h-10.5 cursor-pointer items-center justify-center rounded-lg border border-dashed px-3 text-[13px] font-medium transition-all ${isSubmitting ? "pointer-events-none opacity-50" : ""
                                            } ${formData.companyLogo
                                                ? "border-[#4f8f1f] bg-[#f4faf0] text-[#335e14]"
                                                : "border-[#dcdcd8] bg-[#fcfcfb]/50 text-[#555552] hover:border-[#4f8f1f] hover:bg-[#fafaf7]"
                                            }`}
                                    >
                                        {formData.companyLogo ? (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-[#4f8f1f]" />
                                                <span className="max-w-[120px] truncate">
                                                    {formData.companyLogo.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4 text-[#92928f]" />
                                                <span>Upload</span>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            name="companyLogo"
                                            onChange={handleChange}
                                            className="hidden"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            disabled={isSubmitting}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* User Profile Block */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        First Name
                                    </label>
                                    <div className="group relative">
                                        <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Last Name
                                    </label>
                                    <div className="group relative">
                                        <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Email Block */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Phone Number
                                    </label>
                                    <div className="group relative">
                                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security Block */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Password
                                    </label>
                                    <div className="group relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 pr-10 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass((prev) => !prev)}
                                            disabled={isSubmitting}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92928f] hover:text-[#2d2d2a]"
                                        >
                                            {showPass ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#2d2d2a]">
                                        Confirm Password
                                    </label>
                                    <div className="group relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#92928f] transition-colors group-focus-within:text-[#4f8f1f]" />
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            disabled={isSubmitting}
                                            required
                                            className="h-10.5 rounded-lg border-[#dcdcd8] bg-[#fcfcfb]/50 pl-10.5 pr-10 text-[13.5px] transition-all focus-visible:border-[#4f8f1f] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#4f8f1f]/10 focus-visible:ring-offset-0 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((prev) => !prev)}
                                            disabled={isSubmitting}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92928f] hover:text-[#2d2d2a]"
                                        >
                                            {showConfirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 h-11 w-full rounded-lg bg-[#4f8f1f] text-[14px] font-medium text-white shadow-sm transition-all hover:bg-[#437a1a] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-75"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="mt-6 flex flex-col items-center justify-between gap-3 px-2 text-[13px] text-[#787875] sm:flex-row">
                    <p>
                        Already have an account?{" "}
                        <Link
                            to="/sign-in"
                            className="font-semibold text-[#4f8f1f] hover:text-[#437a1a] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className="flex items-center gap-3.5">
                        <button
                            type="button"
                            className="transition-colors hover:text-[#2d2d2a]"
                        >
                            Privacy Policy
                        </button>
                        <span className="select-none text-[#dcdcd8]">•</span>
                        <button
                            type="button"
                            className="transition-colors hover:text-[#2d2d2a]"
                        >
                            Terms
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
