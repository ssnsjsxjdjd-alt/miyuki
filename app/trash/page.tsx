'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface DeletedFile {
    _id: string;
    originalName: string;
    size: number;
    deletedAt: string;
}

export default function TrashPage() {
    const [owner, setOwner] = useState('webmaster');
    const [files, setFiles] = useState<DeletedFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDeletedFiles();
    }, [owner]);

    const fetchDeletedFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/files/trash/list?owner=${owner}`);
            const data = await res.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching deleted files:', error);
            setMessage('❌ เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (fileId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/files/${fileId}/restore`, {
                method: 'PUT',
            });

            if (res.ok) {
                setMessage('✅ กู้คืนไฟล์สำเร็จ');
                fetchDeletedFiles();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ เกิดข้อผิดพลาดในการกู้คืนไฟล์');
            }
        } catch (error) {
            setMessage('❌ เกิดข้อผิดพลาดในการกู้คืนไฟล์');
        }
    };

    const handlePermanentDelete = async (fileId: string) => {
        if (!confirm('คุณต้องการลบไฟล์นี้ถาวรหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้!')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/files/${fileId}/permanent`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setMessage('✅ ลบไฟล์ถาวรสำเร็จ');
                fetchDeletedFiles();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ เกิดข้อผิดพลาดในการลบไฟล์');
            }
        } catch (error) {
            setMessage('❌ เกิดข้อผิดพลาดในการลบไฟล์');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('th-TH');
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-20 animate-float"></div>
                <div className="absolute w-96 h-96 bg-red-400/10 rounded-full blur-3xl bottom-20 right-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
                {/* Back Button */}
                <div className="mb-6 animate-slide-up">
                    <Link href="/" className="inline-flex items-center px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-smooth">
                        <span className="mr-2">←</span> กลับหน้าหลัก
                    </Link>
                </div>

                {/* Main Card */}
                <div className="glass-strong rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <span className="text-5xl mr-4 animate-float">🗑️</span>
                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                ถังขยะ
                            </h1>
                            <p className="text-white/80">กู้คืนหรือลบไฟล์ถาวร</p>
                        </div>
                    </div>

                    {/* Owner Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-3 text-white">
                            👤 เจ้าของ (Owner)
                        </label>
                        <input
                            type="text"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            className="max-w-md px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-smooth"
                            placeholder="webmaster"
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl font-semibold animate-slide-up ${message.includes('✅')
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                            }`}>
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block">
                                <svg className="animate-spin h-16 w-16 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-white text-xl mt-4">กำลังโหลด...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4 opacity-50">🗑️</div>
                            <p className="text-white/70 text-xl">ถังขยะว่างเปล่า</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {files.map((file, index) => (
                                <div
                                    key={file._id}
                                    className="glass rounded-xl p-4 hover:bg-white/20 transition-smooth animate-slide-up"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <span className="text-3xl mr-4">📄</span>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-white truncate">{file.originalName}</div>
                                                <div className="text-sm text-white/70">
                                                    {formatFileSize(file.size)} • ลบเมื่อ {formatDate(file.deletedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleRestore(file._id)}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-smooth hover:scale-105"
                                            >
                                                ♻️ กู้คืน
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(file._id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-smooth hover:scale-105"
                                            >
                                                ❌ ลบถาวร
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
