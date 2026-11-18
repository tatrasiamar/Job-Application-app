import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

def load_env():
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())

def main():
    load_env()

    host = os.environ.get("BREVO_SMTP_HOST", "smtp-relay.brevo.com")
    port = int(os.environ.get("BREVO_SMTP_PORT", 587))
    user = os.environ.get("BREVO_SMTP_USER", "c2812c001@smtp-brevo.com")
    key = os.environ.get("BREVO_SMTP_KEY", "")
    default_sender = os.environ.get("BREVO_SENDER_EMAIL", "tatrasiamar123@gmail.com")

    print("=" * 60)
    print("Brevo SMTP Interactive Sender")
    print("=" * 60)

    recipient = input("Enter recipient email (e.g., your personal or work email): ").strip()
    if not recipient:
        print("[!] Error: Recipient cannot be empty.")
        return

    subject = input("Enter email subject [Default: 'Hi from Brevo']: ").strip()
    if not subject:
        subject = "Hi from Brevo"

    body = input("Enter message body [Default: 'Hello! This is a test email via Brevo SMTP']: ").strip()
    if not body:
        body = "Hello!\n\nThis is a test email via Brevo SMTP relay."

    print("\nConnecting to Brevo SMTP server...")
    try:
        server = smtplib.SMTP(host, port, timeout=25)
        server.starttls()
        server.login(user, key)

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Amar <{default_sender}>"
        msg["To"] = recipient

        msg.attach(MIMEText(body, "plain"))

        print(f"Sending message from <{default_sender}> to <{recipient}>...")
        server.sendmail(default_sender, [recipient], msg.as_string())
        server.quit()

        print("\n" + "=" * 60)
        print(f">>> SUCCESS: Email dispatched to {recipient}!")
        print("=" * 60)
        print("Note: If using Gmail or Outlook, check the Spam / Promotions tab")
        print("if it does not show up in Primary Inbox within 1-2 minutes.")

    except Exception as e:
        print(f"\n[!] Delivery failed: {e}")

if __name__ == "__main__":
    main()

