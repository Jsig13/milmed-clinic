'use client';

interface GlassInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}

export default function GlassInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  required = false,
}: GlassInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="
          w-full rounded-xl border border-white/[0.08]
          bg-white/[0.04] backdrop-blur-xl
          px-4 py-2.5 text-sm text-slate-200
          placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30
          transition-all duration-200
        "
      />
    </div>
  );
}
