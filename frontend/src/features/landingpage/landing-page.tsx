import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit, CircleDollarSign, Cpu, Gem, Globe2, LayoutGrid, PackageSearch, SearchCheck, ShieldCheck, TrendingUp } from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';

const benefits = [
	{
		title: 'Đơn giản & dễ sử dụng',
		description: 'Giao diện gọn, rõ, giúp người dùng thao tác nhanh ngay từ lần đầu.',
	},
	{
		title: 'Tiết kiệm chi phí',
		description: 'Thiết kế tối ưu quy trình để giảm thời gian và công sức vận hành.',
	},
	{
		title: 'Phù hợp theo ngành hàng',
		description: 'Cấu trúc linh hoạt cho nhiều nhóm kinh doanh và nhiều vai trò khác nhau.',
	},
];

const industries = [
	'Thời trang',
	'Điện thoại & Điện máy',
	'Vật liệu xây dựng',
	'Nhà thuốc',
	'Mẹ & Bé',
	'Sách & Văn phòng phẩm',
	'Nội thất & Gia dụng',
	'Hoa & Quà tặng',
	'Tap hóa & Siêu thị',
	'Mỹ phẩm',
	'Nông sản & Thực phẩm',
	'Xe, Máy móc',
];

const utilities = [
	{
		title: 'CONNECT',
		icon: Globe2,
		description: 'Kết nối dữ liệu, đội nhóm và quy trình vận hành thông suốt.',
	},
	{
		title: 'SMART',
		icon: BrainCircuit,
		description: 'Tư duy quản trị rõ ràng với bố cục trực quan và dễ dùng.',
	},
	{
		title: 'FAST',
		icon: Cpu,
		description: 'Truy cập nhanh, thao tác gọn, phù hợp công việc hằng ngày.',
	},
	{
		title: 'MANAGE',
		icon: LayoutGrid,
		description: 'Quản lý sản phẩm, đơn hàng và thông tin cửa hàng tập trung.',
	},
	{
		title: 'GROWTH',
		icon: TrendingUp,
		description: 'Theo dõi tăng trưởng và mở rộng kinh doanh theo dữ liệu thực tế.',
	},
];

