import React, { useState, useEffect } from "react";
import Navbar from "../../CoachComponents/NavBar";
import Footer from "../../GuestComponents/Footer";
import api from "../../Services/api";

function CoachManageTeams() {
    const [sports, setSports] = useState([]);
    const [selectedSportIndex, setSelectedSportIndex] = useState(null);

    // Modal Visibility States
    const [showSportModal, setShowSportModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");

    // Form States
    const [sportForm, setSportForm] = useState({ name: "", description: "" });
    const [teamForm, setTeamForm] = useState({ id: null, name: "", members: [] });
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetching approved sports with nested Teams and Members
            const res = await api.get("/sports/my-approved");
            setSports(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    /* ---------- HANDLERS FOR SPORT REQUEST ---------- */
    const handleSendSportRequest = async () => {
        if (!sportForm.name) return;
        try {
            await api.post("/sports", {
                sport_name: sportForm.name,
                description: sportForm.description
            });
            setShowSportModal(false);
            setSportForm({ name: "", description: "" });
            setConfirmMessage("Your sport request has been sent to the admin.");
            setShowConfirmBox(true);
        } catch (error) {
            console.error("Sport Request Error:", error);
            alert("Failed to send sport request.");
        }
    };

    /* ---------- HANDLERS FOR TEAM (CREATE / EDIT / REMOVE) ---------- */
    const handleSendTeamRequest = async () => {
        if (!teamForm.name || selectedSportIndex === null) return;
        try {
            if (isEditing) {
                // Update existing team
                await api.put(`/teams/${teamForm.id}`, {
                    team_name: teamForm.name,
                    members: teamForm.members
                });
                setConfirmMessage("Team changes submitted for admin approval.");
            } else {
                // Create new team request
                await api.post("/teams", {
                    team_name: teamForm.name,
                    sport_id: sports[selectedSportIndex].sport_id,
                    members: teamForm.members
                });
                setConfirmMessage("Your team request has been sent to the admin.");
            }
            setShowTeamModal(false);
            setIsEditing(false);
            setTeamForm({ id: null, name: "", members: [] });
            setShowConfirmBox(true);
            fetchData(); // Refresh data grid
        } catch (error) { console.error(error); }
    };

    const handleEditTeam = (team) => {
        setIsEditing(true);
        setTeamForm({
            id: team.team_id,
            name: team.team_name,
            members: team.TeamMembers || []
        });
        setShowTeamModal(true);
    };

    const openDeleteModal = (team) => {
        setTeamToDelete(team);
        setShowDeleteModal(true);
    };

    const confirmRemoveTeam = async () => {
        if (!teamToDelete || !teamToDelete.team_id) return;
        try {
            await api.delete(`/teams/${teamToDelete.team_id}`);
            setShowDeleteModal(false);
            setTeamToDelete(null);
            setConfirmMessage("The team has been successfully removed.");
            setShowConfirmBox(true);
            fetchData();
        } catch (error) {
            setShowDeleteModal(false);
            console.error("Removal Error:", error);
        }
    };

    const handleAddMemberField = () => {
        setTeamForm({
            ...teamForm,
            members: [...teamForm.members, {
                member_name: "", registration_number: "",
                role: "Player", faculty: "Faculty of Applied Science", year: ""
            }]
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Coach Manage Teams</h1>

                    <div className="flex gap-3 mb-8">
                        <button onClick={() => setShowSportModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">Request New Sport</button>
                        <button
                            disabled={selectedSportIndex === null}
                            onClick={() => { setIsEditing(false); setTeamForm({id:null, name:"", members:[]}); setShowTeamModal(true); }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-green-700 transition shadow-md"
                        >
                            Request New Team
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sports.map((sport, sIdx) => (
                            <div key={sport.sport_id}>
                                <div
                                    onClick={() => setSelectedSportIndex(selectedSportIndex === sIdx ? null : sIdx)}
                                    className={`p-4 rounded-xl shadow cursor-pointer border-2 transition ${selectedSportIndex === sIdx ? "border-blue-600 bg-blue-50" : "bg-white border-transparent"}`}
                                >
                                    <div className="h-32 bg-cover bg-center rounded mb-2" style={{ backgroundImage: `url(${sport.image})` }} />
                                    <h3 className="font-bold text-center uppercase">{sport.sport_name}</h3>
                                </div>

                                {selectedSportIndex === sIdx && (
                                    <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                                        {sport.Teams?.filter(t => t.status === 'Active').map((team) => (
                                            <div key={team.team_id} className="flex justify-between items-center bg-white p-3 rounded border shadow-sm">
                                                <span className="font-medium text-gray-700">{team.team_name}</span>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditTeam(team)} className="text-blue-600 text-sm font-bold">Edit</button>
                                                    <button onClick={() => openDeleteModal(team)} className="text-red-600 text-sm font-bold">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* MODAL: SPORT REQUEST */}
            {showSportModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">New Sport Request</h2>
                        <div className="space-y-4">
                            <input className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Sport Name" value={sportForm.name} onChange={e => setSportForm({...sportForm, name: e.target.value})} />
                            <textarea className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Description/Reason" value={sportForm.description} onChange={e => setSportForm({...sportForm, description: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowSportModal(false)} className="px-4 py-2 text-gray-500 rounded">Cancel</button>
                            <button onClick={handleSendSportRequest} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold">Send Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: TEAM FORM */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">{isEditing ? "Edit Team" : "Request New Team"}</h3>
                        <input className="w-full border p-3 rounded-lg mb-6" placeholder="Team Name" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
                        <div className="border-t pt-4">
                            <h4 className="font-bold text-lg mb-4 text-gray-700">Members</h4>
                            <div className="max-h-64 overflow-y-auto">
                                {teamForm.members.map((m, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded border">
                                        <input className="border p-2 rounded" placeholder="Member Name" value={m.member_name} onChange={(e) => {
                                            const members = [...teamForm.members]; members[idx].member_name = e.target.value; setTeamForm({ ...teamForm, members });
                                        }} />
                                        <input className="border p-2 rounded" placeholder="Reg No" value={m.registration_number} onChange={(e) => {
                                            const members = [...teamForm.members]; members[idx].registration_number = e.target.value; setTeamForm({ ...teamForm, members });
                                        }} />
                                        <select className="border p-2 rounded text-sm" value={m.role} onChange={(e) => {
                                            const members = [...teamForm.members]; members[idx].role = e.target.value; setTeamForm({ ...teamForm, members });
                                        }}>
                                            <option value="Player">Player</option>
                                            <option value="Captain">Captain</option>
                                            <option value="Vice Captain">Vice Captain</option>
                                        </select>
                                        <select className="border p-2 rounded text-sm" value={m.faculty} onChange={(e) => {
                                            const members = [...teamForm.members]; members[idx].faculty = e.target.value; setTeamForm({ ...teamForm, members });
                                        }}>
                                            <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                                            <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                                            <option value="Faculty of Technology Studies">Faculty of Technology Studies</option>
                                        </select>
                                        <input type="number" className="border p-2 rounded" placeholder="Year" min={1} max={4} value={m.year} onChange={(e) => {
                                            const members = [...teamForm.members]; members[idx].year = e.target.value; setTeamForm({ ...teamForm, members });
                                        }} />
                                        <button onClick={() => {
                                            const members = teamForm.members.filter((_, i) => i !== idx); setTeamForm({ ...teamForm, members });
                                        }} className="text-red-600 text-sm font-bold text-left hover:underline">Remove Member</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddMemberField} className="bg-green-100 text-green-700 px-4 py-2 rounded font-bold hover:bg-green-200 transition mt-4">+ Add Member</button>
                        </div>
                        <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                            <button onClick={() => { setShowTeamModal(false); setIsEditing(false); }} className="px-4 py-2 text-gray-500 rounded">Cancel</button>
                            <button onClick={handleSendTeamRequest} className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold">{isEditing ? "Save Changes" : "Send Request"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: DELETE CONFIRMATION TEXT BOX */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center border-t-8 border-red-600 shadow-2xl animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Remove Team?</h3>
                        <p className="text-gray-600 mb-6 font-medium text-sm">Are you sure you want to remove <span className="font-bold text-red-600">"{teamToDelete?.team_name}"</span>? This action is permanent.</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={confirmRemoveTeam} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">Confirm Removal</button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SUCCESS CONFIRMATION */}
            {showConfirmBox && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[80]">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm border-t-8 border-green-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-600 mb-6">{confirmMessage}</p>
                        <button onClick={() => setShowConfirmBox(false)} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition">Close</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
export default CoachManageTeams;
