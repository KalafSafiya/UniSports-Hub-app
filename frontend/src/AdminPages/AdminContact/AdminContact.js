import React, { useState, useEffect } from "react";
import Navbar from "../../AdminComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import {
    downloadContactAttachment,
    getAllContactRequests,
    updateContactRequestStatus
} from '../../Services/contactRequestService';

function AdminContactRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ===============================
       LOAD CONTACT REQUESTS
       =============================== */
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getAllContactRequests();
                setRequests(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load contact requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    /* ===============================
       MARK AS REPLIED
       =============================== */
    const handleMarkReplied = async (id) => {
        try {
            await updateContactRequestStatus(id, "Read");

            setRequests(prev =>
                prev.map(req =>
                    req.request_id === id
                        ? { ...req, status: "Read" }
                        : req
                )
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleAttachment = async (request) => {
        try { await downloadContactAttachment(request.request_id, request.attachment); }
        catch { alert('Failed to download attachment'); }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20 pb-10 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Contact Requests
                    </h1>

                    {loading && (
                        <p className="text-gray-500">Loading requests...</p>
                    )}

                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}

                    {!loading && requests.length === 0 && (
                        <p className="text-gray-500">No contact requests found.</p>
                    )}

                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.request_id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {req.subject}
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                                    req.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {req.status}
                                            </span>
                                        </h2>

                                        <p className="text-gray-600 dark:text-gray-300">
                                            From: {req.name} ({req.role})
                                            {req.university_id && `, ID: ${req.university_id}`}
                                        </p>

                                        <p className="text-gray-600 dark:text-gray-300">
                                            Email: {req.email}
                                        </p>

                                        <p className="mt-2 text-gray-700 dark:text-gray-200">
                                            {req.message}
                                        </p>

                                        {req.attachment && (
                                            <p className="mt-2">
                                                Attachment:{" "}
                                                <a
                                                    href="#attachment"
                                                    onClick={(event) => { event.preventDefault(); handleAttachment(req); }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    View File
                                                </a>
                                            </p>
                                        )}
                                    </div>

                                    {req.status === "Pending" && (
                                        <button
                                            onClick={() => handleMarkReplied(req.request_id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminContactRequests;
