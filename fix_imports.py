import glob

for file_path in glob.glob("src/pages/modules/*.tsx"):
    if "components" in file_path: continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "renderSafeString" in content and "import { renderSafeString }" not in content:
        lines = content.split("\n")
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith("import"):
                last_import = i
        lines.insert(last_import + 1, "import { renderSafeString } from './components/ResultsDisplay'")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

print("Fixed imports!")

