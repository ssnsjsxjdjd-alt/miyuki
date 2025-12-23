'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface HealthCheck {
    endpoint: string;
    method: string;
    status: 'success' | 'error' | 'pending';
    responseTime?: number;
    message?: string;
}

export default function ActivitiesPage() {
    const [checks, setChecks] = useState<HealthCheck[]>([]);
    const [testing, setTesting] = useState(false);

    const endpoints = [
        { endpoint: '/files?owner=webmaster', method: 'GET', name: 'ดึงรายการไฟล์' },
        { endpoint: '/folders?owner=webmaster', method: 'GET', name: 'ดึงรายการโฟลเดอร์' },
        { endpoint: '/files/trash/list?owner=webmaster', method: 'GET', name: 'ดึงรายการถังขยะ' },
    ];

    const runHealthChecks = async () => {
        setTesting(true);
        const results: HealthCheck[] = [];

        for (const { endpoint, method, name } of endpoints) {
            const startTime = Date.now();
            try {
                const res = await fetch(`${API_BASE_URL}${endpoint}`, { method });
                const endTime = Date.now();

                results.push({
                    endpoint: `${name} (${endpoint})`,
                    method,
                    status: res.ok ? 'success' : 'error',
                    responseTime: endTime - startTime,
                    message: res.ok ? `${res.status} OK` : `${res.status} ${res.statusText}`,
                });
            } catch (error) {
                results.push({
                    endpoint: `${name} (${endpoint})`,
                    method,
                    status: 'error',
                    message: `เกิดข้อผิดพลาด: ${error}`,
                });
            }
        }

        setChecks(results);
        setTesting(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-20 animate-float"></div>
                <div className="absolute w-96 h-96 bg-amber-400/10 rounded-full blur-3xl bottom-20 right-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
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
                            <span className="text-5xl mr-4 animate-float">📊</span>
                            <div>
                                <h1 className="text-4xl font-bold text-white">
                                    กิจกรรมและสถานะระบบ
                                </h1>
                                <p className="text-white/80">ตรวจสอบสถานะและประสิทธิภาพของ API</p>
                            </div>
                        </div>
                    </div>

                    {/* Test Button */}
                    <div className="mb-8">
                        <button
                            onClick={runHealthChecks}
                            disabled={testing}
                            className="w-full md:w-auto bg-white text-orange-600 font-bold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover:scale-105 hover:shadow-2xl"
                        >
                            {testing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังตรวจสอบ...
                                </span>
                            ) : (
                                '🔍 ตรวจสอบสถานะ API'
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {checks.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="mr-2">📋</span> ผลการตรวจสอบ
                            </h2>

                            <div className="space-y-3">
                                {checks.map((check, index) => (
                                    <div
                                        key={index}
                                        className={`glass rounded-xl p-4 animate-slide-up ${check.status === 'success'
                                            ? 'border-l-4 border-green-400'
                                            : 'border-l-4 border-red-400'
                                            }`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="font-semibold text-white mb-1">
                                                    {check.status === 'success' ? '✅' : '❌'} {check.endpoint}
                                                </div>
                                                <div className="text-sm text-white/70">
                                                    {check.method} • {check.message}
                                                </div>
                                            </div>
                                            {check.responseTime && (
                                                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg font-mono text-white font-semibold">
                                                    ⚡ {check.responseTime}ms
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="glass rounded-xl p-6">
                                <h3 className="font-bold text-white text-xl mb-4 flex items-center">
                                    <span className="mr-2">📈</span> สรุปผลการทดสอบ
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-green-300 mb-1">
                                            {checks.filter(c => c.status === 'success').length}
                                        </div>
                                        <div className="text-white/80 text-sm">✅ สำเร็จ</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-red-300 mb-1">
                                            {checks.filter(c => c.status === 'error').length}
                                        </div>
                                        <div className="text-white/80 text-sm">❌ ล้มเหลว</div>
                                    </div>
                                    {checks.some(c => c.responseTime) && (
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <div className="text-3xl font-bold text-yellow-300 mb-1">
                                                {Math.round(checks.reduce((sum, c) => sum + (c.responseTime || 0), 0) / checks.length)}ms
                                            </div>
                                            <div className="text-white/80 text-sm">⚡ เวลาเฉลี่ย</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Info */}
                    <div className="mt-8 glass rounded-xl p-6">
                        <h3 className="font-bold text-white text-xl mb-4 flex items-center">
                            <span className="mr-2">💻</span> ข้อมูลระบบ
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center text-white">
                                <span className="mr-3">🔗</span>
                                <span className="mr-2">Backend API:</span>
                                <code className="bg-white/20 px-3 py-1 rounded font-mono text-sm">{API_BASE_URL}</code>
                            </div>
                            <div className="flex items-center text-white">
                                <span className="mr-3">📚</span>
                                <span className="mr-2">Swagger Docs:</span>
                                <a
                                    href={`${API_BASE_URL}/api`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-smooth font-mono text-sm"
                                >
                                    {API_BASE_URL}/api
                                </a>
                            </div>
                            <div className="flex items-center text-white">
                                <span className="mr-3">🌐</span>
                                <span className="mr-2">Frontend:</span>
                                <code className="bg-white/20 px-3 py-1 rounded font-mono text-sm">http://localhost:3000</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
