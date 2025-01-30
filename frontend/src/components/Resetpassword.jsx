
import React, { useState } from 'react'

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError("Please fill in both fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        setError("");
        setSuccessMessage("Password reset successfully!");
        console.log("New Password:", newPassword);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage:
                    'url("https://static.zohocdn.com/iam/v2/components/images/bg.49756b7c711696d95133fa95451f8e13.svg")',
            }}
        >
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Section */}
                <div
                    className="hidden md:flex md:w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://media.istockphoto.com/id/1412330787/vector/reset-password-action.jpg?s=612x612&w=0&k=20&c=Vyk40Jz-PxLlo1ZumCfJfCN0GF2_w1W3W7tgJHj-h2U=")',
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "transparent",
                    }}
                ></div>

                {/* Form Section */}
                <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-lg p-8 sm:p-10 bg-white bg-opacity-90 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h2 className="mb-6 text-3xl sm:text-4xl font-extrabold text-center text-bgprimary">
                        Reset Password
                    </h2>
                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg shadow-lg">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-lg shadow-lg">
                            {successMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="mb-6">
                            <label
                                htmlFor="newPassword"
                                className="block mb-2 text-sm font-medium text-gray-800"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-sm border border-grey rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                                placeholder="Enter new password"
                            />
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-6">
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-gray-800"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-sm border border-grey rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {/* Submit */}
                        <div className="mb-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-sm font-semibold text-white bg-bgprimary rounded-lg hover:bg-black focus:ring-2 focus:ring-bgprimary focus:outline-none"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <div className="text-sm text-center text-gray-600">
                        Remembered your password?{" "}
                        <a href="/" className="text-blue-600 hover:underline">
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


