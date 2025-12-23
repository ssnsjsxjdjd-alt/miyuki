'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export default function UploadPage() {
    const [owner, setOwner] = useState('webmaster');
    const [folderId, setFolderId] = useState('');
    const [folders, setFolders] = useState<any[]>([]);
    const [uploadMode, setUploadMode] = useState<'single' | 'multiple' | 'folder'>('single');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetchFolders();
    }, [owner]);

    const fetchFolders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/folders?owner=${owner}`);
            const data = await res.json();
            setFolders(data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);
        formData.append('owner', owner);
        if (folderId) formData.append('folderId', folderId);

        try {
            const endpoint = uploadMode === 'multiple' ? '/files/upload/multiple' : '/files/upload';
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(`✅ อัปโหลดสำเร็จ: ${Array.isArray(data) ? data.length : 1} ไฟล์`);
                formRef.current?.reset();
            } else {
                const error = await res.json();
                setMessage(`❌ เกิดข้อผิดพลาด: ${error.message}`);
            }
        } catch (error) {
            setMessage(`❌ เกิดข้อผิดพลาด: ${error}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-20 animate-float"></div>
                <div className="absolute w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl bottom-20 right-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6 animate-slide-up">
                    <Link href="/" className="inline-flex items-center px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-smooth">
                        <span className="mr-2">←</span> กลับหน้าหลัก
                    </Link>
                </div>

                {/* Main Card */}
                <div className="glass-strong rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 animate-float inline-block">📤</div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            อัปโหลดไฟล์
                        </h1>
                        <p className="text-white/80">เลือกไฟล์ที่ต้องการอัปโหลดเข้าสู่ระบบ</p>
                    </div>

                    {/* Upload Mode Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-3 text-white">
                            โหมดการอัปโหลด
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setUploadMode('single')}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-smooth ${uploadMode === 'single'
                                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                                    : 'glass text-white hover:bg-white/20'
                                    }`}
                            >
                                📄 ไฟล์เดี่ยว
                            </button>
                            <button
                                onClick={() => setUploadMode('multiple')}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-smooth ${uploadMode === 'multiple'
                                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                                    : 'glass text-white hover:bg-white/20'
                                    }`}
                            >
                                📚 หลายไฟล์
                            </button>
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
                            className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-smooth"
                            placeholder="webmaster"
                        />
                    </div>

                    {/* Folder Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-3 text-white">
                            📁 โฟลเดอร์ปลายทาง (ไม่บังคับ)
                        </label>
                        <select
                            value={folderId}
                            onChange={(e) => setFolderId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-smooth"
                        >
                            <option value="" className="bg-purple-600">🏠 ระดับรูท (Root)</option>
                            {folders.map((folder) => (
                                <option key={folder._id} value={folder._id} className="bg-purple-600">
                                    📂 {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upload Form */}
                    <form ref={formRef} onSubmit={handleUpload}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-3 text-white">
                                📎 เลือกไฟล์
                            </label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-smooth ${dragActive
                                    ? 'border-white bg-white/20 scale-105'
                                    : 'border-white/50 hover:border-white hover:bg-white/10'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    name={uploadMode === 'multiple' ? 'files' : 'file'}
                                    multiple={uploadMode === 'multiple'}
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-5xl mb-3">📁</div>
                                <p className="text-white font-semibold mb-1">
                                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                                </p>
                                <p className="text-white/70 text-sm">
                                    {uploadMode === 'multiple' ? 'รองรับหลายไฟล์พร้อมกัน' : 'รองรับไฟล์เดี่ยว'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover:scale-105 hover:shadow-2xl"
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังอัปโหลด...
                                </span>
                            ) : (
                                '📤 อัปโหลดไฟล์'
                            )}
                        </button>
                    </form>

                    {/* Message */}
                    {message && (
                        <div className={`mt-6 p-4 rounded-xl font-semibold animate-slide-up ${message.includes('✅')
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
