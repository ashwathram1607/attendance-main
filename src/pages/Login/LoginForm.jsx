import { LABELS } from "../../constants";
import logo from "../../../src/assets/logo.png";

export default function LoginForm({ handleChange, handleSubmit, formData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 px-4 py-8 rounded-3xl">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-2xl border border-gray-200 p-8 space-y-6 rounded-lg transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 uppercase tracking-wide">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Please sign in to continue
        </p>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {LABELS.EMAIL}
          </label>
          <input
            type="email"
            name="Email"
            placeholder="you@ascentwarecorp.com"
            onChange={handleChange}
            value={formData.Email}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {LABELS.PASSWORD}
          </label>
          <input
            type="password"
            name="Password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.Password}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300"
        >
          Sign In
        </button>
        <p className="text-right text-sm text-blue-500 cursor-pointer">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </form>
    </div>
  );
}
