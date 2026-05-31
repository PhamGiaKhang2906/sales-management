import { Sparkles } from 'lucide-react';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${compact ? '' : 'select-none'}`}>
      <div className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} relative flex items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_30%,#86efac_0%,#22c55e_38%,#14532d_100%)] text-white shadow-[0_12px_30px_rgba(22,163,74,0.28)]`}>
        <Sparkles className={`${compact ? 'h-5 w-5' : 'h-6 w-6'}`} />
      </div>
      <div>
        <div className={`${compact ? 'text-xl' : 'text-2xl'} font-extrabold tracking-tight text-emerald-700`}>Khang</div>
        <div className={`${compact ? 'text-[0.58rem]' : 'text-[0.65rem]'} font-semibold uppercase tracking-[0.35em] text-slate-500`}>
          Sales Platform
        </div>
      </div>
    </div>
  );
}