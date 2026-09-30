import sys
import glob
import re

for file_path in glob.glob("src/pages/modules/*.tsx"):
    if "components" in file_path: continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove local definition of renderSafeString if it exists
    content = re.sub(r"const renderSafeString = \(v: any\): string => \{.*?\};\n", "", content, flags=re.DOTALL)
    
    # Remove all imports of renderSafeString
    content = re.sub(r"import\s+\{.*?renderSafeString.*?\}\s+from\s+[\"'].*?[\"'].*?\n", "", content)
    
    # Add one import at the top
    if "renderSafeString" in content:
        lines = content.split("\n")
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith("import"):
                last_import = i
        lines.insert(last_import + 1, "import { renderSafeString } from \"./components/ResultsDisplay\"")
        content = "\n".join(lines)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
print("Done fixing duplicates!")
