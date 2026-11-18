from brevo_mailer import BrevoMailer

def main():
    mailer = BrevoMailer()
    recipients = ["tatrasiamar123@gmail.com", "shettyshashank2002@gmail.com"]
    attachment_file = "Tatrasi_Amar_Resume.pdf"

    subject = "Resume - Tatrasi Amar (Software Engineer | Full-Stack Developer)"
    text_body = """Hello,

Please find attached my resume for your review.

Key Highlights:
- Full-Stack Software Engineer with 2 years of experience in Java, Spring Boot, React, Next.js, and PostgreSQL.
- Architected multi-tenant HRMS & Payroll engines and real-time IoT architectures.
- Immediate Joiner.

Best regards,
Tatrasi Amar
Phone: +91 7330807277
Email: tatrasiamar123@gmail.com
"""

    html_body = """
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
      <h2 style="color: #0b66c2; margin-bottom: 5px;">Tatrasi Amar</h2>
      <p style="margin-top: 0; color: #555;"><strong>Software Engineer | Full-Stack Developer</strong> (Java · Spring Boot · React · Next.js)</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
      <p>Hello,</p>
      <p>Please find attached my resume (<strong>Tatrasi_Amar_Resume.pdf</strong>) for your review.</p>
      <ul>
        <li><strong>Experience:</strong> 2 years building commercial multi-tenant B2B SaaS platforms and real-time IoT architectures.</li>
        <li><strong>Tech Stack:</strong> Java, Spring Boot, React, Next.js, TypeScript, PostgreSQL, MQTT, Gemini API.</li>
        <li><strong>Notice Period:</strong> Immediate Joiner.</li>
      </ul>
      <p>Looking forward to connecting with you!</p>
      <br>
      <p>Best regards,<br>
      <strong>Tatrasi Amar</strong><br>
      📞 +91 7330807277 | ✉️ tatrasiamar123@gmail.com</p>
    </div>
    """

    for r in recipients:
        print(f"Sending to {r}...")
        mailer.send(
            to=r,
            subject=subject,
            body=text_body,
            html_body=html_body,
            attachments=[attachment_file],
            sender_name="Tatrasi Amar"
        )
    print("\n>>> All emails with the resume attachment have been sent successfully! <<<")

if __name__ == "__main__":
    main()

