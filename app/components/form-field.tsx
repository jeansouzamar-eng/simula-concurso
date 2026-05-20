export function FormField({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
      />
    </label>
  );
}
