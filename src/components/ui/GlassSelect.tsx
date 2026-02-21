'use client';

interface GlassSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function GlassSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = '',
  required = false,
}: GlassSelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="
          w-full rounded-xl border border-white/[0.08]
          bg-white/[0.04] backdrop-blur-xl
          px-4 py-2.5 text-sm text-slate-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30
          transition-all duration-200 appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
          bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]
        "
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
