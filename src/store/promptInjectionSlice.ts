import { create } from 'zustand';
import { DEMO_FINDINGS, DEMO_HISTORY, DEMO_BATCHES } from '@/data/promptInjectionMockData';

interface PromptInjectionState {
  targetPurpose: string;
  targetModel: string;
  isScanning: boolean;
  scanResult: any | null;
  scanError: string | null;
  history: any[];
  batches: any[];
  findings: any[];

  setTargetPurpose: (val: string) => void;
  setTargetModel: (val: string) => void;
  setScanResult: (val: any | null) => void;
  setScanError: (val: string | null) => void;
  setIsScanning: (val: boolean) => void;

  runSimulation: () => Promise<void>;
}

export const usePromptInjectionStore = create<PromptInjectionState>((set, get) => ({
  targetPurpose: 'An AI assistant',
  targetModel: 'Llama 3.2 3B',
  isScanning: false,
  scanResult: null,
  scanError: null,
  history: DEMO_HISTORY,
  batches: DEMO_BATCHES,
  findings: DEMO_FINDINGS,

  setTargetPurpose: (targetPurpose) => set({ targetPurpose }),
  setTargetModel: (targetModel) => set({ targetModel }),
  setScanResult: (scanResult) => set({ scanResult }),
  setScanError: (scanError) => set({ scanError }),
  setIsScanning: (isScanning) => set({ isScanning }),
  
  runSimulation: async () => {
    const { targetModel, targetPurpose } = get();
    if (!targetModel || !targetPurpose) return;
    
    set({ isScanning: true, scanError: null, scanResult: null });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple naive classification for demo purposes
    const lowerPrompt = targetPurpose.toLowerCase();
    let match = DEMO_FINDINGS[0]; // default: Direct Prompt Injection
    
    if (lowerPrompt.includes('system') || lowerPrompt.includes('hidden')) {
      match = DEMO_FINDINGS[1]; // System Prompt Extraction
    } else if (lowerPrompt.includes('admin') || lowerPrompt.includes('mode')) {
      match = DEMO_FINDINGS[2]; // Role Manipulation
    } else if (lowerPrompt.includes('forget') || lowerPrompt.includes('disregard')) {
      match = DEMO_FINDINGS[3]; // Context Hijacking
    }
    
    const result = {
      status: 'completed',
      model_name: targetModel,
      prompt_text: targetPurpose,
      model_response: match.simulatedResponse,
      prompt_scan: {
        is_malicious: match.status === 'Vulnerable',
        risk_score: match.riskScore,
        injection_type: match.category,
        confidence: 0.95,
        severity: match.severity,
        mitigation: match.recommendation,
        detected_patterns: [match.technique]
      },
      summary: {
        total_tests: 1,
        vulnerabilities_found: match.status === 'Vulnerable' ? 1 : 0,
        passed: match.status === 'Vulnerable' ? 0 : 1,
        attack_success_rate: match.status === 'Vulnerable' ? 100 : 0
      },
      attempts: [
        {
          prompt: targetPurpose,
          response: match.simulatedResponse,
          passed: match.status !== 'Vulnerable',
          detector: match.category,
          probe: match.technique
        }
      ]
    };
    
    set((state) => ({ 
      scanResult: result,
      isScanning: false,
      history: [
        {
          id: `SCAN-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          name: "Demo Assessment",
          model: targetModel,
          tests: 1,
          passed: match.status === 'Vulnerable' ? 0 : 1,
          findings: match.status === 'Vulnerable' ? 1 : 0,
          risk: match.severity,
          status: "Completed",
          timestamp: new Date().toISOString()
        },
        ...state.history
      ]
    }));
  }
}));
