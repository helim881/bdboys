"use client";

import { registerUserAction } from "@/actions/action.register";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";

// 1. Define Types
interface FormDataType {
  email: string;
  password: string;
  name: string;
  phone: string;
  confirmPassword: string;
}

interface ErrorsType {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  confirmPassword?: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});

  // 2. Typed Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ErrorsType]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): ErrorsType => {
    const newErrors: ErrorsType = {};
    if (!formData.email) newErrors.email = "ইমেইল আবশ্যক";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "সঠিক ইমেইল দিন";

    if (!formData.password) newErrors.password = "পাসওয়ার্ড আবশ্যক";
    else if (formData.password.length < 6)
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর দিন";

    if (!isLogin) {
      if (!formData.name) newErrors.name = "নাম আবশ্যক";
      if (!formData.phone) newErrors.phone = "ফোন নম্বর আবশ্যক";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setErrors({ email: "ইমেইল বা পাসওয়ার্ড ভুল" });
        } else {
          toast.success("🎉 Login successful! Welcome back!");
          const session = await getSession();
          const role = session?.user?.role || "user";
          router.push(`/${role.toLocaleLowerCase()}/dashboard`);
        }
      } else {
        // --- REGISTER LOGIC ---
        const res = await registerUserAction(formData);
        if (res.success) {
          setSuccess(true);
          setIsLogin(true); // Switch to login after registration
        } else {
          setErrors({ email: res.error });
        }
      }
    } catch (err) {
      setErrors({ email: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-[450px] z-10">
        {/* Auth Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white p-8">
          {/* Custom Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${
                isLogin ? "left-1" : "left-[calc(50%+2px)]"
              }`}
            ></div>
            <button
              onClick={() => {
                setIsLogin(true);
                setSuccess(false);
              }}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors ${
                isLogin ? "text-red-600" : "text-slate-500"
              }`}
            >
              লগইন
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setSuccess(false);
              }}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors ${
                !isLogin ? "text-red-600" : "text-slate-500"
              }`}
            >
              রেজিস্টার
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <InputField
                label="আপনার নাম"
                name="name"
                icon={<User size={19} />}
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="নাম লিখুন"
              />
            )}

            <InputField
              label="ইমেইল এড্রেস"
              name="email"
              type="email"
              icon={<Mail size={19} />}
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="example@mail.com"
            />

            {!isLogin && (
              <InputField
                label="ফোন নম্বর"
                name="phone"
                type="tel"
                icon={<Phone size={19} />}
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="০১৭XXXXXXXX"
              />
            )}

            <InputField
              label="পাসওয়ার্ড"
              name="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock size={19} />}
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="••••••••"
              toggleIcon={
                showPassword ? <EyeOff size={19} /> : <Eye size={19} />
              }
              onToggleClick={() => setShowPassword(!showPassword)}
            />

            {!isLogin && (
              <InputField
                label="পাসওয়ার্ড নিশ্চিত করুন"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                icon={<Lock size={19} />}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                toggleIcon={
                  showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />
                }
                onToggleClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-red-200 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isLogin ? (
                "প্রবেশ করুন"
              ) : (
                "অ্যাকাউন্ট তৈরি করুন"
              )}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {success && (
            <div className="mt-6 flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
              <CheckCircle className="text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-bold text-emerald-800">
                {isLogin ? "লগইন সফল!" : "রেজিস্ট্রেশন সফল!"}
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs px-4 leading-relaxed">
          অ্যাকাউন্ট তৈরি করার মাধ্যমে আপনি আমাদের{" "}
          <span className="text-slate-600 font-bold underline">শর্তাবলী</span>{" "}
          এবং{" "}
          <span className="text-slate-600 font-bold underline">
            গোপনীয়তা নীতি
          </span>{" "}
          মেনে নিচ্ছেন।
        </p>
      </div>
    </div>
  );
}

// 3. Reusable Input Component for Cleanliness
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  icon: React.ReactNode;
  placeholder: string;
  toggleIcon?: React.ReactNode;
  onToggleClick?: () => void;
}

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  icon,
  placeholder,
  toggleIcon,
  onToggleClick,
}: InputProps) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[13px] font-bold text-slate-600 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border ${
            error ? "border-red-300 ring-2 ring-red-50" : "border-slate-100"
          } rounded-2xl pl-12 pr-12 py-3.5 text-sm outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all placeholder:text-slate-300`}
        />
        {toggleIcon && (
          <button
            type="button"
            onClick={onToggleClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {toggleIcon}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 ml-1 text-red-500">
          <AlertCircle size={14} />
          <span className="text-xs font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}
