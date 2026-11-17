"""
Brevo Mailer Utility Module
A reusable helper for sending plain text, HTML, and attachment emails via Brevo SMTP.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
from typing import List, Optional, Union

def load_env():
    """Load key-value pairs from .env if present."""
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

class BrevoMailer:
    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        user: Optional[str] = None,
        key: Optional[str] = None,
        default_sender: Optional[str] = None
    ):
        self.host = host or os.environ.get("BREVO_SMTP_HOST", "smtp-relay.brevo.com")
        self.port = int(port or os.environ.get("BREVO_SMTP_PORT", 587))
        self.user = user or os.environ.get("BREVO_SMTP_USER", "c2812c001@smtp-brevo.com")
        self.key = key or os.environ.get("BREVO_SMTP_KEY", "")
        self.default_sender = default_sender or os.environ.get("BREVO_SENDER_EMAIL", "tatrasiamar123@gmail.com")

    def send(
        self,
        to: Union[str, List[str]],
        subject: str,
        body: str,
        html_body: Optional[str] = None,
        sender: Optional[str] = None,
        sender_name: Optional[str] = "Amar",
        attachments: Optional[List[str]] = None,
        cc: Optional[Union[str, List[str]]] = None,
        bcc: Optional[Union[str, List[str]]] = None
    ) -> bool:
        """
        Send an email via Brevo SMTP relay.
        
        :param to: Single recipient or list of recipients
        :param subject: Email subject line
        :param body: Plain text message body
        :param html_body: Optional rich HTML body
        :param sender: Verified sender address (defaults to BREVO_SENDER_EMAIL)
        :param sender_name: Display name for the sender
        :param attachments: List of file paths to attach
        :param cc: Optional CC recipient(s)
        :param bcc: Optional BCC recipient(s)
        :return: True if successful
        """
        sender_email = sender or self.default_sender
        to_list = [to] if isinstance(to, str) else list(to)
        cc_list = ([cc] if isinstance(cc, str) else list(cc)) if cc else []
        bcc_list = ([bcc] if isinstance(bcc, str) else list(bcc)) if bcc else []
        all_recipients = to_list + cc_list + bcc_list

        msg = MIMEMultipart("mixed")
        msg["Subject"] = subject
        msg["From"] = f"{sender_name} <{sender_email}>" if sender_name else sender_email
        msg["To"] = ", ".join(to_list)
        if cc_list:
            msg["Cc"] = ", ".join(cc_list)

        # Content container
        content_part = MIMEMultipart("alternative")
        content_part.attach(MIMEText(body, "plain", "utf-8"))
        if html_body:
            content_part.attach(MIMEText(html_body, "html", "utf-8"))
        msg.attach(content_part)

        # File attachments
        if attachments:
            for file_path in attachments:
                path = Path(file_path)
                if not path.is_file():
                    print(f"[!] Warning: Attachment not found: {file_path}")
                    continue
                part = MIMEBase("application", "octet-stream")
                with open(path, "rb") as f:
                    part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f'attachment; filename="{path.name}"'
                )
                msg.attach(part)

        try:
            print(f"Connecting to {self.host}:{self.port}...")
            server = smtplib.SMTP(self.host, self.port, timeout=30)
            server.starttls()
            server.login(self.user, self.key)

            print(f"Sending to {', '.join(to_list)}...")
            server.sendmail(sender_email, all_recipients, msg.as_string())
            server.quit()
            print(">>> Email sent successfully!")
            return True
        except Exception as e:
            print(f"[!] Failed to send email: {e}")
            raise e

# Quick test if run directly
if __name__ == "__main__":
    mailer = BrevoMailer()
    mailer.send(
        to="shettyshashank2002@gmail.com",
        subject="Brevo Mailer Module Test",
        body="This was sent using the reusable BrevoMailer Python class.",
        html_body="""
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0b66c2;">Brevo Mailer Ready!</h2>
            <p>Your reusable Python mailer module is configured and working.</p>
        </div>
        """
    )

