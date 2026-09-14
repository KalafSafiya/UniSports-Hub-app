import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
function renderPage(role = 'Admin') {
    return render(<MemoryRouter initialEntries={['/private']}><Routes>
        <Route path="/login" element={<div>Sign in required</div>} />
        <Route element={<ProtectedRoute role={role} />}><Route path="/private" element={<div>Protected content</div>} /></Route>
    </Routes></MemoryRouter>);
}
beforeEach(() => localStorage.clear());
test('guests are redirected to login', () => { renderPage(); expect(screen.getByText('Sign in required')).toBeInTheDocument(); });
test('malformed session data redirects instead of crashing', () => { localStorage.setItem('user', '{'); localStorage.setItem('token', 'token'); renderPage(); expect(screen.getByText('Sign in required')).toBeInTheDocument(); });
test('coaches cannot open admin pages', () => { localStorage.setItem('user', JSON.stringify({ user: { role: 'Coach' } })); localStorage.setItem('token', 'token'); renderPage(); expect(screen.getByText('Sign in required')).toBeInTheDocument(); });
test('admin sessions can open admin pages', () => { localStorage.setItem('user', JSON.stringify({ user: { role: 'Admin' } })); localStorage.setItem('token', 'token'); renderPage(); expect(screen.getByText('Protected content')).toBeInTheDocument(); });
