import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
                <div onClick={() => alert("CA1 Not Implemented Yet")} className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-blue-500 flex items-center justify-center h-32">
                    <h2 className="text-xl font-bold text-gray-700">CA1 Entry</h2>
                </div>
                <div onClick={() => alert("CA2 Not Implemented Yet")} className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-green-500 flex items-center justify-center h-32">
                    <h2 className="text-xl font-bold text-gray-700">CA2 Entry</h2>
                </div>
                <div onClick={() => navigate('/faculty/ca3')} className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-purple-500 flex items-center justify-center h-32">
                    <h2 className="text-xl font-bold text-gray-700">CA3 Entry</h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-sm">No recent activity to show.</div>
            </div>
        </div>
    );
};
