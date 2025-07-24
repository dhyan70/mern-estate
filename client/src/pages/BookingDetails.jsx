import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";
const BookingForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        governmentId: "",
        address: "",
        couponCode: "",
        profilePhoto: null,
        startDate: "",
        endDate: ""
    });
    const {currentUser } = useSelector((state)=>state.user)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    const datepickerRef = useRef(null);
    const { listingId } = useParams();


    console.log(listingId)
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            startDate: selectedStartDate || "",
            endDate: selectedEndDate || ""
        }));
    }, [selectedStartDate, selectedEndDate]);


    const calculateNights = () => {
        if (!selectedStartDate || !selectedEndDate) return 0;
        const start = new Date(selectedStartDate);
        const end = new Date(selectedEndDate);
        const timeDiff = end - start;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
    };


    const nights = calculateNights(); // diff between end and start date

    console.log(nights)
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePhoto") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/api/listing/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                listingId,
                nights,
                userid :currentUser.user._id,
                startDate :formData.startDate,
                endDate : formData.endDate
            }),
        });
        const { url } = await response.json(); // Get the session URL from the response

        window.location.href = url; // Redirect to Stripe Checkout

    };

    // calender code
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const days = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, days, 1).getDay();
        const daysInMonth = new Date(year, days + 1, 0).getDate();
        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, days, i);
            const dayString = day.toLocaleDateString("en-US");
            let className =
                "flex h-[46px] w-[46px] items-center justify-center rounded-full hover:bg-gray-2 dark:hover:bg-dark mb-2";

            if (selectedStartDate && dayString === selectedStartDate) {
                className += " bg-primary text-white dark:text-white rounded-r-none";
            }
            if (selectedEndDate && dayString === selectedEndDate) {
                className += " bg-primary text-white dark:text-white rounded-l-none";
            }
            if (
                selectedStartDate &&
                selectedEndDate &&
                new Date(day) > new Date(selectedStartDate) &&
                new Date(day) < new Date(selectedEndDate)
            ) {
                className += " bg-dark-3 rounded-none";
            }

            daysArray.push(
                <div
                    key={i}
                    className={className}
                    data-date={dayString}
                    onClick={() => handleDayClick(dayString)}
                >
                    {i}
                </div>,
            );
        }

        return daysArray;
    };
    const handleDayClick = (selectedDay) => {
        console.log("here is handle day click")
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(selectedDay);
            console.log("start date is", selectedStartDate)
            setSelectedEndDate(null);
            setFormData((prev) => ({
                ...prev,
                startDate: selectedDay,
                endDate: ""
            }))
        } else {
            if (new Date(selectedDay) < new Date(selectedStartDate)) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(selectedDay);
                console.log("the type id ", typeof (selectedDay))
                setFormData((prev) => ({
                    ...prev,
                    startDate: selectedDay,
                    endDate: selectedStartDate
                }))

            } else {
                setSelectedEndDate(selectedDay);
                setFormData((prev) => ({
                    ...prev,
                    endDate: selectedDay
                }))

            }
        }
    };

    const updateInput = () => {
        console.log("here is handle update ref")
        if (selectedStartDate && selectedEndDate) {
            return `${selectedStartDate} - ${selectedEndDate}`;
        } else if (selectedStartDate) {
            return selectedStartDate;
        } else {
            return "";
        }
    };

    const toggleDatepicker = () => {
        setIsOpen(!isOpen);
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
                        placeholder="EnterCoupon code"
                        className="w-full p-2 border rounded-md"
                        value={formData.couponCode}
                        onChange={handleChange}
                    />
                </div>


                <section className="bg-white py-4">
                    <div className="max-w-sm w-full" ref={datepickerRef}>
                        {/* Input field */}
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Pick date range"
                                className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700"
                                value={updateInput()}
                                onClick={toggleDatepicker}
                                readOnly
                            />
                            <span
                                onClick={toggleDatepicker}
                                className="absolute left-2 top-0 bottom-0 flex items-center justify-center text-gray-400 cursor-pointer"
                            >
                                📅
                            </span>
                        </div>

                        {/* Calendar panel */}
                        {isOpen && (
                            <div className="w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <p className="font-medium text-gray-800">
                                        {currentDate.toLocaleString("default", { day: "numeric" })}{" "}
                                        {currentDate.getFullYear()}
                                    </p>
                                    <div className="flex space-x-1">
                                        <button
                                            type="button" // ✅ Prevents form submission
                                            onClick={() =>
                                                setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
                                            }
                                            className="text-gray-500 hover:text-primary"
                                        >
                                            ←
                                        </button>
                                        <button
                                            type="button" // ✅ Prevents form submission
                                            onClick={() =>
                                                setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
                                            }
                                            className="text-gray-500 hover:text-primary"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>

                                {/* Weekdays */}
                                <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-1">
                                    {["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"].map((d) => (
                                        <div key={d}>{d}</div>
                                    ))}
                                </div>

                                {/* Calendar day */}
                                <div className="grid grid-cols-7 text-sm text-center">
                                    {renderCalendar()}
                                </div>

                                {/* Selected Dates */}
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
                                    <span>{selectedStartDate || "Start"}</span>
                                    <span>{selectedEndDate || "End"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>


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
