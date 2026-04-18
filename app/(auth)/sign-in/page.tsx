"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { ShoppingBag, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setAuthError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      setAuthError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-25 min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        {/* Left Side: Brand Visuals (Now on the right for variety, or switch classes to keep same) */}
        <div className="hidden  w-full md:w-1/2 bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] p-8 md:p-12 md:flex flex-col justify-center text-white text-center md:text-left">
          <div className="mb-8 flex justify-center md:justify-start">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
              <LockKeyhole className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Welcome Back!
          </h1>
          <p className="text-orange-50 text-lg opacity-90 max-w-md mx-auto md:mx-0">
            Log in to access your wishlist, track orders, and discover
            personalized deals just for you.
          </p>

          <div className="hidden md:block mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-orange-400 bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                Join 10k+ active shoppers this week
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-4 md:p-12 lg:p-16">
          <div className="mb-6">
            <h2
              style={{ fontFamily: "var(--font-lora)" }}
              className="text-3xl  font-bold text-gray-900 mb-2 text-center md:text-left"
            >
              Sign In
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Please enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-[#FFA500]"
                }`}
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#FFA500] hover:text-[#e69500] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-[#FFA500]"
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Auth Error Alert */}
            {authError && (
              <div className="text-red-700 px-3 rounded-xl text-sm font-medium">
                {authError}
              </div>
            )}

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FFA500] hover:bg-[#e69500] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-orange-100 hover:shadow-orange-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center group"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Footer Link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="text-[#FFA500] font-bold hover:underline decoration-2 underline-offset-4"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await signIn("credentials", { email, password, callbackUrl: "/" });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//         <h1 className="text-2xl mb-4">Sign In</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="block w-full mb-2 p-2 border"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="block w-full mb-4 p-2 border"
//           required
//         />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }
