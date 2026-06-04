import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
    const { role } = useAuth();
    const location = useLocation();

    const facultyLinks = [
        { name: 'Dashboard', path: '/faculty/dashboard' },
        { name: 'Subjects', path: '/faculty/subjects' },
        { name: 'Students', path: '/faculty/students' },
        { name: 'Settings', path: '/faculty/settings' },
    ];

    const studentLinks = [
        { name: 'Dashboard', path: '/student/dashboard' },
    ];

    const links = role === 'faculty' ? facultyLinks : studentLinks;

    return (
        <div className="w-64 bg-gray-800 min-h-screen text-white p-4">
            <h2 className="text-xl font-bold mb-6">AcadFlow</h2>
            <ul>
                {links.map(link => (
                    <li key={link.path} className="mb-2">
                        <Link
                            to={link.path}
                            className={`block px-4 py-2 rounded ${location.pathname === link.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
