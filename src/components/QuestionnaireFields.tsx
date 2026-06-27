"use client";

import { SECTIONS, type Field } from "@/lib/questionnaire";

const inputCls =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8d47dc]/30";
const labelCls = "block text-sm font-medium text-[#0a0a0a] mb-1";

export type Answers = Record<string, string>;

export default function QuestionnaireFields({
  answers,
  set,
}: {
  answers: Answers;
  set: (a: Answers) => void;
}) {
  const update = (id: string, value: string) => set({ ...answers, [id]: value });

  return (
    <div className="space-y-8">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="font-title text-base text-[#8d47dc] mb-3">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((f) => (
              <FieldInput
                key={f.id}
                field={f}
                value={answers[f.id] ?? ""}
                onChange={(v) => update(f.id, v)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const wrap = field.full ? "md:col-span-2" : "";

  if (field.type === "textarea") {
    return (
      <div className={wrap}>
        <label className={labelCls}>{field.label}</label>
        <textarea
          className={inputCls}
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={wrap}>
        <label className={labelCls}>{field.label}</label>
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = value ? value.split(", ").filter(Boolean) : [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(next.join(", "));
    };
    return (
      <div className={wrap}>
        <label className={labelCls}>{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const on = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  on
                    ? "bg-[#8d47dc] text-white border-[#8d47dc]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#8d47dc]"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <label className={labelCls}>{field.label}</label>
      <input
        className={inputCls}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
