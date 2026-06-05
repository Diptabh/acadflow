import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const FacultySettings: React.FC = () => {
    const { token } = useAuth();
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

    const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        if (!file.type.includes('png')) {
            alert('Only PNG files are allowed for signature');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Let's assume we have an endpoint for uploading signature
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/faculty/signature`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSignatureUrl(response.data.url);
            alert("Signature uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload signature. Make sure Supabase connection is set up.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Faculty Settings</h1>

            <div className="bg-white p-6 rounded shadow max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                    <div className="flex items-center gap-4">
                        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                            Upload Signature (PNG)
                            <input type="file" className="hidden" accept=".png" onChange={handleSignatureUpload} />
                        </label>
                    </div>
                    {signatureUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-green-600 mb-2">Current Signature:</p>
                            <img src={signatureUrl} alt="Signature" className="h-16 border rounded bg-gray-50" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
