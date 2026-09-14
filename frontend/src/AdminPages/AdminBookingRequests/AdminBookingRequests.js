import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function AdminBookingRequests() {
    const [bookings, setBookings] = useState([]);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: "success", message: "" });
    const [loadingId, setLoadingId] = useState(null); // Track which booking is processing

    useEffect(() => {
        fetchBookings();
    }, []);

    // Fetch pending bookings
    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings/pending");
            setBookings(res.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Open modal
    const triggerModal = (type, message) => {
        setModalConfig({ type, message });
        setShowModal(true);
    };

    // Approve booking
    const handleApprove = async (booking) => {
        try {
            setLoadingId(booking.booking_id); // start loading

            const response = await api.put(`/bookings/${booking.booking_id}/status`, {
                status: "Approved",
                user_email: booking.email,
                event_name: booking.event_name,
            });

            setBookings((prev) => prev.filter((b) => b.booking_id !== booking.booking_id));
            triggerModal("success", response.data.message);
        } catch (error) {
            const msg = error.response?.data?.message || "This slot is already booked.";
            triggerModal("error", msg);
        } finally {
            setLoadingId(null); // stop loading
        }
    };

    // Reject booking
    const handleRejectSubmit = async (booking) => {
        if (!rejectReason.trim()) {
            triggerModal("error", "Please provide a rejection reason.");
            return;
        }

        try {
            setLoadingId(booking.booking_id); // start loading

            const response = await api.put(`/bookings/${booking.booking_id}/status`, {
                status: "Rejected",
                reason: rejectReason,
                user_email: booking.email,
                event_name: booking.event_name,
            });

            setBookings((prev) => prev.filter((b) => b.booking_id !== booking.booking_id));
            setRejectingId(null);
            setRejectReason("");
            triggerModal("success", response.data.message);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to reject booking.";
            triggerModal("error", msg);
        } finally {
            setLoadingId(null); // stop loading
        }
    };

    // Format time
    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Guest Booking Requests
                    </h1>

                    {bookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow">
                            No pending booking requests.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((b) => (
                                <div key={b.booking_id} className="bg-white rounded-lg shadow p-6 border">
                                    <div className="flex flex-col md:flex-row justify-between items-start">

                                        {/* Booking Info */}
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-blue-900 mb-2">{b.event_name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                                                <p><strong>User:</strong> {b.user_name} ({b.role})</p>
                                                <p><strong>Email:</strong> {b.email}</p>
                                                <p><strong>Venue:</strong> {b.Venue ? b.Venue.name : "N/A"}</p>
                                                <p><strong>Sport:</strong> {b.Sport ? b.Sport.sport_name : "N/A"}</p>
                                                <p><strong>Date:</strong> {b.date}</p>
                                                <p><strong>Time:</strong> {formatTime(b.start_time)} - {formatTime(b.end_time)}</p>
                                            </div>
                                            {b.additional_notes && (
                                                <p className="mt-3 text-sm italic text-gray-500">Notes: {b.additional_notes}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3 mt-4 md:mt-0 min-w-[240px]">
                                            {rejectingId === b.booking_id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                                        placeholder="Type rejection reason..."
                                                        rows="3"
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRejectSubmit(b)}
                                                            disabled={loadingId === b.booking_id}
                                                            className={`flex-1 py-2.5 rounded-lg font-bold ${loadingId === b.booking_id ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                                                                }`}
                                                        >
                                                            {loadingId === b.booking_id ? "Processing..." : "Send & Reject"}
                                                        </button>
                                                        <button
                                                            onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                                            className="flex-1 bg-gray-200 py-2.5 rounded-lg font-semibold hover:bg-gray-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={() => handleApprove(b)}
                                                        disabled={loadingId === b.booking_id}
                                                        className={`w-full py-3 px-4 rounded-xl font-bold shadow-md flex items-center justify-center ${loadingId === b.booking_id ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                                                            }`}
                                                    >
                                                        {loadingId === b.booking_id ? (
                                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                            </svg>
                                                        ) : null}
                                                        {loadingId === b.booking_id ? "Processing..." : "Approve Request"}
                                                    </button>

                                                    <button
                                                        onClick={() => setRejectingId(b.booking_id)}
                                                        disabled={loadingId === b.booking_id}
                                                        className={`w-full py-3 px-4 rounded-xl font-bold shadow-md ${loadingId === b.booking_id ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                                                            }`}
                                                    >
                                                        {loadingId === b.booking_id ? "Processing..." : "Reject Request"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalConfig.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}>
                            {modalConfig.type === "success" ? "✓" : "✕"}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            {modalConfig.type === "success" ? "Success!" : "Error"}
                        </h2>
                        <p className="text-gray-600 mb-8">{modalConfig.message}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className={`w-full py-3 rounded-xl font-bold text-white ${modalConfig.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default AdminBookingRequests;

