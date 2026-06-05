import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const FacultyStudents: React.FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [sections, setSections] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [showAddModal, setShowAddModal] = useState(false);
    const { token } = useAuth();

    // Add student form state
    const [formData, setFormData] = useState({
        name: '', university_roll: '', programme: '', year: 1, semester: 1, section: ''
    });

    const fetchStudents = async () => {
        try {
            const url = selectedSection
                ? `/api/students?section_id=${selectedSection}`
                : `/api/students`;
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${url}`);
            setStudents(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/sections`);
            setSections(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSections();
        fetchStudents();
    }, [selectedSection]);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/students`, formData);
            setShowAddModal(false);
            fetchStudents();
            fetchSections();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/students/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchStudents();
            fetchSections();
            alert("Students imported successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to import students.");
        }
    };

    const getSectionDisplayName = (s: any) => {
        return `${s.programme} ${s.year}${s.section}`;
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Students Management</h1>
            <div className="flex gap-4 mb-6">
                <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Add Student
                </button>
                <label className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
                    Import Excel
                    <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                </label>
                <select
                    value={selectedSection}
                    onChange={e => setSelectedSection(e.target.value)}
                    className="border rounded px-4 py-2"
                >
                    <option value="">All Sections</option>
                    {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
            </div>

            <table className="w-full bg-white shadow rounded text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-4">Name</th>
                        <th className="p-4">Roll No</th>
                        <th className="p-4">Section</th>
                        <th className="p-4">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student: any) => (
                        <tr key={student.id || student.university_roll} className="border-t">
                            <td className="p-4">{student.name}</td>
                            <td className="p-4">{student.university_roll}</td>
                            <td className="p-4">{getSectionDisplayName(student)}</td>
                            <td className="p-4">{student.email || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
                        <form onSubmit={handleAddStudent}>
                            <input className="border p-2 w-full mb-2" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input className="border p-2 w-full mb-2" placeholder="Roll No" required value={formData.university_roll} onChange={e => setFormData({...formData, university_roll: e.target.value})} />
                            <input className="border p-2 w-full mb-2" placeholder="Programme (e.g. CSE-AIML)" required value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} />
                            <input type="number" className="border p-2 w-full mb-2" placeholder="Year (e.g. 2)" required value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                            <input type="number" className="border p-2 w-full mb-2" placeholder="Semester (e.g. 4)" required value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} />
                            <input className="border p-2 w-full mb-4" placeholder="Section Letter (e.g. D)" required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
