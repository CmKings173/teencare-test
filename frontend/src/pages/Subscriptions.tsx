import { useState, useEffect } from 'react';
import api from '../lib/api';
import { FolderOpen, PackageCheck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Student, Subscription } from '../types';

export default function Subscriptions() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSub, setNewSub] = useState({ 
    student_id: '', 
    package_name: 'Gói Cơ Bản (10 Buổi)', 
    total_sessions: 10,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data); // Vì Subscriptions trả về lồng trong student luôn nên xài API này xem cho nhanh
    } catch (e) { console.error(e); }
  }

  useEffect(() => { fetchData() }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.student_id) return toast.error('Vui lòng chọn học sinh!');
    try {
      setLoading(true);
      await api.post('/subscriptions', {
        ...newSub,
        start_date: new Date(newSub.start_date).toISOString(),
        end_date: new Date(newSub.end_date).toISOString()
      });
      toast.success('Tạo Gói Học thành công!');
      setNewSub({ 
        student_id: '', 
        package_name: 'Gói Cơ Bản (10 Buổi)', 
        total_sessions: 10,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
      fetchData();
    } catch (err: unknown) { 
      if (err instanceof Error) toast.error('Lỗi: ' + err.message); 
    } 
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Gói học (Subscriptions)</h2>
        <p className="text-slate-500 mt-2">Kích hoạt Gói điểm danh mới và kiểm soát số lượt</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-purple-700 flex items-center gap-2"><PackageCheck className="w-5 h-5"/> Khởi tạo Gói Học</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Học sinh</label>
              <select required value={newSub.student_id} onChange={e => setNewSub({...newSub, student_id: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 cursor-pointer text-sm">
                <option value="">-- Chọn Học Sinh --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (Khối {s.current_grade})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tên gói học</label>
              <input required placeholder="Tên gói (VD: Gói IELTS VIP)" value={newSub.package_name} onChange={e => setNewSub({...newSub, package_name: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1 flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Số lượt cung cấp</label>
              <input required type="number" min="1" placeholder="Số buổi" value={newSub.total_sessions} onChange={e => setNewSub({...newSub, total_sessions: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="flex items-end">
              <button disabled={loading} className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 shadow-md shadow-purple-100 transition-all text-sm">
                KÍCH HOẠT GÓI
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ngày bắt đầu hiệu lực</label>
              <div className="relative group cursor-pointer" onClick={(e) => { const input = e.currentTarget.querySelector('input'); if(input && 'showPicker' in input) (input as any).showPicker(); }}>
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                 <input required type="date" value={newSub.start_date} onChange={e => setNewSub({...newSub, start_date: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm bg-slate-50/50 cursor-pointer outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ngày hết hạn dự kiến</label>
              <div className="relative group cursor-pointer" onClick={(e) => { const input = e.currentTarget.querySelector('input'); if(input && 'showPicker' in input) (input as any).showPicker(); }}>
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                 <input required type="date" value={newSub.end_date} onChange={e => setNewSub({...newSub, end_date: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm bg-slate-50/50 cursor-pointer outline-none" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50"><h3 className="font-bold flex items-center gap-2"><FolderOpen className="w-5 h-5"/> Thống kê lượt sử dụng</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr><th className="p-4">Học Sinh</th><th className="p-4">Tên Gói & Thời Hạn HĐ</th><th className="p-4 text-center">Đã Dùng / Tổng</th><th className="p-4 text-right">Lượt CÒN LẠI</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => {
              if(!s.subscriptions || s.subscriptions.length === 0) return null;
              return s.subscriptions.map((sub: Subscription) => {
                const sessionsLeft = sub.total_sessions - sub.used_sessions;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="p-4"><b className="text-slate-900">{s.name}</b></td>
                    <td className="p-4 text-xs"><span className="px-2 py-1 bg-purple-50 text-purple-700 rounded mr-2 font-bold">{sub.package_name}</span> {new Date(sub.start_date).toLocaleDateString('vi-VN')} {'->'} {new Date(sub.end_date).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 text-center font-bold text-slate-500">{sub.used_sessions} / {sub.total_sessions}</td>
                    <td className="p-4 text-right"><span className={`px-3 py-1 rounded text-sm font-extrabold ${sessionsLeft > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{sessionsLeft} Buổi</span></td>
                  </tr>
                )
             })
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
