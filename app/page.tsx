import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 -left-20 animate-float"></div>
        <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl bottom-20 -right-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-purple-400/10 rounded-full blur-3xl top-1/2 left-1/2 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-block mb-4">
              <span className="text-7xl animate-float inline-block">📁</span>
            </div>
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
              File Storage System
            </h1>
            <p className="text-2xl text-white/90 font-light">
              ระบบจัดการไฟล์และโฟลเดอร์แบบครบวงจร
            </p>
          </div>

          {/* Main Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Upload Card */}
            <Link href="/upload" className="group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="glass-strong rounded-2xl p-8 transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-smooth">📤</div>
                <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-200 transition-smooth">
                  อัปโหลดไฟล์
                </h2>
                <p className="text-white/80 text-lg">
                  อัปโหลดไฟล์เดี่ยว หลายไฟล์ หรือทั้งโฟลเดอร์
                </p>
                <div className="mt-4 inline-flex items-center text-blue-200 font-semibold group-hover:translate-x-2 transition-smooth">
                  เริ่มต้นใช้งาน →
                </div>
              </div>
            </Link>

            {/* Files Management Card */}
            <Link href="/files" className="group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-strong rounded-2xl p-8 transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-smooth">📂</div>
                <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-200 transition-smooth">
                  จัดการไฟล์
                </h2>
                <p className="text-white/80 text-lg">
                  ดู แก้ไข ลบ และจัดการไฟล์ทั้งหมด
                </p>
                <div className="mt-4 inline-flex items-center text-purple-200 font-semibold group-hover:translate-x-2 transition-smooth">
                  เปิดดูไฟล์ →
                </div>
              </div>
            </Link>

            {/* Trash Card */}
            <Link href="/trash" className="group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-strong rounded-2xl p-8 transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-smooth">🗑️</div>
                <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-pink-200 transition-smooth">
                  ถังขยะ
                </h2>
                <p className="text-white/80 text-lg">
                  กู้คืนหรือลบไฟล์ถาวร
                </p>
                <div className="mt-4 inline-flex items-center text-pink-200 font-semibold group-hover:translate-x-2 transition-smooth">
                  ดูถังขยะ →
                </div>
              </div>
            </Link>

            {/* Activities Card */}
            <Link href="/activities" className="group animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="glass-strong rounded-2xl p-8 transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-smooth">📊</div>
                <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-green-200 transition-smooth">
                  กิจกรรม
                </h2>
                <p className="text-white/80 text-lg">
                  ตรวจสอบสถานะระบบและ API
                </p>
                <div className="mt-4 inline-flex items-center text-green-200 font-semibold group-hover:translate-x-2 transition-smooth">
                  ดูกิจกรรม →
                </div>
              </div>
            </Link>
          </div>

          {/* Useful Links Card */}
          <div className="glass-strong rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
              <span className="mr-3">🔗</span>
              ลิงก์ที่เป็นประโยชน์
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 glass rounded-xl hover:bg-white/20 transition-smooth group"
              >
                <span className="text-3xl mr-4 group-hover:scale-110 transition-smooth">📚</span>
                <div>
                  <div className="text-white font-semibold text-lg">Swagger API Documentation</div>
                  <div className="text-white/70 text-sm">เอกสาร API แบบละเอียด</div>
                </div>
              </a>
              <a
                href="/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 glass rounded-xl hover:bg-white/20 transition-smooth group"
              >
                <span className="text-3xl mr-4 group-hover:scale-110 transition-smooth">🔧</span>
                <div>
                  <div className="text-white font-semibold text-lg">Backend API (Port 3001)</div>
                  <div className="text-white/70 text-sm">เซิร์ฟเวอร์ Backend</div>
                </div>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-white/60 text-sm">
              Built with ❤️ using Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