export function LandingPage() {
	return (
		<div className="min-h-screen bg-[#f4f7fb] text-slate-900 overflow-x-hidden">
			<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
				<div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<BrandMark />

					<nav className="hidden items-center gap-8 md:flex">
						<a href="#products" className="text-base font-semibold text-rose-500 transition hover:text-rose-600">Sản phẩm</a>
						<a href="#benefits" className="text-base font-medium text-slate-700 transition hover:text-emerald-700">Lợi ích</a>
						<a href="#utilities" className="text-base font-medium text-slate-700 transition hover:text-emerald-700">Tiện ích</a>
						<a href="#support" className="text-base font-medium text-slate-700 transition hover:text-emerald-700">Hỗ trợ</a>
					</nav>

					<div className="flex items-center gap-3 text-sm font-medium">
						<Link href="/signin" className="rounded-md border-2 border-slate-900 px-4 py-2 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white">
							Đăng nhập
						</Link>
						<Link href="/signup" className="rounded-md px-2 py-2 text-slate-700 transition hover:text-emerald-700">
							Đăng ký
						</Link>
					</div>
				</div>
			</header>

			<main>
				<section id="home" className="w-full px-0 py-0">
					<div className="grid min-h-[calc(100vh-88px)] w-full overflow-hidden rounded-none border-0 bg-white shadow-none lg:grid-cols-[1.02fr_0.98fr] lg:min-h-[calc(100vh-88px)]">
						<div className="relative min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.22),transparent_20%),linear-gradient(135deg,#0d3f22_0%,#11b95f_42%,#d7f1da_100%)] p-5 sm:p-8">
							<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px] opacity-35" />
							<div className="relative grid h-full gap-5 sm:grid-cols-[0.92fr_1.08fr]">
								<div className="rounded-[1.8rem] border border-white/15 bg-[linear-gradient(180deg,rgba(8,47,25,0.52),rgba(0,0,0,0.18))] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-sm">
									<div className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100/90">Intelligence • Speed • Management</div>
									<div className="grid h-full gap-4 text-sm">
										<div className="rounded-3xl border border-white/10 bg-white/10 p-4">
											<p className="mb-2 font-semibold">AI hỗ trợ vận hành</p>
											<p className="text-white/80">Tối ưu dữ liệu, kiểm soát quy trình và phản hồi nhanh hơn.</p>
										</div>
										<div className="rounded-3xl border border-white/10 bg-white/10 p-4">
											<p className="mb-2 font-semibold">Quản lý linh hoạt</p>
											<p className="text-white/80">Phù hợp với owner, sales và warehouse trong cùng một hệ thống.</p>
										</div>
										<div className="rounded-3xl border border-white/10 bg-white/10 p-4">
											<p className="mb-2 font-semibold">Kết nối tăng trưởng</p>
											<p className="text-white/80">Theo dõi doanh số, hàng hóa và hiệu quả theo thời gian thực.</p>
										</div>
									</div>
								</div>

								<div className="relative flex flex-col justify-center rounded-[1.8rem] border border-white/30 bg-white/18 p-6 text-white backdrop-blur-md sm:p-10">
									<div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-white/10 blur-2xl" />
									<p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Hệ thống hỗ trợ quản lý bán hàng</p>
									<h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
										Quản lý bán hàng
										<br />
										theo cách rõ ràng hơn
									</h1>
									<p className="mt-6 max-w-lg text-lg leading-8 text-emerald-50/90">
										Landing page được ghép từ phần hero ban đầu và các khối nội dung phía dưới. Nút Sản phẩm sẽ cuộn thẳng xuống đúng section sản phẩm.
									</p>
									<div className="mt-10 flex flex-wrap gap-3">
										<a href="#products" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-black">
											Sản phẩm <ArrowRight className="h-4 w-4" />
										</a>
										<Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/15 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/25">
											Đăng ký ngay <ArrowRight className="h-4 w-4" />
										</Link>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.14),_transparent_28%),linear-gradient(180deg,#f1f8f1_0%,#d9f1da_100%)] p-6 sm:p-10">
							<div className="mx-auto w-full max-w-xl text-center lg:text-left">
								<div className="mb-6 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
									Khang Sales Platform
								</div>
								<h2 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-[3.65rem]">
									Một nền tảng bán hàng gọn, sáng và dễ triển khai.
								</h2>
								<p className="mt-6 text-lg leading-8 text-slate-600">
									Giao diện được thiết kế để cuộn tự nhiên từ phần giới thiệu đến các nhóm sản phẩm, tiện ích và đăng ký dùng thử.
								</p>

								<div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
			                        <Link href="/signin" className="rounded-full border-2 border-slate-900 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-600 hover:border-emerald-600 hover:text-white">
										Đăng nhập
									</Link>
									<a href="#benefits" className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700">
										Xem lợi ích
									</a>
								</div>

								<div className="mt-12 grid gap-4 sm:grid-cols-3">
									{[
										'Triển khai nhanh',
										'Phân vai rõ ràng',
										'Tối ưu cho bán hàng',
									].map((item) => (
										<div key={item} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
											{item}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="benefits" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<div className="text-center">
						<h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">Khang giúp bạn quản lý dễ dàng, bán hàng hiệu quả</h3>
					</div>

					<div className="mt-8 grid gap-5 md:grid-cols-3">
						{benefits.map((item) => (
							<article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
									<ShieldCheck className="h-6 w-6" />
								</div>
								<h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
								<p className="mt-3 leading-7 text-slate-600">{item.description}</p>
							</article>
						))}
					</div>
				</section>

				<section id="products" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">Chúng tôi thiết kế phần mềm quản lý bán hàng chuyên biệt cho từng ngành hàng</h3>
					</div>

					<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{industries.map((industry) => (
							<div key={industry} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
								<PackageSearch className="h-5 w-5 text-sky-600" />
								<span className="font-medium text-slate-700">{industry}</span>
							</div>
						))}
					</div>

					<div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-[2rem] bg-emerald-50 px-6 py-6 text-center">
						<span className="text-sm font-semibold text-slate-600">7 ngày dùng thử miễn phí</span>
						<Link href="/signup" className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700">
							Đăng ký ngay
						</Link>
					</div>
				</section>

				<section id="utilities" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					<div className="text-center">
						<h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tiện ích nổi bật</h3>
						<p className="mt-3 text-slate-600">5 tiện ích theo tinh thần logo Khang bạn gửi: CONNECT, SMART, FAST, MANAGE, GROWTH.</p>
					</div>

					<div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
						{utilities.map((item) => {
							const Icon = item.icon;

							return (
								<article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
									<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22c55e,#10b981)] text-white shadow-lg">
										<Icon className="h-6 w-6" />
									</div>
									<h4 className="text-base font-extrabold tracking-[0.2em] text-slate-900">{item.title}</h4>
									<p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
								</article>
							);
						})}
					</div>
				</section>

				<section id="support" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
					<div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_50%,#16a34a_100%)] px-6 py-10 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:px-10">
						<div className="max-w-3xl">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
								<CircleDollarSign className="h-4 w-4" />
								KiotViệt - Giải pháp kinh doanh toàn diện
							</div>
							<h3 className="mt-5 text-3xl font-bold sm:text-4xl">Bắt đầu từ landing page, sau đó đi vào đăng ký và đăng nhập</h3>
							<p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
								Landing page, trang đăng ký và trang đăng nhập đã được nối cùng một ngôn ngữ thiết kế, có thể mở rộng thêm dữ liệu thật sau này.
							</p>
						</div>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link href="/signup" className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">
								Tạo tài khoản
							</Link>
							<Link href="/signin" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
								Đăng nhập
							</Link>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
