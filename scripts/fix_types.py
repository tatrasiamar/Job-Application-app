import re

path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add Key to lucide-react imports if missing
if "Key," not in text:
    text = text.replace("Lock,", "Lock,\n  Key,")

# 2. Add AppSettings interface
interface_def = '''interface AppSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpKey: string;
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  replyToName: string;
  coldMailProvider: string;
  coldMailApiKey: string;
  jobSearchProvider: string;
  rapidapiKey: string;
  adzunaAppId: string;
  adzunaAppKey: string;
  serpapiKey: string;
  customJobSearchUrl: string;
}

'''

if "interface AppSettings" not in text:
    idx = text.find("interface ResumeRecord")
    text = text[:idx] + interface_def + text[idx:]

# Update useState for settings
text = re.sub(
    r'const \[settings, setSettings\] = useState\(\{',
    'const [settings, setSettings] = useState<AppSettings>({',
    text
)

# 3. Fix chosenFile in handleSendEmail
old_chosen = "const chosenFile = resumes.find((r) => r.fileName === selectedAttachment) || uploadedFiles.find((f) => f.filename === selectedAttachment);"
new_chosen = "const chosenFile: any = resumes.find((r) => r.fileName === selectedAttachment) || uploadedFiles.find((f) => f.filename === selectedAttachment);"
text = text.replace(old_chosen, new_chosen)

text = text.replace(
    "attachmentPath: chosenFile ? chosenFile.path : undefined,",
    "attachmentPath: chosenFile ? (chosenFile.filePath || chosenFile.path) : undefined,"
)
text = text.replace(
    "attachmentFilename: chosenFile ? chosenFile.filename : selectedAttachment,",
    "attachmentFilename: chosenFile ? (chosenFile.fileName || chosenFile.filename) : selectedAttachment,"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixes applied successfully!")
