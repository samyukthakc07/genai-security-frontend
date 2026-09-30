import re
file_path = 'src/pages/modules/PromptInjectionPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'usePromptInjectionStore' not in content:
    content = content.replace(
        \"import { useState, useCallback } from 'react'\",
        \"import { useState, useCallback } from 'react'\\nimport { usePromptInjectionStore } from '@/store/promptInjectionSlice'\"
    )

state_replacements = '''
    const {
      garakPurpose, setGarakPurpose,
      garakScanType, setGarakScanType,
      garakProbe, setGarakProbe,
      garakOllamaModel, setGarakOllamaModel,
      isGarakScanning, garakResult, garakError,
      isQuickScanning, quickResult, quickError,
      runGarakScan, runQuickScan,
      setGarakResult, setGarakError,
      setIsGarakScanning,
      setQuickResult, setQuickError, setIsQuickScanning
    } = usePromptInjectionStore()
'''

content = re.sub(r'const \[quickPrompt, setQuickPrompt\] = useState\(\\'\\'\\)', '', content)
content = re.sub(r'const \[quickModel, setQuickModel\] = useState\(\\'tinyllama\\'\\)', '', content)
content = re.sub(r'const \[isQuickScanning, setIsQuickScanning\] = useState\(false\)', '', content)
content = re.sub(r'const \[quickResult, setQuickResult\] = useState<QuickScanResult \| null>\(null\)', '', content)
content = re.sub(r'const \[quickError, setQuickError\] = useState<string \| null>\(null\)', '', content)

content = re.sub(r'const \[garakPurpose, setGarakPurpose\] = useState\(\\'An AI assistant\\'\\)', state_replacements, content)
content = re.sub(r'const \[garakScanType, setGarakScanType\] = useState\(\\'quick\\'\\)', '', content)
content = re.sub(r'const \[garakProbe, setGarakProbe\] = useState\(\\'probes\.promptinject\.HijackLongPrompt\\'\\)', '', content)
content = re.sub(r'const \[garakOllamaModel, setGarakOllamaModel\] = useState\(\\'\\'\\)', '', content)
content = re.sub(r'const \[isGarakScanning, setIsGarakScanning\] = useState\(false\)', '', content)
content = re.sub(r'const \[garakResult, setGarakResult\] = useState<any \| null>\(null\).*', '', content)
content = re.sub(r'const \[garakError, setGarakError\] = useState<string \| null>\(null\)', '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
