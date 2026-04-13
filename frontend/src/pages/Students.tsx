import { useState, useEffect } from 'react';
import api from '../lib/api';
import { GraduationCap, UserCircle, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Student, Parent } from '../types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', dob: '', gender: 'Male', current_grade: 10, parent_id: '' });

  const fetchData = async () => {
    try {
      const [stuRes, parRes] = await Promise.all([
        api.get('/students'),
        api.get('/parents')
      ]);
      setStudents(stuRes.data);
      setParents(parRes.data);
    } catch (err: unknown) { 
      if (err instanceof Error) toast.error('Lỗi dữ liệu: ' + err.message); 
    }
  }

  useEffect(() => { fetchData() }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.parent_id) {
       toast.error('Vui lòng chọn Phụ huynh giám hộ!');
       return;
    }
    try {
      setLoading(true);
      await api.post('/students', newStudent);
      toast.success('Ghi danh Học sinh thành công!');
      setNewStudent({ name: '', dob: '', gender: 'Male', current_grade: 10, parent_id: '' });
      fetchData();
    } catch (err: unknown) { 
      if (err instanceof Error) toast.error('Lỗi: ' + err.message); 
    } 
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hồ Sơ Học Sinh</h2>
        <p className="text-slate-500 mt-2">Quản lý định danh học sinh và liên kết người giám hộ.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-emerald-700 flex items-center gap-2">
          <GraduationCap className="w-5 h-5"/> Ghi danh học sinh mới
        </h3>
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Họ và tên Học sinh</label>
                <input required placeholder="Nhập tên..." value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ngày sinh</label>
                <div className="relative group cursor-pointer" onClick={(e) => { const input = e.currentTarget.querySelector('input'); if(input && 'showPicker' in input) (input as any).showPicker(); }}>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  <input required type="date" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Giám hộ (Parent)</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select required value={newStudent.parent_id} onChange={e => setNewStudent({...newStudent, parent_id: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-white outline-none">
                    <option value="">-- Chọn Phụ Huynh --</option>
                    {parents.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                  </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Giới tính</label>
                <select value={newStudent.gender} onChange={e => setNewStudent({...newStudent, gender: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Khối lớp (Grade)</label>
                <input required type="number" min="1" max="12" value={newStudent.current_grade} onChange={e => setNewStudent({...newStudent, current_grade: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white" />
             </div>
             <div className="flex items-end">
                <button disabled={loading} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-100">
                  LƯU HỌC SINH
                </button>
             </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold flex items-center gap-2"><Users className="w-5 h-5 text-emerald-500"/> Danh sách Học sinh hệ thống</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="p-4">Học Sinh</th>
              <th className="p-4">Thông tin</th>
              <th className="p-4">Người giám hộ (Parent)</th>
              <th className="p-4 text-right">Số buổi còn lại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
               <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">Chưa có dữ liệu học sinh.</td></tr>
            ) : students.map(s => {
              const sub = s.subscriptions?.[0];
              const sessionsLeft = sub ? (sub.total_sessions - sub.used_sessions) : 0;
              return (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">{s.name.substring(0, 2)}</div>
                    <b className="text-slate-900">{s.name}</b>
                  </div>
                </td>
                <td className="p-4 text-slate-500 text-xs">Khối {s.current_grade} | {s.gender} | {new Date(s.dob).toLocaleDateString('vi-VN')}</td>
                <td className="p-4 font-medium text-indigo-600">{s.parent?.name || 'N/A'}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${sessionsLeft > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {sessionsLeft} Buổi
                  </span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}
