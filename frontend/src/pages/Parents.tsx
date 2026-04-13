import { useState, useEffect } from 'react';
import api from '../lib/api';
import { UserCircle, UserPlus, Phone, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Parent } from '../types';

export default function Parents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', phone: '', email: '' });

  const fetchData = async () => {
    try {
      const res = await api.get('/parents');
      setParents(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error('Lỗi khi tải danh sách: ' + err.message);
    }
  }

  useEffect(() => { fetchData() }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/parents', newParent);
      toast.success('Thêm Phụ Huynh thành công!');
      setNewParent({ name: '', phone: '', email: '' });
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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cơ sở dữ liệu Phụ Huynh</h2>
        <p className="text-slate-500 mt-2">Quản lý thông liên lạc của người giám hộ.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-indigo-700 flex items-center gap-2">
          <UserPlus className="w-5 h-5"/> Thêm người giám hộ mới
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input required placeholder="Họ tên" value={newParent.name} onChange={e => setNewParent({...newParent, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input required placeholder="Số điện thoại" value={newParent.phone} onChange={e => setNewParent({...newParent, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input required type="email" placeholder="Email" value={newParent.email} onChange={e => setNewParent({...newParent, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <button disabled={loading} className="px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-200">
            LƯU THÔNG TIN
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold flex items-center gap-2"><UserCircle className="w-5 h-5 text-indigo-500"/> Danh mục Người giám hộ</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="p-4">Họ và Tên</th>
              <th className="p-4">Số điện thoại</th>
              <th className="p-4">Địa chỉ Email</th>
              <th className="p-4 text-right">ID hệ thống</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parents.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 italic">Chưa có dữ liệu phụ huynh.</td>
              </tr>
            ) : parents.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-700">{p.name}</td>
                <td className="p-4 ">{p.phone}</td>
                <td className="p-4 text-slate-500">{p.email}</td>
                <td className="p-4 text-right font-mono text-[10px] text-slate-400">{p.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
