"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Package, Phone, User, UserRoundPlus, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/services/adminService';

export function SignUpPage() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    
    // States cho form
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [storeType, setStoreType] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    
    // State lưu danh sách loại hàng từ API công khai
    const [availableTypes, setAvailableTypes] = useState<any[]>([]);

    // Fetch danh sách loại hàng ngay khi vào trang
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await adminService.getPublicStoreTypes();
                // Dựa trên response từ backend của bạn
                const data = res.data || res;
                setAvailableTypes(Array.isArray(data) ? data : (data.store_types || []));
            } catch (error) {
                console.error("Lỗi tải loại cửa hàng:", error);
            }
        };
        fetchTypes();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');

        const result = await register({
            fullName,
            phone,
            address,
            store_type: storeType, 
            username,
            password,
        });

        if (!result.success) {
            setMessage(result.message);
        } else {
            setMessage('Đã gửi đăng ký. Khi được duyệt, bạn có thể đăng nhập bằng tài khoản này.');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.28),_transparent_30%),linear-gradient(135deg,_#0b4227_0%,_#16a34a_42%,_#dcfce7_100%)] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.02fr_0.98fr]">
                <div className="relative hidden overflow-hidden lg:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(180deg,#0f5f34_0%,#16a34a_46%,#052e16_100%)]" />
                    <div className="relative flex h-full flex-col justify-between p-10 text-white">
                        <div className="flex items-center gap-3 text-emerald-200">
                            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                                <UserRoundPlus className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em]">Khang Sales</p>
                                <p className="text-sm text-white/80">Đăng ký tài khoản mới</p>
                            </div>
                        </div>

                        <div className="max-w-md space-y-5">
                            <h1 className="text-5xl font-bold leading-tight">Quản lý dễ dàng<br />Bán hàng đơn giản</h1>
                            <p className="text-lg leading-8 text-blue-50/90">Gửi thông tin đăng ký để hệ thống duyệt tài khoản.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-[linear-gradient(180deg,#f0fdf4_0%,#dcfce7_100%)] px-5 py-10 sm:px-8 lg:px-12">
                    <div className="w-full max-w-xl">
                        <div className="mb-8 text-center lg:text-left">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">Tạo tài khoản dùng thử miễn phí</p>
                            <h2 className="text-3xl font-bold text-slate-900">Đăng ký tài khoản mới</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Họ tên</label>
                                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-4 outline-none transition focus:border-sky-500" placeholder="Nhập họ tên" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-4 outline-none transition focus:border-sky-500" placeholder="091 234 56 78" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ</label>
                                    <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-4 outline-none transition focus:border-sky-500" placeholder="Nhập địa chỉ" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Loại hình kinh doanh</label>
                                    <select value={storeType} onChange={(e) => setStoreType(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-4 outline-none transition focus:border-sky-500 appearance-none" required>
                                        <option value="">-- Chọn loại hình kinh doanh --</option>
                                        {availableTypes.map((type: any) => (
                                            <option key={type.id || type.ID} value={type.name || type.Name}>
                                                {type.name || type.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">User</label>
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-500" placeholder="Tài khoản đăng nhập" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-12 outline-none transition focus:border-sky-500" placeholder="Nhập mật khẩu" required />
                                </div>
                            </div>

                            {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
                            
                            <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-sky-600 py-3.5 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50">
                                {isLoading ? 'Đang gửi...' : 'Đăng ký'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}