"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login({ username, password, phone });
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.38),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.28),_transparent_32%),linear-gradient(135deg,_#0b4227_0%,_#17a85c_44%,_#eef8ef_100%)] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 opacity-45">
        <div className="absolute left-8 top-10 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-6 top-1/2 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full bg-lime-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/40 bg-white/86 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[680px] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.28),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(74,222,128,0.32),transparent_24%),linear-gradient(180deg,#0f5132_0%,#147a47_48%,#065f46_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%2290%22 viewBox=%220 0 90 90%22%3E%3Cpath fill=%22none%22 stroke=%22rgba(255,255,255,0.16)%22 stroke-width=%221%22 d=%22M45 0v90M0 45h90M15 15l60 60M75 15L15 75%22/%3E%3C/svg%3E')] opacity-15" />

          <div className="relative h-full p-10 text-white">
            <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em]">
              <ShieldCheck className="h-4 w-4" />
              Khang Sales
            </div>
            <div className="max-w-xl space-y-6 pt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-100/90">
                Quản lý dễ dàng
              </p>
              <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
                Bán hàng đơn giản
              </h1>
              <p className="text-lg leading-8 text-emerald-50/90">
                Hệ thống hỗ trợ đăng nhập, quản lý và theo dõi sản phẩm theo vai trò. Giao diện sáng, rõ, dễ thao tác cho từng bộ phận.
              </p>
            </div>

            <div className="absolute bottom-10 left-10 right-10 grid gap-4 md:grid-cols-3">
              {[
                'Đơn giản & nhanh',
                'Bảo mật tài khoản',
                'Dùng cho nhiều vai trò',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Đăng nhập</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Hệ thống quản lý bán hàng. Form đăng nhập được căn giữa theo đúng bố cục mới.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.6rem] border border-white/60 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên đăng nhập</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhập tên đăng nhập"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(16,185,129,0.28)] transition hover:bg-emerald-700 hover:shadow-[0_18px_35px_rgba(16,185,129,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="text-center text-sm text-slate-600">
                Chưa có tài khoản?{' '}
                <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Đăng ký ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
