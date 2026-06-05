import React, { useState } from 'react';
import axios from 'axios';
import { SetupModal } from '../components/SetupModal';

export const FacultyCA2: React.FC = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(true);
    const [subject, setSubject] = useState<any>(null);
    const [section, setSection] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);

    // Evaluation states
    const [evaluations, setEvaluations] = useState<Record<string, {marks: number|string, ai_reasoning: string}>>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // File Modal state
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [aiSuggestion, setAiSuggestion] = useState<any>(null);
    const [fetchingAi, setFetchingAi] = useState(false);

    // Progress modal
    const [bulkProgress, setBulkProgress] = useState<{current: number, total: number} | null>(null);

    const handleLoadSetup = async (selectedSubject: any, selectedSection: string) => {
        setSubject(selectedSubject);
        setSection(selectedSection);
        setIsSetupOpen(false);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/students?subject_id=${selectedSubject.id}&section_id=${selectedSection}`);
            setStudents(res.data);

            const newEvals: Record<string, any> = {};
            res.data.forEach((s: any) => {
                newEvals[s.id] = { marks: s.marks ?? '', ai_reasoning: s.reasoning ?? '' };
            });
            setEvaluations(newEvals);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkChange = (studentId: string, val: string) => {
        const parsed = val === '' ? '' : parseInt(val);
        setEvaluations(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], marks: parsed }
        }));
        setHasUnsavedChanges(true);
    };

    const handleGetAI = async (student: any) => {
        setSelectedStudent(student);
        setAiSuggestion(null);
    };

    const runAIForStudent = async (student: any) => {
        if (!student.submission_url || !subject) return;
        setFetchingAi(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/ai-suggest`, {
                subject_id: subject.id,
                file_url: student.submission_url
            });
            setAiSuggestion(res.data);
        } catch (error) {
            console.error(error);
            alert("AI Suggestion failed");
        } finally {
            setFetchingAi(false);
        }
    };

    const handleAcceptAI = () => {
        if (selectedStudent && aiSuggestion) {
            setEvaluations(prev => ({
                ...prev,
                [selectedStudent.id]: {
                    marks: aiSuggestion.suggested_marks,
                    ai_reasoning: aiSuggestion.reasoning
                }
            }));
            setHasUnsavedChanges(true);
            setSelectedStudent(null);
        }
    };

    const handleBulkAI = async () => {
        if (!subject) return;
        const targetStudents = students.filter(s => s.submission_url);
        setBulkProgress({ current: 0, total: targetStudents.length });

        const newEvals = { ...evaluations };
        let count = 0;

        for (const student of targetStudents) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/ai-suggest`, {
                    subject_id: subject.id,
                    file_url: student.submission_url
                });
                newEvals[student.id] = { marks: res.data.suggested_marks, ai_reasoning: res.data.reasoning };
            } catch (e) {
                console.error(e);
            }
            count++;
            setBulkProgress({ current: count, total: targetStudents.length });
        }

        setEvaluations(newEvals);
        setHasUnsavedChanges(true);
        setTimeout(() => setBulkProgress(null), 1000);
    };

    const handleSaveAll = async () => {
        if (!subject) return;
        try {
            for (const student of students) {
                const ev = evaluations[student.id];
                if (ev && ev.marks !== '') {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/evaluate`, {
                        subject_id: subject.id,
                        student_id: student.id,
                        marks: ev.marks,
                        ai_reasoning: ev.ai_reasoning
                    });
                }
            }
            alert("Evaluations saved successfully!");
            setHasUnsavedChanges(false);
            handleLoadSetup(subject, section);
        } catch (error) {
            console.error(error);
            alert("Failed to save evaluations.");
        }
    };

    const handleGenerateAll = async () => {
        if (!subject) return;
        try {
            const studentIds = students.map(s => s.id);
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/generate-bulk/${subject.id}`, studentIds);
            alert("Generated all PDFs successfully!");
            handleLoadSetup(subject, section);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailAll = async () => {
        if (!subject) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca2/email-all/${subject.id}`);
            alert("Emails sent successfully!");
            handleLoadSetup(subject, section);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 relative min-h-screen pb-24">
            <SetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onLoad={handleLoadSetup} />

            {subject && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">CA2 Evaluation</h1>
                            <p className="text-gray-600">{subject.name} ({subject.code}) | Section: {section}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleBulkAI} className="px-4 py-2 bg-yellow-500 text-white font-bold rounded shadow">🤖 AI Suggest All</button>
                            <button onClick={handleGenerateAll} className="px-4 py-2 bg-purple-600 text-white rounded">Generate All Topsheets</button>
                            <button onClick={handleEmailAll} className="px-4 py-2 bg-green-600 text-white rounded">Email All</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded shadow mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3 w-64">Student</th>
                                    <th className="p-3 text-center">Submission</th>
                                    <th className="p-3 text-center">Marks (25)</th>
                                    <th className="p-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">
                                            {student.name} <br/> <span className="text-xs text-gray-500">{student.university_roll}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            {student.submission_url ? (
                                                <div className="flex gap-2 justify-center items-center">
                                                    <a href={student.submission_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm font-bold">View PDF</a>
                                                    <button onClick={() => handleGetAI(student)} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-bold shadow-sm border border-yellow-300">✨ Get AI</button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No File</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                min="0" max="25"
                                                className="w-16 border rounded p-1 text-center font-bold"
                                                value={evaluations[student.id]?.marks ?? ''}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                student.status === 'Empty' ? 'bg-gray-200 text-gray-800' :
                                                student.status === 'Evaluated' ? 'bg-yellow-100 text-yellow-800' :
                                                student.status === 'pdf_generated' ? 'bg-blue-100 text-blue-800' :
                                                student.status === 'emailed' ? 'bg-green-100 text-green-800' :
                                                'bg-indigo-100 text-indigo-800'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Sticky Save Bar */}
            {hasUnsavedChanges && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center z-40">
                    <span className="text-red-500 font-semibold ml-64">You have unsaved changes!</span>
                    <button onClick={handleSaveAll} className="px-6 py-2 bg-blue-600 text-white font-bold rounded mr-8">
                        Save All Changes
                    </button>
                </div>
            )}

            {/* AI Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">AI Analysis: {selectedStudent.name}</h2>
                            <button onClick={() => setSelectedStudent(null)} className="text-gray-500 hover:text-black">✕</button>
                        </div>

                        <div className="mb-4">
                            <a href={selectedStudent.submission_url} target="_blank" rel="noreferrer" className="inline-block mb-4 px-4 py-2 border rounded hover:bg-gray-50">⬇️ Download File</a>
                            <button onClick={() => runAIForStudent(selectedStudent)} disabled={fetchingAi} className="ml-2 px-4 py-2 bg-yellow-500 text-white font-bold rounded shadow disabled:opacity-50">
                                {fetchingAi ? 'Analyzing...' : '✨ Get AI Suggestion'}
                            </button>
                        </div>

                        {aiSuggestion && (
                            <div className="border border-yellow-400 bg-yellow-50 p-4 rounded mt-4">
                                <div className="text-2xl font-bold text-center mb-2">{aiSuggestion.suggested_marks} / 25</div>
                                <p className="text-sm text-gray-700 italic mb-4">"{aiSuggestion.reasoning}"</p>
                                <button onClick={handleAcceptAI} className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded">Accept Suggestion</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Progress Modal */}
            {bulkProgress && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow-lg text-center w-80">
                        <div className="text-4xl mb-4">🤖</div>
                        <h2 className="text-xl font-bold mb-2">Analyzing Reports...</h2>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div className="bg-yellow-500 h-4 rounded-full transition-all" style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}></div>
                        </div>
                        <p className="font-bold text-gray-700">{bulkProgress.current} / {bulkProgress.total}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
