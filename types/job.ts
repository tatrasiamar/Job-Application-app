export type JobStatus = "wishlist" | "applied" | "interviewing" | "offer" | "rejected";

export interface EmailHistory {
  id: string;
  subject: string;
  sentAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  contactName: string;
  contactEmail: string;
  jobUrl?: string;
  location?: string;
  salary?: string;
  status: JobStatus;
  appliedDate?: string;
  lastContactDate?: string;
  notes?: string;
  emailHistory?: EmailHistory[];
}

export interface DiscoveredJob {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  url: string;
  tags: string[];
  description: string;
  publishedAt: string;
  source: string;
}
