import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { PublicPage } from "../components/public-page";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@simulaconcurso.com";

export default function ContactPage() {
  return (
    <PublicPage title="Contato" description="Fale com a equipe do Simula Concurso.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={whatsappUrl} target="_blank" className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#061421]/55 p-5 font-bold text-emerald-300 hover:bg-[#061421]/70">
          <MessageCircle size={22} /> WhatsApp
        </Link>
        <Link href={`mailto:${contactEmail}`} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#061421]/55 p-5 font-bold text-emerald-300 hover:bg-[#061421]/70">
          <Mail size={22} /> {contactEmail}
        </Link>
      </div>
    </PublicPage>
  );
}
