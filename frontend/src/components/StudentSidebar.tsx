import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const StudentSidebar: React.FC = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'My Marks', path: '/student/marks' },
    ];

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
