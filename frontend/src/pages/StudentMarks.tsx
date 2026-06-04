import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const StudentMarks: React.FC = () => {
    const [marks, setMarks] = useState<any[]>([]);

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/student/marks`);
                setMarks(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMarks();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">My Marks</h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Subject</th>
                            <th className="p-4 text-center">CA1</th>
                            <th className="p-4 text-center">CA2</th>
                            <th className="p-4 text-center">CA3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marks.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center text-gray-500">No marks available</td></tr>
                        ) : marks.map((item, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="p-4 font-medium">{item.subject}</td>

                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.ca1?.status === 'pending' ? 'bg-gray-200' : 'bg-green-100 text-green-800'}`}>
                                            {item.ca1?.status || 'pending'}
                                        </span>
                                        {item.ca1?.pdf_url && (
                                            <a href={item.ca1.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">Download PDF</a>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.ca2?.status === 'pending' ? 'bg-gray-200' : 'bg-green-100 text-green-800'}`}>
                                            {item.ca2?.status || 'pending'}
                                        </span>
                                        {item.ca2?.pdf_url && (
                                            <a href={item.ca2.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">Download PDF</a>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.ca3?.status === 'pending' ? 'bg-gray-200' : 'bg-green-100 text-green-800'}`}>
                                            {item.ca3?.status || 'pending'}
                                        </span>
                                        {item.ca3?.pdf_url && (
                                            <a href={item.ca3.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">Download PDF</a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
