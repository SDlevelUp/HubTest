"use client";

export type QForm = {
  full_name: string;
  email: string;
  phone: string;
  activity: string;
  level: string;
  objectives: string;
  budget: string;
  availability: string;
  message: string;
};

export const emptyQForm: QForm = {
  full_name: "",
  email: "",
  phone: "",
  activity: "",
  level: "",
  objectives: "",
  budget: "",
  availability: "",
  message: "",
};

const input =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8d47dc]/30";
const label = "block text-sm font-medium text-[#0a0a0a] mb-1";

export default function QuestionnaireFields({
  form,
  set,
}: {
  form: QForm;
  set: (f: QForm) => void;
}) {
  const up = (k: keyof QForm) => (e: { target: { value: string } }) =>
    set({ ...form, [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={label}>Nom complet</label>
        <input className={input} value={form.full_name} onChange={up("full_name")} />
      </div>
      <div>
        <label className={label}>Email</label>
        <input className={input} type="email" value={form.email} onChange={up("email")} />
      </div>
      <div>
        <label className={label}>Téléphone</label>
        <input className={input} value={form.phone} onChange={up("phone")} />
      </div>
      <div>
        <label className={label}>Ton activité / secteur</label>
        <input className={input} value={form.activity} onChange={up("activity")} />
      </div>
      <div>
        <label className={label}>Ton niveau</label>
        <select className={input} value={form.level} onChange={up("level")}>
          <option value="">—</option>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select>
      </div>
      <div>
        <label className={label}>Budget envisagé</label>
        <input className={input} value={form.budget} onChange={up("budget")} placeholder="ex. 500–1000 €" />
      </div>
      <div className="md:col-span-2">
        <label className={label}>Tes objectifs</label>
        <textarea className={input} rows={3} value={form.objectives} onChange={up("objectives")} />
      </div>
      <div>
        <label className={label}>Tes disponibilités</label>
        <input className={input} value={form.availability} onChange={up("availability")} placeholder="ex. soirs & week-ends" />
      </div>
      <div className="md:col-span-2">
        <label className={label}>Message libre</label>
        <textarea className={input} rows={3} value={form.message} onChange={up("message")} />
      </div>
    </div>
  );
}
