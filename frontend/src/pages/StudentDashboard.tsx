import React from 'react';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard: React.FC = () => {
    const { logout } = useAuth();
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
    );
};
