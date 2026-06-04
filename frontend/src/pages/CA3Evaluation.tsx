import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SetupModal } from '../components/SetupModal';

export const CA3Evaluation: React.FC = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(true);
    const [subject, setSubject] = useState<any>(null);
    const [section, setSection] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);

    // marksState: { studentId: { Q1: {awarded, allotted, co, remark, ar_ref}, Q2: ... } }
    const [marksState, setMarksState] = useState<Record<string, Record<string, any>>>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Mock 9 questions for CA3 (q1a, q1b, q1c, q2a, q2b, q3, q4, q5, q6)
    const questions = ["Q1a", "Q1b", "Q1c", "Q2a", "Q2b", "Q3", "Q4", "Q5", "Q6"];

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleLoadSetup = async (selectedSubject: any, selectedSection: string) => {
        setSubject(selectedSubject);
        setSection(selectedSection);
        setIsSetupOpen(false);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/students?subject_id=${selectedSubject.id}&section_id=${selectedSection}`);
            setStudents(res.data);

            // Fetch existing marks
            const newMarksState: Record<string, any> = {};
            for (const student of res.data) {
                if (student.status !== 'Empty') {
                    const marksRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/${selectedSubject.id}/${student.id}`);
                    newMarksState[student.id] = marksRes.data;
                } else {
                    newMarksState[student.id] = initializeEmptyMarks();
                }
            }
            setMarksState(newMarksState);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error(error);
        }
    };

    const initializeEmptyMarks = () => {
        const empty: any = {};
        questions.forEach(q => {
            empty[q] = { awarded: 0, allotted: 5, co: "CO1", remark: "", ar_ref: "" };
        });
        return empty;
    };

    const handleMarkChange = (studentId: string, q: string, val: string) => {
        const parsed = parseInt(val) || 0;
        setMarksState(prev => {
            const stMarks = { ...prev[studentId] };
            stMarks[q] = { ...stMarks[q], awarded: parsed };
            // auto-calc remark
            const allotted = stMarks[q].allotted;
            const pct = (parsed / allotted) * 100;
            let remark = "Needs Improvement";
            if (pct >= 80) remark = "Excellent";
            else if (pct >= 60) remark = "Good";
            else if (pct >= 40) remark = "Average";
            stMarks[q].remark = remark;

            return { ...prev, [studentId]: stMarks };
        });
        setHasUnsavedChanges(true);
    };

    const calculateTotal = (studentId: string) => {
        const sMarks = marksState[studentId];
        if (!sMarks) return 0;
        return Object.values(sMarks).reduce((acc: number, val: any) => acc + (val.awarded || 0), 0);
    };

    const calculateGrade = (total: number) => {
        const pct = (total / 50) * 100; // assuming full marks 50
        if (pct >= 90) return "O";
        if (pct >= 80) return "E";
        if (pct >= 70) return "A";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        if (pct >= 40) return "D";
        return "F";
    };

    const handleSaveAll = async () => {
        if (!subject) return;
        try {
            for (const student of students) {
                const marksToSave = marksState[student.id];
                if (marksToSave) {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/marks`, {
                        subject_id: subject.id,
                        student_id: student.id,
                        marks_data: marksToSave
                    });
                }
            }
            alert("Marks saved successfully!");
            setHasUnsavedChanges(false);
            // Refresh
            handleLoadSetup(subject, section);
        } catch (error) {
            console.error(error);
            alert("Failed to save marks.");
        }
    };

    const handleGenerateAll = async () => {
        if (!subject) return;
        try {
            const studentIds = students.map(s => s.id);
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/generate-bulk/${subject.id}`, studentIds);
            alert("Generated all PDFs successfully!");
            handleLoadSetup(subject, section);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailAll = async () => {
        if (!subject) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ca3/email-all/${subject.id}`);
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
                            <h1 className="text-2xl font-bold">CA3 Evaluation</h1>
                            <p className="text-gray-600">{subject.name} ({subject.code}) | Section: {section}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleGenerateAll} className="px-4 py-2 bg-purple-600 text-white rounded">Generate All Topsheets</button>
                            <button onClick={handleEmailAll} className="px-4 py-2 bg-green-600 text-white rounded">Email All</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded shadow mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3 sticky left-0 bg-gray-100 z-10 w-48">Student</th>
                                    {questions.map(q => <th key={q} className="p-3 text-center">{q}</th>)}
                                    <th className="p-3 text-center">Total</th>
                                    <th className="p-3 text-center">Grade</th>
                                    <th className="p-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => {
                                    const total = calculateTotal(student.id);
                                    const grade = calculateGrade(total);

                                    return (
                                        <tr key={student.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 sticky left-0 bg-white z-10 font-medium">
                                                {student.name} <br/> <span className="text-xs text-gray-500">{student.university_roll}</span>
                                            </td>
                                            {questions.map(q => (
                                                <td key={q} className="p-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="0" max="5"
                                                        className="w-12 border rounded p-1 text-center"
                                                        value={marksState[student.id]?.[q]?.awarded ?? ''}
                                                        onChange={(e) => handleMarkChange(student.id, q, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                            <td className="p-3 text-center font-bold text-blue-600">{total}</td>
                                            <td className="p-3 text-center font-bold text-green-600">{grade}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    student.status === 'Empty' ? 'bg-gray-200 text-gray-800' :
                                                    student.status === 'Saved' ? 'bg-yellow-100 text-yellow-800' :
                                                    student.status === 'pdf_generated' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Sticky Save Bar */}
            {hasUnsavedChanges && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center z-50">
                    <span className="text-red-500 font-semibold ml-64">You have unsaved changes!</span>
                    <button onClick={handleSaveAll} className="px-6 py-2 bg-blue-600 text-white font-bold rounded mr-8">
                        Save All Changes
                    </button>
                </div>
            )}
        </div>
    );
};
