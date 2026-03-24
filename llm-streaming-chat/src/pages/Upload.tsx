import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosBase from '@/api/axiosBase';

interface UploadResponse {
    filename: string;
    content_type: string;
    size: number;
}

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResponse(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axiosBase.post<UploadResponse>('/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(res.data);
        } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">Select a file</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {response && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
                            <p className="text-green-800 font-medium">Upload successful!</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Filename:</span> {response.filename}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Type:</span> {response.content_type}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Size:</span> {response.size} bytes
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Upload;
