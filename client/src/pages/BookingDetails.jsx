import React, { useState } from "react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    governmentId: "",
    address: "",
    couponCode: "",
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log("Booking Details:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-slate-700">Book This Property</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="w-full p-2 border rounded-md"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Email Address</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full p-2 border rounded-md"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Government ID (optional) */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Government ID (optional)</label>
          <input
            type="text"
            name="governmentId"
            className="w-full p-2 border rounded-md"
            value={formData.governmentId}
            onChange={handleChange}
          />
        </div>

        {/* Address (optional) */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Address (optional)</label>
          <textarea
            name="address"
            className="w-full p-2 border rounded-md"
            rows="3"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Profile Photo (optional) */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Profile Photo (optional)</label>
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            className="w-full p-1 border rounded-md"
            onChange={handleChange}
          />
        </div>

        {/* Coupon Code */}
        <div>
          <label className="block mb-1 font-medium text-slate-600">Coupon Code</label>
          <input
            type="text"
            name="couponCode"
            className="w-full p-2 border rounded-md"
            value={formData.couponCode}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
