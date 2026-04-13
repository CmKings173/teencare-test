import { useState, useEffect } from 'react';
import api from '../lib/api';
import { BookOpen, Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Class } from '../types';

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCls, setNewCls] = useState({ 
    name: '', 
    subject: 'English', 
    day_of_week: 'Thứ Hai', 
    startTime: '08:00', 
    endTime: '09:30', 
    teacher_name: '', 
    max_students: 10 
  });

  const fetchData = async () => {
    try {
      const clsRes = await api.get('/classes');
      setClasses(clsRes.data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => { fetchData() }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { 
        ...newCls, 
        time_slot: `${newCls.startTime}-${newCls.endTime}` 
      };
      await api.post('/classes', payload);
      toast.success('Tạo lớp thành công!');
      setNewCls({ 
        name: '', 
        subject: 'English', 
        day_of_week: 'Thứ Hai', 
        startTime: '08:00', 
        endTime: '09:30', 
        teacher_name: '', 
        max_students: 10 
      });
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Lớp & Lịch học</h2>
        <p className="text-slate-500 mt-2">Thêm mới và xem danh sách các lớp học hiện có.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-indigo-700 flex items-center gap-2"><Plus className="w-5 h-5"/> Mở lớp mới</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Tên lớp (VD: IELTS Mastery)" value={newCls.name} onChange={e => setNewCls({...newCls, name: e.target.value})} className="px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <input required placeholder="Môn học (VD: English)" value={newCls.subject} onChange={e => setNewCls({...newCls, subject: e.target.value})} className="px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <select value={newCls.day_of_week} onChange={e => setNewCls({...newCls, day_of_week: e.target.value})} className="px-4 py-2.5 border rounded-xl text-sm bg-slate-50 cursor-pointer">
              {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Giờ bắt đầu</label>
              <div className="relative group cursor-pointer" onClick={(e) => { const input = e.currentTarget.querySelector('input'); if(input && 'showPicker' in input) (input as any).showPicker(); }}>
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 <input required type="time" value={newCls.startTime} onChange={e => setNewCls({...newCls, startTime: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm cursor-pointer outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Giờ kết thúc</label>
              <div className="relative group cursor-pointer" onClick={(e) => { const input = e.currentTarget.querySelector('input'); if(input && 'showPicker' in input) (input as any).showPicker(); }}>
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 <input required type="time" value={newCls.endTime} onChange={e => setNewCls({...newCls, endTime: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm cursor-pointer outline-none" />
              </div>
            </div>
            <input required placeholder="Tên giáo viên" value={newCls.teacher_name} onChange={e => setNewCls({...newCls, teacher_name: e.target.value})} className="px-4 py-2.5 border rounded-xl text-sm bg-white" />
            <div className="flex gap-2">
              <input required type="number" min="1" placeholder="Số lượng tối đa" value={newCls.max_students} onChange={e => setNewCls({...newCls, max_students: parseInt(e.target.value)})} className="flex-1 px-4 py-2.5 border rounded-xl text-sm bg-white" />
              <button disabled={loading} className="px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-100 transition-all text-sm uppercase">Tạo lớp</button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50"><h3 className="font-bold flex items-center gap-2"><BookOpen className="w-5 h-5"/> Toàn bộ lớp học</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr><th className="p-4">Tên Lớp & Môn</th><th className="p-4">Lịch học</th><th className="p-4">Giáo viên</th><th className="p-4">Sĩ số</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4"><b>{c.name}</b><br/><span className="text-xs text-slate-500">{c.subject}</span></td>
                <td className="p-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded mr-2">{c.day_of_week}</span> {c.time_slot}</td>
                <td className="p-4">{c.teacher_name}</td>
                <td className="p-4 font-bold {c.registrations?.length >= c.max_students ? 'text-rose-500' : 'text-emerald-500'}">{c.registrations?.length || 0} / {c.max_students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
