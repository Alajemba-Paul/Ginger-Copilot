'use client';

import React from 'react';
import ControlPanel from '@/components/dashboard/ControlPanel';
import TerminalLog from '@/components/dashboard/TerminalLog';
import { useGingerLogs } from '@/hooks/useGingerLogs';

export default function GingerDashboard() {
  const { logs, addLog } = useGingerLogs();

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-mono">
      <ControlPanel addLog={addLog} />
      <TerminalLog logs={logs} />
    </div>
  );
}
