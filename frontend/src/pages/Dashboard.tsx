import { useState, useEffect } from 'react';
import api from '../lib/api';
import axios from 'axios';
import { BookOpen, Users, Clock, UserPlus, Trash2, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Class, Student, Registration } from '../types';

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clsRes = await api.get('/classes');
      const stuRes = await api.get('/students');
      setClasses(clsRes.data);
      setStudents(stuRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData() }, []);

  const registerClass = async (classId: string, studentId: string) => {
    if (!studentId) return toast.error('Vui lòng chọn học sinh!');
    try {
      setLoading(true);
      await api.post(`/classes/${classId}/register`, { student_id: studentId });
      toast.success('Đăng ký thành công!');
      fetchData();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
      else if (err instanceof Error) toast.error('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const cancelReg = async (regId: string) => {
    if (!window.confirm('Chắc chắn hủy đăng ký khối lớp này không?')) return;
    try {
      setLoading(true);
      const res = await api.delete(`/registrations/${regId}`);
      if (res.data.refunded) toast.success('Hủy thành công! Đã hoàn trả 1 buổi học vào gói.');
      else toast.success('Hủy thành công!\n(Không hoàn buổi học do sát giờ < 24h)');
      fetchData();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
      else if (err instanceof Error) toast.error('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tổng Quan (Dashboard)</h2>
        <p className="text-slate-500 mt-2">Theo dõi tình trạng ghi danh và sắp xếp lịch học thời gian thực.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Bảng Lịch học 7 Ngày */}
        <div className="xl:col-span-3 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800"><BookOpen className="w-5 h-5 text-indigo-500" /> Bảng Lịch Khả Dụng (7 Ngày)</h3>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map(day => (
                <div key={day} className="w-72 flex-shrink-0 flex flex-col border border-slate-200/60 rounded-2xl overflow-hidden bg-slate-50/50">
                  <div className="bg-indigo-600 text-white text-center py-3 font-bold uppercase tracking-wider text-sm shadow-sm">{day}</div>
                  <div className="p-3 space-y-3 flex-1">
                    {classes.filter(c => c.day_of_week === day).length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-10">Trống lịch</div>
                    ) : classes.filter(c => c.day_of_week === day).map((cls: Class) => {
                      const filled = cls.registrations?.length || 0;
                      const progress = (filled / cls.max_students) * 100;
                      const isFull = filled >= cls.max_students;
                      return (
                        <div key={cls.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
                          <h3 className="font-bold text-md text-slate-900 leading-tight mb-1">{cls.name}</h3>
                          <p className="text-xs font-semibold text-emerald-600 mb-3">{cls.subject}</p>
                          <div className="space-y-1.5 mb-4">
                            <p className="text-[12px] text-slate-600 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-orange-500" /> {cls.time_slot}</p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                              <span>SĨ SỐ</span><span className={isFull ? 'text-rose-600' : 'text-indigo-600'}>{filled}/{cls.max_students}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3"><div className={`h-full rounded-full transition-all ${isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
                            <div className="flex flex-col gap-2">
                              <select id={`student-dash-cls-${cls.id}`} disabled={isFull} className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg px-2 py-2 outline-none">
                                <option value="">Chọn học sinh...</option>
                                {students.map((s: Student) => {
                                  const sub = s.subscriptions?.[0];
                                  const hasSub = sub && (sub.total_sessions - sub.used_sessions > 0);
                                  return <option key={s.id} value={s.id} disabled={!hasSub}>{s.name} {hasSub ? `(${sub.total_sessions - (sub.used_sessions || 0)})` : '(Hết gói)'}</option>
                                })}
                              </select>
                              <button disabled={loading || isFull} onClick={() => registerClass(cls.id, (document.getElementById(`student-dash-cls-${cls.id}`) as HTMLSelectElement).value)} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1"><UserPlus className="w-3.5 h-3.5" /> GHI DANH</button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Học sinh theo dõi */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Users className="w-5 h-5 text-emerald-500" /> Tình trạng Học sinh</h3>
          <div className="bg-white/80 p-4 rounded-3xl shadow-sm border border-slate-100 max-h-[800px] overflow-y-auto pr-2 space-y-3">
              {students.map((stu: Student) => {
                const sub = stu.subscriptions?.[0];
                const sessionsLeft = sub ? (sub.total_sessions - sub.used_sessions) : 0;
                return (
                  <div key={stu.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">{stu.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-900">{stu.name}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" /> Khối {stu.current_grade}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${sessionsLeft > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{sessionsLeft} LƯỢT</span>
                    </div>
                    {stu.registrations && stu.registrations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        {stu.registrations.map((reg: Registration) => (
                          <div key={reg.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="truncate"><p className="text-sm font-bold text-slate-800 truncate">{reg.class?.name}</p><p className="text-[10px] text-slate-500 uppercase">{reg.class?.day_of_week} - {reg.class?.time_slot}</p></div>
                            <button onClick={() => cancelReg(reg.id)} className="text-rose-400 hover:text-white hover:bg-rose-500 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              {students.length === 0 && !loading && <div className="text-center py-10 text-slate-400 font-medium">Chưa có Học Sinh. Hãy vào tab Quản lý đổ Data!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
