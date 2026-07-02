export interface Project {
  id: string;
  category: "personal" | "portfolio" | "e-commerce" | "business" | "others" | string;
  title: string;
  logo: string;
  headline: string;
  color: string;
  glowColor: string;
  status: "published" | "draft";
  isFeatured: boolean;
  link?: string;
  description?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  reply?: string;
}

export interface StatItem {
  value: string;
  suffix: string;
  label: string;
  description: string;
}
