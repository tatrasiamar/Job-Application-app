path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add Key to lucide imports
text = text.replace("Lock,\n  UserCheck,", "Lock,\n  UserCheck,\n  Key,")

# 2. Add full AppSettings object to useState<AppSettings>
old_settings_obj = '''  const [settings, setSettings] = useState<AppSettings>({

    smtpHost: "smtp-relay.brevo.com",

    smtpPort: "587",

    smtpUser: "c2812c001@smtp-brevo.com",

    smtpKey: "",

    senderEmail: "tatrasiamar123@gmail.com",

    senderName: "Tatrasi Amar",

    replyToEmail: "tatrasiamar123@gmail.com",

    replyToName: "Tatrasi Amar",

  });'''

new_settings_obj = '''  const [settings, setSettings] = useState<AppSettings>({
    smtpHost: "smtp-relay.brevo.com",
    smtpPort: "587",
    smtpUser: "c2812c001@smtp-brevo.com",
    smtpKey: "",
    senderEmail: "tatrasiamar123@gmail.com",
    senderName: "Tatrasi Amar",
    replyToEmail: "tatrasiamar123@gmail.com",
    replyToName: "Tatrasi Amar",
    coldMailProvider: "smtp",
    coldMailApiKey: "",
    jobSearchProvider: "open_apis",
    rapidapiKey: "",
    adzunaAppId: "",
    adzunaAppKey: "",
    serpapiKey: "",
    customJobSearchUrl: "",
  });'''

if old_settings_obj in text:
    text = text.replace(old_settings_obj, new_settings_obj)
    print("Replaced settings object cleanly")
else:
    # Match with regex
    import re
    text = re.sub(
        r'const \[settings, setSettings\] = useState<AppSettings>\(\{[\s\S]*?replyToName: "Tatrasi Amar",\s*\}\);',
        new_settings_obj,
        text
    )
    print("Replaced with regex")

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Settings and Key import updated!")
