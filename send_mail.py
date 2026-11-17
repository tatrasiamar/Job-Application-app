import argparse
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

def load_env():
    """Load key-value pairs from .env if present without external dependencies."""
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())

def main():
    load_env()

    parser = argparse.ArgumentParser(description="Send emails via Brevo SMTP relay.")
    parser.add_argument("--to", default="tatrasiamar123@gmail.com", help="Recipient email address")
    parser.add_argument("--subject", default="Hi", help="Email subject (default: 'Hi')")
    parser.add_argument("--body", default="Hi!\n\nThis is a message sent via Brevo SMTP.", help="Email body text")
    parser.add_argument("--html", help="Optional HTML body text")
    parser.add_argument("--from-email", help="Custom sender email (must be verified in Brevo)")
    args = parser.parse_args()

    host = os.environ.get("BREVO_SMTP_HOST", "smtp-relay.brevo.com")
    port = int(os.environ.get("BREVO_SMTP_PORT", 587))
    user = os.environ.get("BREVO_SMTP_USER", "c2812c001@smtp-brevo.com")
    key = os.environ.get("BREVO_SMTP_KEY", "")
    
    # In Brevo, the 'From' address must be an authorized sender, NOT the login username.
    sender = args.from_email or os.environ.get("BREVO_SENDER_EMAIL", "tatrasiamar123@gmail.com")

    print(f"Connecting to {host}:{port}...")
    server = smtplib.SMTP(host, port, timeout=30)
    server.starttls()
    server.login(user, key)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = args.subject
    msg["From"] = f"Amar <{sender}>"
    msg["To"] = args.to

    msg.attach(MIMEText(args.body, "plain"))
    if args.html:
        msg.attach(MIMEText(args.html, "html"))

    print(f"Sending message from <{sender}> to <{args.to}>...")
    server.sendmail(sender, [args.to], msg.as_string())
    server.quit()
    print(f"Successfully sent email to {args.to}!")

if __name__ == "__main__":
    main()
