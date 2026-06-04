import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface SetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (subject: any, section: string) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onLoad }) => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [sections, setSections] = useState<string[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedSection, setSelectedSection] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const fetchFilters = async () => {
            try {
                const subRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects`);
                setSubjects(subRes.data);
                const secRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/sections`);
                setSections(secRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFilters();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLoad = () => {
        const subject = subjects.find(s => s.id === selectedSubjectId);
        if (subject && selectedSection) {
            onLoad(subject, selectedSection);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Assessment Setup</h2>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Subject</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={selectedSubjectId}
                        onChange={e => setSelectedSubjectId(e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Section</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={selectedSection}
                        onChange={e => setSelectedSection(e.target.value)}
                    >
                        <option value="">Select Section</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                    <button
                        onClick={handleLoad}
                        disabled={!selectedSubjectId || !selectedSection}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Load Students
                    </button>
                </div>
            </div>
        </div>
    );
};
