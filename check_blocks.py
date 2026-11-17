path = r"C:\Users\user\Desktop\Job-Application-App\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

prof_start = text.find('{activeTab === "profile" && (')
sett_start = text.find('{activeTab === "settings" && (')
main_end = text.find('</main>')

print("prof_start:", prof_start)
print("sett_start:", sett_start)
print("main_end:", main_end)
