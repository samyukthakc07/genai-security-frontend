import sys
import os
import glob

formatter_import = "import { renderSafeString } from './components/ResultsDisplay'"

for file_path in glob.glob("src/pages/modules/*.tsx"):
    if "components" in file_path: continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already imported
    if "renderSafeString" not in content and "{v as string" in content:
        # inject import after the last import
        lines = content.split("\n")
        last_import = -1
        for i, line in enumerate(lines):
            if line.startswith("import"):
                last_import = i
        if last_import != -1:
            lines.insert(last_import + 1, "import { renderSafeString } from './components/ResultsDisplay'")
            content = "\n".join(lines)
            
    content = content.replace("{v as string}", "{renderSafeString(v)}")
    content = content.replace("{v as string || 'N/A'}", "{renderSafeString(v) || 'N/A'}")
    content = content.replace("{v as string || 'none'}", "{renderSafeString(v) || 'none'}")
    content = content.replace("{v as string || 'medium'}", "{renderSafeString(v) || 'medium'}")
    content = content.replace("{(v as string).replace", "{String(renderSafeString(v)).replace")
    content = content.replace("{capitalize(v as string)}", "{capitalize(String(renderSafeString(v)))}")
    content = content.replace("{formatRelativeTime(v as string)}", "{formatRelativeTime(String(renderSafeString(v)))}")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
print("Done fixing all pages!")

