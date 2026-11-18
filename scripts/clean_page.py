import re

path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    c = f.read()

replacements = {
    "\u00e2\u20ac\u00a2": "•",
    "\u00e2\u20ac\u201d": "—",
    "\u00e2\u0153\u201c": "✓",
    "\u00e2\u201a\u00b9": "₹",
    'name: "Candidate",': 'name: "Tatrasi Amar",',
    'title: "Software Engineer",': 'title: "Full-Stack Software Engineer (Java • Spring Boot • React • Next.js)",',
    'email: "",': 'email: "tatrasiamar123@gmail.com",',
    'phone: "",': 'phone: "+91 7330807277",',
}

for k, v in replacements.items():
    c = c.replace(k, v)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Replacement complete!")

