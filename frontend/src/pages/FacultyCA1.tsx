import React, { useState } from 'react';
import axios from 'axios';
import { SetupModal } from '../components/SetupModal';

export const FacultyCA1: React.FC = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(true);
    const [subject, setSubject] = useState<any>(null);
    const [section, setSection] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);

    const handleLoadSetup = async (selectedSubject: any, selectedSection: string) => {
        setSubject(selectedSubject);
        setSection(selectedSection);
        setIsSetupOpen(false);
        try {
            // Need a route to get students + CA1 status
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/students?subject_id=${selectedSubject.id}&section_id=${selectedSection}`);
            // Note: Currently using CA3 students route as a quick mock to get student list.
            // In a real app, we'd have a specific CA1 route to get CA1 submission info.
            // For now, let's just mock the submission URL presence
            const mockedData = res.data.map((s:any) => ({
                ...s,
                ca1_status: s.id === "1" ? "submitted" : "pending",
                ppt_url: s.id === "1" ? "https://dummy.url/file.ppt" : null
            }));
            setStudents(mockedData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8">
            <SetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onLoad={handleLoadSetup} />

            {subject && (
                <>
                    <h1 className="text-2xl font-bold mb-2">CA1 Submissions</h1>
                    <p className="text-gray-600 mb-6">{subject.name} | Section: {section}</p>

                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Roll No</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Submission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-t">
                                        <td className="p-4">{student.name}</td>
                                        <td className="p-4">{student.university_roll}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${student.ca1_status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}>
                                                {student.ca1_status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {student.ppt_url ? (
                                                <a href={student.ppt_url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                                    View PPT
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No file</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};
