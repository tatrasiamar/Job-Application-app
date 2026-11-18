import os
import sys
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
DEFAULT_SENDER = os.environ.get("BREVO_SENDER_EMAIL", "tatrasiamar123@gmail.com")

def test_smtp_connection(
    to_email: str | None = None,
    from_email: str | None = None
):
    print("=" * 60)
    print("Brevo SMTP Test")
    print("=" * 60)
    print(f"Server:   {SMTP_SERVER}")
    print(f"Port:     {SMTP_PORT}")
    print(f"Login:    {SMTP_LOGIN}")
    print("Key/Pass: configured" if SMTP_KEY else "Key/Pass: missing")
    print("-" * 60)

    server = None
    try:
        print("[1/3] Connecting to SMTP server...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=20)
        print("\n[2/3] Initiating STARTTLS...")
        server.ehlo()
        server.starttls()
        server.ehlo()

        print("\n[3/3] Authenticating...")
        server.login(SMTP_LOGIN, SMTP_KEY)
        print("\n>>> SUCCESS: Authentication successful! Credentials are valid. <<<")

        if to_email:
            sender = from_email or DEFAULT_SENDER
            print(f"\n[+] Sending test email from verified sender <{sender}> to <{to_email}>...")

            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Brevo SMTP Test Email"
            msg["From"] = f"Amar <{sender}>"
            msg["To"] = to_email

            text_body = "Hello!\n\nThis is a test email sent via Brevo SMTP relay."
            html_body = """\
            <html>
              <body>
                <h2>Brevo SMTP Test</h2>
                <p>Congratulations! Your Brevo SMTP configuration is working properly.</p>
              </body>
            </html>
            """
            msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            server.sendmail(sender, [to_email], msg.as_string())
            print(f"\n>>> SUCCESS: Test email sent successfully to {to_email}! <<<")
        else:
            print("\n(Note: No recipient specified. To send a real test email, pass recipient as argument.)")
            print("Usage: python test_brevo_smtp.py <recipient_email> [sender_email]")

    except smtplib.SMTPAuthenticationError as e:
        print(f"\n[!] Authentication Failed: {e}")
    except smtplib.SMTPResponseException as e:
        print(f"\n[!] SMTP Error ({e.smtp_code}): {e.smtp_error.decode('utf-8', errors='ignore')}")
    except Exception as e:
        print(f"\n[!] Connection Error: {e}")
    finally:
        if server:
            try:
                server.quit()
            except Exception:
                pass
        print("=" * 60)

if __name__ == "__main__":
    recipient = sys.argv[1] if len(sys.argv) > 1 else None
    sender = sys.argv[2] if len(sys.argv) > 2 else None
    test_smtp_connection(to_email=recipient, from_email=sender)
