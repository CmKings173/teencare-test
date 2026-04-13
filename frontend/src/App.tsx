import { Routes, Route, NavLink } from 'react-router-dom';
import { Layers, Frame, BookOpen, FolderOpen, Database, GraduationCap, UserCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from './lib/api';

import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Parents from './pages/Parents';
import Students from './pages/Students';
import Subscriptions from './pages/Subscriptions';



export default function App() {
  const runSeedData = async () => {
    if (!window.confirm('Cảnh báo: Bơm Data sẽ nạp sẵn dữ liệu giả lập. Đảm bảo API Backend đang chạy. Tiếp tục?')) return;
    try {
      const p1 = await api.post(`/parents`, { name: 'Thái Công', phone: '0901234567', email: 'tc@email.com' });
      const p2 = await api.post(`/parents`, { name: 'Tony Stark', phone: '0987654321', email: 'tony@stark.com' });

      const s1 = await api.post(`/students`, { name: 'Thái Công Con', dob: '2010-05-10', gender: 'Male', current_grade: 9, parent_id: p1.data.id });
      const s2 = await api.post(`/students`, { name: 'Peter Parker', dob: '2008-08-10', gender: 'Male', current_grade: 11, parent_id: p2.data.id });
      const s3 = await api.post(`/students`, { name: 'Morgan Stark', dob: '2015-09-11', gender: 'Female', current_grade: 4, parent_id: p2.data.id });

      await api.post(`/classes`, { name: 'IELTS Mastery', subject: 'English', day_of_week: 'Chủ Nhật', time_slot: '18:00-19:30', teacher_name: 'Thầy Cường', max_students: 2 });
      await api.post(`/classes`, { name: 'Toán Tư Duy', subject: 'Math', day_of_week: 'Thứ Ba', time_slot: '19:00-21:00', teacher_name: 'Cô Lan', max_students: 10 });
      await api.post(`/classes`, { name: 'Lập trình Python', subject: 'IT', day_of_week: 'Thứ Bảy', time_slot: '09:00-11:00', teacher_name: 'Thầy Vũ', max_students: 20 });

      await api.post(`/subscriptions`, { student_id: s1.data.id, package_name: 'VIP', start_date: '2026-01-01', end_date: '2026-12-31', total_sessions: 30 });
      await api.post(`/subscriptions`, { student_id: s2.data.id, package_name: 'Standard', start_date: '2026-01-01', end_date: '2026-06-31', total_sessions: 15 });
      await api.post(`/subscriptions`, { student_id: s3.data.id, package_name: 'Trial', start_date: '2026-01-01', end_date: '2026-02-28', total_sessions: 5 });

      toast.success('Đã bơm Data thành công!');
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error('Lỗi bơm Data. Đảm bảo Backend đang chạy!');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-lg shadow-slate-200/20 relative z-10 flex flex-col">
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Layers className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">Teencare<span className="text-indigo-600">.io</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Frame className="w-5 h-5" /> Tổng Quan
          </NavLink>
          <NavLink to="/classes" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <BookOpen className="w-5 h-5" /> Quản lý Lớp & Lịch
          </NavLink>
          <NavLink to="/parents" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <UserCircle className="w-5 h-5" /> Quản lý Phụ Huynh
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <GraduationCap className="w-5 h-5" /> Quản lý Học Sinh
          </NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <FolderOpen className="w-5 h-5" /> Quản lý Gói học
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={runSeedData} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95">
            <Database className="w-4 h-4" /> Bơm Test Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-7xl mx-auto p-8 lg:p-10 pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </main>
    </div>
  );
}
