import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const FacultySubjects: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [cos, setCos] = useState<any[]>([]);
    const [showAddCO, setShowAddCO] = useState(false);
    const { token } = useAuth();

    // Form States
    const [subjectData, setSubjectData] = useState({
        code: '', name: '', programme: '', semester: 1, full_marks_ca1: 20, full_marks_ca2: 20, full_marks_ca3: 50
    });

    const [coData, setCoData] = useState({
        co_number: '', description: '', bloom_level: 'BL1'
    });

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects`);
            setSubjects(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCOs = async (subjectId: string) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects/${subjectId}/cos`);
            setCos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects`, subjectData);
            setShowAddSubject(false);
            fetchSubjects();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddCO = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects/${selectedSubject.id}/cos`, coData);
            setShowAddCO(false);
            fetchCOs(selectedSubject.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Subjects Management</h1>
            <button onClick={() => setShowAddSubject(true)} className="px-4 py-2 bg-blue-500 text-white rounded mb-6">
                Add Subject
            </button>

            <div className="flex gap-8">
                {/* Subjects List */}
                <div className="w-1/2">
                    <h2 className="text-xl font-semibold mb-2">My Subjects</h2>
                    <ul className="space-y-2">
                        {subjects.map(sub => (
                            <li
                                key={sub.id || sub.code}
                                className={`p-4 border rounded cursor-pointer ${selectedSubject?.id === sub.id ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
                                onClick={() => {
                                    setSelectedSubject(sub);
                                    if(sub.id) fetchCOs(sub.id);
                                }}
                            >
                                <div className="font-bold">{sub.code} - {sub.name}</div>
                                <div className="text-sm text-gray-600">{sub.programme} | Sem {sub.semester}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Course Outcomes List */}
                {selectedSubject && (
                    <div className="w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Course Outcomes ({selectedSubject.code})</h2>
                            <button onClick={() => setShowAddCO(true)} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                                Add CO
                            </button>
                        </div>
                        {cos.length > 0 ? (
                            <ul className="space-y-2">
                                {cos.map(co => (
                                    <li key={co.id || co.co_number} className="p-3 border rounded bg-white">
                                        <div className="flex justify-between font-bold text-sm">
                                            <span>{co.co_number}</span>
                                            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">{co.bloom_level}</span>
                                        </div>
                                        <div className="text-sm mt-1 text-gray-700">{co.description}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 border border-dashed rounded text-center text-gray-500">
                                No Course Outcomes found for this subject.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddSubject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
                        <form onSubmit={handleAddSubject}>
                            <input className="border p-2 w-full mb-2" placeholder="Subject Code (e.g. CS101)" required value={subjectData.code} onChange={e => setSubjectData({...subjectData, code: e.target.value})} />
                            <input className="border p-2 w-full mb-2" placeholder="Subject Name" required value={subjectData.name} onChange={e => setSubjectData({...subjectData, name: e.target.value})} />
                            <input className="border p-2 w-full mb-2" placeholder="Programme" required value={subjectData.programme} onChange={e => setSubjectData({...subjectData, programme: e.target.value})} />
                            <input type="number" className="border p-2 w-full mb-2" placeholder="Semester" required value={subjectData.semester} onChange={e => setSubjectData({...subjectData, semester: parseInt(e.target.value)})} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowAddSubject(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddCO && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add Course Outcome</h2>
                        <form onSubmit={handleAddCO}>
                            <input className="border p-2 w-full mb-2" placeholder="CO Number (e.g. CO1)" required value={coData.co_number} onChange={e => setCoData({...coData, co_number: e.target.value})} />
                            <textarea className="border p-2 w-full mb-2" placeholder="Description" required value={coData.description} onChange={e => setCoData({...coData, description: e.target.value})} />
                            <select className="border p-2 w-full mb-4" value={coData.bloom_level} onChange={e => setCoData({...coData, bloom_level: e.target.value})}>
                                {['BL1', 'BL2', 'BL3', 'BL4', 'BL5', 'BL6'].map(bl => (
                                    <option key={bl} value={bl}>{bl}</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAddCO(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
