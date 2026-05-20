import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
        <GraduationCap size={22} />
      </span>
      {!compact && <span className="text-lg text-white">Simula Concurso</span>}
    </Link>
  );
}
