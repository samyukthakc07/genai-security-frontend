import sys
file_path = "src/pages/modules/VectorSecurityPage.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { renderSafeString } from \"./components/ResultsDisplay\"", "import { ResultsSummary, ResultsTable, ModuleStatCard, RiskScoreCard, renderSafeString } from \"./components/ResultsDisplay\"")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

