"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Package, Phone, User, UserRoundPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function SignUpPage() {
	const router = useRouter();
	const { register, isLoading } = useAuth();
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [storeType, setStoreType] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setMessage('');

		const result = await register({
			fullName,
			phone,
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
					<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%2290%22 viewBox=%220 0 90 90%22%3E%3Cg fill=%22none%22 stroke=%22rgba(255,255,255,0.13)%22 stroke-width=%221%22%3E%3Cpath d=%22M0 45h90M45 0v90%22/%3E%3Cpath d=%22M15 15l60 60M75 15L15 75%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

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
							<h1 className="text-5xl font-bold leading-tight">
								Quản lý dễ dàng<br />
								Bán hàng đơn giản
							</h1>
							<p className="text-lg leading-8 text-blue-50/90">
								Gửi thông tin đăng ký để hệ thống duyệt tài khoản. Khi được duyệt, tài khoản sẽ dùng để đăng nhập lại.
							</p>
							<div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-white/90 backdrop-blur-sm">
								Hỗ trợ đăng ký 1800 6162
							</div>
						</div>

						<div className="grid gap-3 text-sm text-blue-50/90 sm:grid-cols-2">
							{['Nhập liệu nhanh', 'Duyệt tài khoản riêng', 'Ghi nhớ sản phẩm đăng ký', 'Sẵn sàng cho sale/owner'].map((item) => (
								<div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
									{item}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center bg-[linear-gradient(180deg,#f0fdf4_0%,#dcfce7_100%)] px-5 py-10 sm:px-8 lg:px-12">
					<div className="w-full max-w-xl">
						<div className="mb-8 text-center lg:text-left">
							<p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">Tạo tài khoản dùng thử miễn phí</p>
							<h2 className="text-3xl font-bold text-slate-900">Đăng ký tài khoản mới</h2>
							<p className="mt-3 text-sm leading-6 text-slate-600">
								Điền thông tin để gửi yêu cầu duyệt tài khoản. Các trường gồm họ tên, số điện thoại, loại hình kinh doanh, user và mật khẩu.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-8">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label className="mb-2 block text-sm font-semibold text-slate-700">Họ tên</label>
									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
											<User className="h-5 w-5" />
										</div>
										<input
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											placeholder="Nhập họ tên"
											required
										/>
									</div>
								</div>

								<div className="sm:col-span-2">
									<label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
											<Phone className="h-5 w-5" />
										</div>
										<input
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											placeholder="091 234 56 78"
											required
										/>
									</div>
								</div>

								<div className="sm:col-span-2">
									<label className="mb-2 block text-sm font-semibold text-slate-700">Loại hình kinh doanh</label>
									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
											<Package className="h-5 w-5" />
										</div>
										<input
											value={storeType}
											onChange={(e) => setStoreType(e.target.value)}
											className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											placeholder="Ví dụ: Bán lẻ, dịch vụ, nhà hàng..."
											required
										/>
									</div>
								</div>

								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700">User</label>
									<input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
										placeholder="Tài khoản đăng nhập"
										required
									/>
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
											className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
							</div>

							{message && (
								<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
									{message}
								</div>
							)}

							<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
								<Link href="/signin" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
									Đã có tài khoản? Đăng nhập
								</Link>

								<button
									type="submit"
									disabled={isLoading}
									className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isLoading ? 'Đang gửi...' : 'Tiếp tục'}
									{!isLoading && <ArrowRight className="h-4 w-4" />}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
