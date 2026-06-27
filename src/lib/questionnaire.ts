// Définition centrale du questionnaire d'onboarding.
// Pour ajouter / modifier une question, il suffit d'éditer ce fichier :
// le formulaire client, l'espace client et la vue admin se mettent à jour seuls.

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect";

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean; // occupe toute la largeur
};

export type Section = {
  title: string;
  fields: Field[];
};

export const SECTIONS: Section[] = [
  {
    title: "Tes coordonnées",
    fields: [
      { id: "full_name", label: "Nom complet", type: "text" },
      { id: "email", label: "Email", type: "email" },
      { id: "phone", label: "Téléphone", type: "tel" },
      { id: "company", label: "Nom de ton entreprise / marque", type: "text" },
    ],
  },
  {
    title: "Ton projet",
    fields: [
      {
        id: "service",
        label: "Quelle(s) prestation(s) t'intéresse(nt) ?",
        type: "multiselect",
        options: [
          "Création de site",
          "Refonte de site",
          "Maintenance",
          "Coaching (gérer mon site seule)",
        ],
        full: true,
      },
      {
        id: "platform",
        label: "Plateforme souhaitée",
        type: "select",
        options: ["WordPress", "Shopify", "Autre", "Je ne sais pas encore"],
      },
      {
        id: "existing_site",
        label: "As-tu déjà un site ? (lien)",
        type: "text",
        placeholder: "https://…  ou  « non »",
      },
      {
        id: "goal",
        label: "Objectif principal du projet",
        type: "textarea",
        placeholder: "ex. vendre mes produits en ligne, gagner en crédibilité…",
        full: true,
      },
    ],
  },
  {
    title: "Ton activité & tes besoins",
    fields: [
      {
        id: "activity",
        label: "Décris ton activité / ce que tu vends",
        type: "textarea",
        full: true,
      },
      {
        id: "features",
        label: "Fonctionnalités souhaitées",
        type: "multiselect",
        options: [
          "Boutique en ligne",
          "Paiement en ligne",
          "Blog",
          "Prise de rendez-vous",
          "Espace membre",
          "Multilingue",
          "Formulaire de contact",
          "Newsletter",
        ],
        full: true,
      },
      {
        id: "volume",
        label: "Nombre de pages / produits estimé",
        type: "text",
        placeholder: "ex. 5 pages, ~30 produits",
      },
      {
        id: "branding",
        label: "Identité visuelle (logo, couleurs)",
        type: "select",
        options: ["J'ai déjà tout", "J'ai un logo seulement", "À créer entièrement"],
      },
      {
        id: "inspirations",
        label: "Sites que tu aimes (liens / styles)",
        type: "textarea",
        full: true,
      },
      {
        id: "domain",
        label: "Nom de domaine",
        type: "select",
        options: ["J'en ai déjà un", "À acheter", "Je ne sais pas"],
      },
    ],
  },
  {
    title: "Cadrage",
    fields: [
      {
        id: "budget",
        label: "Budget envisagé",
        type: "select",
        options: ["< 500 €", "500 – 1500 €", "1500 – 3000 €", "3000 € +", "À définir"],
      },
      {
        id: "deadline",
        label: "Échéance souhaitée",
        type: "text",
        placeholder: "ex. avant septembre",
      },
      {
        id: "autonomy",
        label: "Coaching : ce que tu veux apprendre à gérer seule",
        type: "textarea",
        placeholder: "ex. ajouter des produits, écrire des articles, mettre à jour le site…",
        full: true,
      },
      {
        id: "message",
        label: "Autre chose à ajouter ?",
        type: "textarea",
        full: true,
      },
    ],
  },
];

export const FIELDS: Field[] = SECTIONS.flatMap((s) => s.fields);

export function emptyAnswers(): Record<string, string> {
  return Object.fromEntries(FIELDS.map((f) => [f.id, ""]));
}

export function sanitizeAnswers(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const obj = (input ?? {}) as Record<string, unknown>;
  for (const f of FIELDS) {
    out[f.id] = typeof obj[f.id] === "string" ? (obj[f.id] as string) : "";
  }
  return out;
}
