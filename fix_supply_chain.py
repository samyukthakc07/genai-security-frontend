import sys
import os

file_path = "src/pages/modules/SupplyChainPage.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

safe_formatter = """
const renderSafeString = (v: any): React.ReactNode => {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return `${v.length} items`;
  if (typeof v === 'object') {
    return v.name || v.id || v.title || v.version || v.package || JSON.stringify(v);
  }
  return String(v);
};
"""

content = content.replace("export function SupplyChainPage() {", safe_formatter + "\nexport function SupplyChainPage() {")
content = content.replace("{sbom.components} components", "{Array.isArray(sbom.components) ? sbom.components.length : (typeof sbom.components === 'object' && sbom.components !== null ? 1 : sbom.components)} components")
content = content.replace("{sbom.vulnerabilities} vulns", "{Array.isArray(sbom.vulnerabilities) ? sbom.vulnerabilities.length : (typeof sbom.vulnerabilities === 'object' && sbom.vulnerabilities !== null ? 1 : sbom.vulnerabilities)} vulns")
content = content.replace("render: (v: unknown) => <span className=\"text-xs text-gray-600\">{v as string}</span>", "render: (v: unknown) => <span className=\"text-xs text-gray-600\">{renderSafeString(v)}</span>")
content = content.replace("{sdk.sdk_name}", "{renderSafeString(sdk.sdk_name)}")
content = content.replace("{sdk.sdk_version}", "{renderSafeString(sdk.sdk_version)}")
content = content.replace("{sdk.provider}", "{renderSafeString(sdk.provider)}")
content = content.replace("{sdk.permissions_required?.map((p: string) => (", "{Array.isArray(sdk.permissions_required) && sdk.permissions_required.map((p: any) => (")
content = content.replace(">{p}</span>", ">{renderSafeString(p)}</span>")
content = content.replace("key={p}", "key={typeof p === 'string' ? p : JSON.stringify(p)}")
content = content.replace("{sbom.sbom_version}", "{renderSafeString(sbom.sbom_version)}")
content = content.replace("{sbom.format}", "{renderSafeString(sbom.format)}")
content = content.replace("{ key: 'dependency_name', label: 'Package', sortable: true },", "{ key: 'dependency_name', label: 'Package', sortable: true, render: (v: unknown) => <span className=\"font-medium\">{renderSafeString(v)}</span> },")
content = content.replace("{ key: 'dependency_version', label: 'Version', sortable: true },", "{ key: 'dependency_version', label: 'Version', sortable: true, render: (v: unknown) => renderSafeString(v) },")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done fixing SupplyChainPage.tsx")
