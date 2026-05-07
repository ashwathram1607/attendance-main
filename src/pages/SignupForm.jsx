import logo from "../assets/logo.png";
import { LABELS } from "../constants/labels";

export default function SignupForm({ handleChange, handleSubmit, formData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-6 transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Please fill in the details below to get started
        </p>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {LABELS.NAME}
          </label>
          <input
            type="text"
            name="Name"
            placeholder="Enter your name"
            onChange={handleChange}
            value={formData.Name}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {LABELS.EMAIL}
          </label>
          <input
            type="email"
            name="Email"
            placeholder="you@example.com"
            onChange={handleChange}
            value={formData.Email}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Role
          </label>
          <select
            name="Role"
            onChange={handleChange}
            value={formData.Role}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Designation
          </label>
          <input
            type="text"
            name="Designation"
            placeholder="Enter designation"
            onChange={handleChange}
            value={formData.Designation}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            type="text"
            name="EmployeeId"
            placeholder="Enter employee ID"
            onChange={handleChange}
            value={formData.EmployeeId}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>
        {/* Date of Joining */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Joining
          </label>
          <input
            type="date"
            name="DateOfJoining"
            onChange={handleChange}
            value={formData.DateOfJoining}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full shadow-md transition-all duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-700"
          >
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
