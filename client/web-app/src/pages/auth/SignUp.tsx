import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    Upload,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignUp = () => {
    // Visibility states
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        companyName: "",
        companyLogo: null,
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // Unified input handler
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Submitting Sign Up Data:", formData);
        // Process API request here...
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f6f3] px-4 py-8">
            <div className="w-full max-w-[680px]">
                <Card className="rounded-[18px] border border-[#dfdfdb] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.06)]">
                    <CardContent className="px-6 py-10 sm:px-12">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <h1 className="text-[30px] font-medium tracking-[-0.03em] text-[#4f8f1f]">HRMS</h1>
                            <p className="text-[14px] text-[#4b4b4b]">Create your HRMS company account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Row 1: Company Fields */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                        <Input
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Enter company name"
                                            required
                                            className="h-[40px] pl-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Company Logo</label>
                                    <label className="flex h-[40px] cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-[#d7d7d2] bg-white px-3 text-[13px] text-[#666] transition hover:border-[#4f8f1f] hover:bg-[#fafcf7]">
                                        <Upload className="mr-2 h-4 w-4 text-[#8f8f8f]" />
                                        <span className="truncate">{formData.companyLogo ? formData.companyLogo.name : "Upload"}</span>
                                        <input type="file" name="companyLogo" onChange={handleChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            {/* Row 2: User Identity */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Full Name</label>
                                    <div className="relative">
                                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                            className="h-[40px] pl-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Email</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                            required
                                            className="h-[40px] pl-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Contact Info */}
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-[#444]">Phone</label>
                                <div className="relative">
                                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className="h-[40px] pl-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                    />
                                </div>
                            </div>

                            {/* Row 4: Security */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Password</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                        <Input
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            required
                                            className="h-[40px] pl-10 pr-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#555]">
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[13px] font-medium text-[#444]">Confirm Password</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            required
                                            className="h-[40px] pl-10 pr-10 text-[13px] rounded-[8px] border border-[#d7d7d2] focus-visible:ring-1 focus-visible:ring-[#4f8f1f] focus-visible:ring-offset-0"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#555]">
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="mt-4 h-[40px] w-full rounded-full bg-[#4f8f1f] text-[15px] font-semibold text-white hover:bg-[#467f1c]">
                                Sign Up
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-[12px] text-[#6f6f6f]">
                    <div className="flex items-center gap-3">
                        <button className="hover:text-[#4b4b4b]">Privacy Policy</button>
                        <span>·</span>
                        <button className="hover:text-[#4b4b4b]">Terms of Service</button>
                    </div>
                    <p>
                        Already have an account?{" "}
                        <Link to="/sign-in" className="font-medium text-[#4f8f1f] hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
