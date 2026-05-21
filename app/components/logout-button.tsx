"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ label = "Sair" }: { label?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]"
      aria-label={label}
      title={label}
    >
      <LogOut size={18} />
    </button>
  );
}
