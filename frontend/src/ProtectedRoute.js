import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute({ role }) {
    let user;
    try { const stored = JSON.parse(localStorage.getItem('user')); user = stored?.user ?? stored; } catch { user = null; }
    if (!localStorage.getItem('token') || user?.role !== role) return <Navigate to="/login" replace />;
    return <Outlet />;
}
