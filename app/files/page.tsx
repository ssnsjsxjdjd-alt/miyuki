'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface File {
    _id: string;
    originalName: string;
    size: number;
    mimeType: string;
    createdAt: string;
    folderId: string | null;
}

interface Folder {
    _id: string;
    name: string;
    createdAt: string;
}

export default function FilesPage() {
    const [owner, setOwner] = useState('webmaster');
    const [files, setFiles] = useState<File[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [owner, currentFolderId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const folderParam = currentFolderId || 'root';
            const [filesRes, foldersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/files?owner=${owner}&folderId=${folderParam}`),
                fetch(`${API_BASE_URL}/folders?owner=${owner}&parentId=${folderParam}`),
            ]);

            const filesData = await filesRes.json();
            const foldersData = await foldersRes.json();

            setFiles(filesData);
            setFolders(foldersData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('❌ เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId: string, filename: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/files/${fileId}/download`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setMessage('✅ ดาวน์โหลดสำเร็จ');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ เกิดข้อผิดพลาดในการดาวน์โหลด');
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setMessage('✅ ลบไฟล์สำเร็จ');
                fetchData();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ เกิดข้อผิดพลาดในการลบไฟล์');
            }
        } catch (error) {
            setMessage('❌ เกิดข้อผิดพลาดในการลบไฟล์');
        }
    };

    const handleCreateShare = async (fileId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/share/files/${fileId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (res.ok) {
                const data = await res.json();
                navigator.clipboard.writeText(data.shareUrl);
                setMessage(`✅ คัดลอกลิงก์แชร์แล้ว: ${data.shareUrl}`);
                setTimeout(() => setMessage(''), 5000);
            } else {
                setMessage('❌ เกิดข้อผิดพลาดในการสร้างลิงก์แชร์');
            }
        } catch (error) {
            setMessage('❌ เกิดข้อผิดพลาดในการสร้างลิงก์แชร์');
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
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-20 animate-float"></div>
                <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl bottom-20 right-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <span className="text-5xl mr-4 animate-float">📂</span>
                            <div>
                                <h1 className="text-4xl font-bold text-white">
                                    จัดการไฟล์
                                </h1>
                                <p className="text-white/80">ดู แก้ไข และจัดการไฟล์ทั้งหมด</p>
                            </div>
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

                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <button
                            onClick={() => setCurrentFolderId(null)}
                            className="inline-flex items-center px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-smooth"
                        >
                            🏠 รูท
                        </button>
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
                    ) : (
                        <>
                            {/* Folders */}
                            {folders.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                                        <span className="mr-2">📁</span> โฟลเดอร์
                                    </h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {folders.map((folder, index) => (
                                            <div
                                                key={folder._id}
                                                className="glass rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-smooth hover:scale-105 animate-slide-up"
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                                onClick={() => setCurrentFolderId(folder._id)}
                                            >
                                                <div className="text-4xl mb-3">📁</div>
                                                <div className="font-bold text-white text-lg mb-1">{folder.name}</div>
                                                <div className="text-sm text-white/70">
                                                    {formatDate(folder.createdAt)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Files */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                                    <span className="mr-2">📄</span> ไฟล์
                                </h2>
                                {files.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4 opacity-50">📭</div>
                                        <p className="text-white/70 text-xl">ไม่มีไฟล์</p>
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
                                                                {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        <button
                                                            onClick={() => handleDownload(file._id, file.originalName)}
                                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-smooth hover:scale-105"
                                                        >
                                                            ⬇️ ดาวน์โหลด
                                                        </button>
                                                        <button
                                                            onClick={() => handleCreateShare(file._id)}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-smooth hover:scale-105"
                                                        >
                                                            🔗 แชร์
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(file._id)}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-smooth hover:scale-105"
                                                        >
                                                            🗑️ ลบ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
