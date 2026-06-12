'use client';

import React from 'react';
import ControlPanel from '@/components/dashboard/ControlPanel';
import TerminalLog from '@/components/dashboard/TerminalLog';
import { useGingerLogs } from '@/hooks/useGingerLogs';

export default function GingerDashboard() {
  const { logs, addLog } = useGingerLogs();

  return (
    // Updated this line to flex-col on mobile, flex-row on desktop
    <div className="flex flex-col md:flex-row h-screen bg-[#0A0A0A] text-white font-mono overflow-hidden">
      <ControlPanel addLog={addLog} />
      <TerminalLog logs={logs} />
    </div>
  );
}
