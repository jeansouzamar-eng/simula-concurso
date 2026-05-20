import { Pencil, Plus, Trash2 } from "lucide-react";

type Field = {
  label: string;
  type?: "input" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
};

type Column = {
  key: string;
  label: string;
};

export function AdminCrud({
  title,
  description,
  fields,
  columns,
  rows,
}: {
  title: string;
  description: string;
  fields: Field[];
  columns: Column[];
  rows: Record<string, string | number>[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
            <Plus size={19} />
          </span>
        </div>

        <form className="mt-6 grid gap-4">
          {fields.map((field) => (
            <label key={field.label} className="block">
              <span className="text-sm font-bold text-slate-200">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  placeholder={field.placeholder ?? field.label}
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#061421]/55 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
                />
              ) : field.type === "select" ? (
                <select className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                  <option>Selecione</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder={field.placeholder ?? field.label}
                  className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
                />
              )}
            </label>
          ))}

          <button className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
            <Plus size={18} /> Salvar cadastro
          </button>
        </form>
      </section>

      <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Registros</h2>
            <p className="mt-2 text-sm text-slate-300">Registros carregados do banco de dados.</p>
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 font-bold text-white transition hover:bg-white/12">
            <Plus size={17} /> Novo
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-black">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-black">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-white/10">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-slate-200">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-emerald-300 transition hover:bg-white/12" aria-label="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-rose-300 transition hover:bg-white/12" aria-label="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
