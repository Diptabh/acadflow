import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [statusData, setStatusData] = useState<any>({ ca1: null, ca2: null });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Fetch subjects
        const fetchSubjects = async () => {
            try {
                // To do: Student might only see their enrolled subjects, but we can just use the public subjects endpoint for now
                // Alternatively, if subjects require faculty token, we should have a public or student specific one.
                // Assuming `/api/subjects` allows student or we mock it.
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/subjects`);
                setSubjects(res.data);
                if (res.data.length > 0) setSelectedSubjectId(res.data[0].id);
            } catch (error) {
                console.error(error);
                // Mock subjects for test
                setSubjects([{id: '1', name: 'Mathematics (MA101)'}]);
                setSelectedSubjectId('1');
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubjectId) return;
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload/status/${selectedSubjectId}`);
                setStatusData(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStatus();
    }, [selectedSubjectId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, caType: string) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedSubjectId) return;
        const file = e.target.files[0];

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (caType === 'ca1' && !['ppt', 'pptx'].includes(ext || '')) {
            alert("Only PPT/PPTX files are allowed for CA1");
            return;
        }
        if (caType === 'ca2' && !['pdf', 'doc', 'docx'].includes(ext || '')) {
            alert("Only PDF/DOC/DOCX files are allowed for CA2");
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert("File size exceeds 50MB limit");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload/${caType}/${selectedSubjectId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Uploaded successfully");
            // Refresh status
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/upload/status/${selectedSubjectId}`);
            setStatusData(res.data);
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.detail || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
            </div>

            <div className="bg-white p-6 rounded shadow max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">My Submissions</h2>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Select Subject</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={selectedSubjectId}
                        onChange={e => setSelectedSubjectId(e.target.value)}
                    >
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                {uploading && <div className="mb-4 text-blue-600 font-bold">Uploading... Please wait.</div>}

                <div className="space-y-6">
                    {/* CA1 */}
                    <div className="border p-4 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">CA1 Submission (PPT)</h3>
                            {statusData.ca1 ? (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Submitted</span>
                            ) : (
                                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">Pending</span>
                            )}
                        </div>
                        {statusData.ca1 && <p className="text-sm text-gray-600 mb-2">Current file: {statusData.ca1.ppt_title || 'Uploaded'}</p>}

                        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer inline-block text-sm">
                            {statusData.ca1 ? 'Re-upload PPT' : 'Upload PPT'}
                            <input type="file" className="hidden" accept=".ppt,.pptx" onChange={e => handleFileUpload(e, 'ca1')} disabled={uploading} />
                        </label>
                    </div>

                    {/* CA2 */}
                    <div className="border p-4 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">CA2 Submission (Report)</h3>
                            {statusData.ca2 ? (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Submitted</span>
                            ) : (
                                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">Pending</span>
                            )}
                        </div>
                        {statusData.ca2 && <p className="text-sm text-gray-600 mb-2">Current file: {statusData.ca2.assignment_title || 'Uploaded'}</p>}

                        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer inline-block text-sm">
                            {statusData.ca2 ? 'Re-upload Report' : 'Upload Report'}
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'ca2')} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
