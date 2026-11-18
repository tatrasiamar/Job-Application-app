import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Brevo SMTP Configuration
SMTP_SERVER = "smtp-relay.brevo.com"
SMTP_PORT = 587
SMTP_LOGIN = "c2812c001@smtp-brevo.com"
SMTP_KEY = os.environ.get(
    "BREVO_SMTP_KEY",
    ""
)
# SENDER MUST BE A VERIFIED SENDER IN BREVO (tatrasiamar123@gmail.com)
SENDER_EMAIL = os.environ.get("BREVO_SENDER_EMAIL", "tatrasiamar123@gmail.com")

def send_hi(recipient: str = "tatrasiamar123@gmail.com"):
    print(f"Connecting to {SMTP_SERVER}:{SMTP_PORT}...")
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=20)
    server.starttls()
    server.login(SMTP_LOGIN, SMTP_KEY)

    msg = MIMEMultipart()
    msg["Subject"] = "Hi from Brevo"
    msg["From"] = f"Amar <{SENDER_EMAIL}>"
    msg["To"] = recipient

    body = "Hi!\n\nThis is a test message sent via Brevo SMTP relay."
    msg.attach(MIMEText(body, "plain"))

    print(f"Sending email from <{SENDER_EMAIL}> to <{recipient}>...")
    server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
    server.quit()
    print(f">>> Email successfully sent to {recipient}! <<<")

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "tatrasiamar123@gmail.com"
    send_hi(target)
