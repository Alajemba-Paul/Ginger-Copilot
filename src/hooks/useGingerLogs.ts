import { useState, useCallback } from 'react';

export function useGingerLogs() {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Booting Ginger Copilot... Meow.",
    "[SYSTEM] Establishing secure Ledger DMK pipeline..."
  ]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  return { logs, addLog };
}
