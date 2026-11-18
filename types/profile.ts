export interface CandidateProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  experience: string;
  skills: string;
  noticePeriod: string;
  location: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
}

export interface ResumeRecord {
  id: string;
  userId?: string;
  fileName: string;
  filePath: string;
  fileSizeKb: number;
  isDefault: boolean;
  uploadedAt: string;
  downloadUrl: string;
}

export interface UploadedFile {
  filename: string;
  path: string;
  sizeKb: number;
  uploadedAt: string;
}
