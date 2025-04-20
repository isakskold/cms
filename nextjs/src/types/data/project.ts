export interface CustomField {
  id: string;
  name: string;
  type: "input" | "textarea" | "multiselect" | "image";
  value: string | string[];
}

export interface Project {
  id: string;
  lastEdited: string;
  name: string;
  description: string;
  logo?: string;
  longDescription?: string;
  skills?: string[];
  website?: string;
  github?: string;
  images?: string[];
  customFields?: CustomField[];
}
