path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "rb") as f:
    data = f.read()

# Replace any byte sequences that look like â€¢ (0xc3 0xa2 0xe2 0x82 0xac 0xc2 0xa2 or similar)
import re
text = data.decode("utf-8", errors="replace")
lines = text.splitlines(keepends=True)
for i, line in enumerate(lines):
    if "profile.name" in line and "profile.title" in line:
        print("Line before:", repr(line))
        # Replace whatever is between profile.name} and {profile.title with " • "
        line = re.sub(r"\{profile\.name\}[^{]+\{profile\.title\}", "{profile.name} • {profile.title}", line)
        print("Line after:", repr(line))
        lines[i] = line

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Done")

