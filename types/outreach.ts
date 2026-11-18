export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

export interface SendEmailPayload {
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  resumeFileName?: string;
  jobId?: string;
  templateId?: string;
  customNotes?: string;
}
