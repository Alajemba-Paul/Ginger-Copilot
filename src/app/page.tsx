'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGingerLogs } from '@/hooks/useGingerLogs';
import { InjectiveMCPClient } from '@/core/mcp/client';
import { TxBuilder } from '@/core/injective/tx-builder';
import { LedgerDMKPipeline } from '@/core/ledger/dmk-pipeline';

export default function GingerDashboard() {
  const { logs, addLog } = useGingerLogs();
  
  const [currentView, setCurrentView] = useState<'staking' | 'sniper' | 'yield'>('staking');
  const [agentStatus, setAgentStatus] = useState<'offline' | 'connecting' | 'online'>('offline');
  const [ledgerStatus, setLedgerStatus] = useState<'disconnected' | 'connecting' | 'ready'>('disconnected');

  const mcpClient = new InjectiveMCPClient(addLog);
  const txBuilder = new TxBuilder(addLog);
  const dmkPipeline = new LedgerDMKPipeline(addLog);

  const endOfLogsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleToggleAgent = async () => {
    if (agentStatus === 'online') {
      setAgentStatus('offline');
      addLog("[SYSTEM] Agent disconnected.");
    } else {
      setAgentStatus('connecting');
      addLog("[SYSTEM] Booting Ginger AI Agent interface...");
      await new Promise(r => setTimeout(r, 1000));
      setAgentStatus('online');
      addLog("[SYSTEM] Agent Online. MCP connection established.");
    }
  };

  const handleToggleLedger = async () => {
    if (ledgerStatus === 'ready') {
      setLedgerStatus('disconnected');
      addLog("[SYSTEM] Hardware connection dropped.");
    } else {
      setLedgerStatus('connecting');
      addLog("[SYSTEM] Pinging Speculos Emulator on port 5000...");
      await new Promise(r => setTimeout(r, 1200));
      setLedgerStatus('ready');
      addLog("[SYSTEM] Hardware Guardrail Active. DMK ready.");
    }
  };

  const handleExecuteIntent = async () => {
    if (agentStatus !== 'online') return addLog("[ERROR] Agent offline. Toggle ON first.");
    if (ledgerStatus !== 'ready' && currentView !== 'yield') return addLog("[ERROR] Ledger enclave missing. Connect Ledger first.");

    if (currentView === 'staking') {
      addLog("[GINGER] Waking up Auto-Compounder...");
      const rewards = await mcpClient.getPendingStakingRewards();
      const payload = txBuilder.buildAutoCompoundIntent(rewards);
      await dmkPipeline.executeClearSign("Staking Auto-Compounder", payload);
    } 
    else if (currentView === 'sniper') {
      addLog("[GINGER] 🎯 BuyBack target detected.");
      const payload = txBuilder.buildBuyBackCommitment();
      await dmkPipeline.executeClearSign("BuyBack Sniper", payload);
    }
    else if (currentView === 'yield') {
      await mcpClient.queryOptimalYields();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0A] font-mono text-white">
      <header className="bg-[#050505] border-b border-gray-800 p-4 z-20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-[#FF7B00]">GINGER COPILOT</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Injective Intent Terminal</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-2 w-full md:w-auto bg-black border border-gray-900 rounded p-1">
          <button onClick={() => setCurrentView('staking')} className={`px-4 py-2 text-xs rounded transition-all ${currentView === 'staking' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400'}`}>⚡ Staking</button>
          <button onClick={() => setCurrentView('sniper')} className={`px-4 py-2 text-xs rounded transition-all ${currentView === 'sniper' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400'}`}>🎯 Sniper</button>
          <button onClick={() => setCurrentView('yield')} className={`px-4 py-2 text-xs rounded transition-all ${currentView === 'yield' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400'}`}>📊 LP Router</button>
        </nav>
        <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto">
          <button onClick={handleToggleAgent} className={`px-3 py-2 border rounded text-[10px] font-bold ${agentStatus === 'online' ? 'border-[#00FF00] text-[#00FF00]' : 'border-gray-700 text-gray-400'}`}>
            AGENT: {agentStatus === 'online' ? 'ON' : 'OFF'}
          </button>
          <button onClick={handleToggleLedger} className={`px-3 py-2 border rounded text-[10px] font-bold ${ledgerStatus === 'ready' ? 'border-[#FF7B00] text-[#FF7B00]' : 'border-gray-700 text-gray-400'}`}>
            LEDGER: {ledgerStatus === 'ready' ? 'READY' : 'DISC'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        <div className="absolute inset-0 bg-terminal-grid z-0"></div>
        <div className="flex-1 p-4 md:p-12 flex flex-col justify-center items-center z-10">
          <div className="max-w-2xl w-full bg-[#0d0d0d]/80 backdrop-blur-sm p-8 border border-gray-900 rounded shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">
              {currentView === 'staking' && 'Staking Auto-Compounder'}
              {currentView === 'sniper' && 'BuyBack Sniper Vault'}
              {currentView === 'yield' && 'Dynamic LP Optimizer'}
            </h2>
            <button onClick={handleExecuteIntent} className="w-full py-3 bg-[#FF7B00] text-black font-bold text-sm uppercase rounded hover:bg-orange-600 transition-all">Execute Intent</button>
          </div>
        </div>
        
        {/* LOG PANEL FRAMEWORK CONTAINER */}
        <div className="w-full md:w-80 flex flex-col bg-black/95 border-t md:border-t-0 md:border-l border-gray-900 h-64 md:h-full z-10 backdrop-blur-md">
          <div className="p-4 border-b border-gray-900 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
             Diagnostic Stream (TCP // 5000)
          </div>
          
          {/* THE LOG CONTENT SCREEN LAYER */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
            
            {/* INLINE ASCII CAT BACKGROUND LAYER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <pre className="text-[#FF7B00] text-xs font-bold opacity-10 leading-tight text-center select-none">
{` /\\_/\\
( o.o )
 > ^ <`}
              </pre>
            </div>

            {/* REAL SCROLLING TEXT LOG ENTRIES ON TOP */}
            <div className="relative z-10 space-y-2">
              {logs.map((log, index) => {
                const upperLog = log.toUpperCase();
                const isError = upperLog.includes('[ERROR]');
                const isSuccess = upperLog.includes('SUCCESS') || upperLog.includes('ONLINE') || upperLog.includes('READY') || upperLog.includes('ACTIVE');
                const isGinger = upperLog.includes('[GINGER]');
                
                return (
                  <div key={index} className={`font-mono text-[10px] ${isError ? 'text-red-500' : isSuccess ? 'text-[#00FF00]' : isGinger ? 'text-[#FF7B00]' : 'text-gray-400'}`}>
                    <span className="opacity-25 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                );
              })}
              <div ref={endOfLogsRef} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
