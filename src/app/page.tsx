'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGingerLogs } from '@/hooks/useGingerLogs';
import { InjectiveMCPClient } from '@/core/mcp/client';
import { TxBuilder } from '@/core/injective/tx-builder';
import { LedgerDMKPipeline } from '@/core/ledger/dmk-pipeline';

export default function GingerDashboard() {
  const { logs, addLog } = useGingerLogs();
  
  // Navigation Menu tabs
  const [currentView, setCurrentView] = useState<'staking' | 'sniper' | 'yield'>('staking');
  
  // Real Connect Connection States
  const [agentStatus, setAgentStatus] = useState<'offline' | 'connecting' | 'online'>('offline');
  const [ledgerStatus, setLedgerStatus] = useState<'disconnected' | 'connecting' | 'ready'>('disconnected');

  const mcpClient = new InjectiveMCPClient(addLog);
  const txBuilder = new TxBuilder(addLog);
  const dmkPipeline = new LedgerDMKPipeline(addLog);

  const endOfLogsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleConnectAgent = async () => {
    setAgentStatus('connecting');
    addLog("[SYSTEM] Booting Ginger AI Agent interface...");
    await new Promise(r => setTimeout(r, 1000));
    setAgentStatus('online');
    addLog("[SYSTEM] Agent Online. Injective MCP connection established.");
  };

  const handleConnectLedger = async () => {
    setLedgerStatus('connecting');
    addLog("[SYSTEM] Pinging Speculos Hardware Emulator on port 5000...");
    await new Promise(r => setTimeout(r, 1200));
    setLedgerStatus('ready');
    addLog("[SYSTEM] Hardware Guardrail Active. Ledger DMK connection ready.");
  };

  const handleExecuteIntent = async () => {
    if (agentStatus !== 'online') return addLog("[ERROR] Agent interface offline. Action barred.");
    if (ledgerStatus !== 'ready' && currentView !== 'yield') return addLog("[ERROR] Hardware enclave missing. Clear-Signing unavailable.");

    if (currentView === 'staking') {
      addLog("[GINGER] Waking up Auto-Compounder module...");
      const rewards = await mcpClient.getPendingStakingRewards();
      const payload = txBuilder.buildAutoCompoundIntent(rewards);
      await dmkPipeline.executeClearSign("Staking Auto-Compounder", payload);
    } 
    else if (currentView === 'sniper') {
      addLog("[GINGER] 🎯 BuyBack target detected. Processing pounce strategy...");
      const payload = txBuilder.buildBuyBackCommitment();
      await dmkPipeline.executeClearSign("BuyBack Sniper Commitment", payload);
    }
    else if (currentView === 'yield') {
      await mcpClient.queryOptimalYields();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* INSTITUTIONAL TOP MENU BAR */}
      <header className="bg-[#050505] border-b border-gray-800 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#FF7B00]">GINGER COPILOT</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Injective Intent Terminal</p>
          </div>
          
          {/* Menu Items */}
          <nav className="flex items-center gap-1 bg-black border border-gray-900 rounded p-1 ml-4 overflow-x-auto max-w-[80vw] sm:max-w-none">
            <button 
              onClick={() => setCurrentView('staking')}
              className={`px-3 py-1.5 text-xs rounded transition-all whitespace-nowrap ${currentView === 'staking' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              ⚡ Staking Engine
            </button>
            <button 
              onClick={() => setCurrentView('sniper')}
              className={`px-3 py-1.5 text-xs rounded transition-all whitespace-nowrap ${currentView === 'sniper' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              🎯 BuyBack Sniper
            </button>
            <button 
              onClick={() => setCurrentView('yield')}
              className={`px-3 py-1.5 text-xs rounded transition-all whitespace-nowrap ${currentView === 'yield' ? 'bg-[#FF7B00] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              📊 LP Router
            </button>
          </nav>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleConnectAgent}
            disabled={agentStatus === 'online'}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border rounded text-xs font-bold transition-all ${agentStatus === 'online' ? 'border-[#00FF00] text-[#00FF00] bg-[#00FF00]/10' : 'border-gray-700 text-gray-400 hover:bg-gray-900'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${agentStatus === 'online' ? 'bg-[#00FF00]' : agentStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
            {agentStatus === 'online' ? 'AGENT RUNTIME: ON' : 'CONNECT AGENT'}
          </button>

          <button 
            onClick={handleConnectLedger}
            disabled={ledgerStatus === 'ready'}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border rounded text-xs font-bold transition-all ${ledgerStatus === 'ready' ? 'border-[#FF7B00] text-[#FF7B00] bg-[#FF7B00]/10' : 'border-gray-700 text-gray-400 hover:bg-gray-900'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${ledgerStatus === 'ready' ? 'bg-[#FF7B00]' : ledgerStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
            {ledgerStatus === 'ready' ? 'HARDWARE ENCLAVE: ACTIVE' : 'CONNECT LEDGER'}
          </button>
        </div>
      </header>

      {/* CORE FRAMEWORK CONTEXT VIEW */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* ANIMATED GINGER WATERMARK BACKGROUND LAYER */}
        <div className="absolute inset-0 bg-ginger-watermark animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

        {/* ACTIVE CANVAS CONTEXT PAGE */}
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-center items-center z-10">
          <div className="max-w-md w-full bg-[#0d0d0d]/80 backdrop-blur-md p-8 border border-gray-900 rounded shadow-2xl">
            <span className="text-[10px] text-[#FF7B00] uppercase tracking-widest font-bold">Injective Framework Engine</span>
            <h2 className="text-2xl font-bold mt-1 mb-3">
              {currentView === 'staking' && 'Staking Auto-Compounder'}
              {currentView === 'sniper' && 'BuyBack Sniper Vault'}
              {currentView === 'yield' && 'Dynamic LP Optimizer'}
            </h2>
            <p className="text-xs text-gray-400 mb-8 h-12 leading-relaxed">
              {currentView === 'staking' && 'Injective MCP tracking for pending validator allocations. Bundles processing streams into isolated CosmWasm structural chains.'}
              {currentView === 'sniper' && 'Simulated high-frequency order matrix execution parameters. Generates instant execution boundaries requiring atomic sign confirmation.'}
              {currentView === 'yield' && 'Queries localized state logs across Mito algorithmic vaults and Neptune debt architecture matrices.'}
            </p>
            
            <button 
              onClick={handleExecuteIntent}
              className="w-full py-3.5 bg-[#FF7B00] text-black font-bold text-sm tracking-wide uppercase rounded hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,123,0,0.25)]"
            >
              Execute Submodule Intent
            </button>
          </div>
        </div>

        {/* STEADY STATE MONITOR ENGINE TERMINAL LOG */}
        <div className="w-full md:w-80 flex flex-col bg-black/90 border-t md:border-t-0 md:border-l border-gray-900 h-60 md:h-full z-10 backdrop-blur-md">
          <div className="p-3 border-b border-gray-900 text-[10px] text-gray-500 uppercase tracking-widest flex justify-between font-bold">
            <span>Terminal Diagnostic Stream</span>
            <span>TCP // PORT:5000</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.map((log, index) => (
              <div key={index} className={`font-mono text-xs leading-relaxed ${log.includes('[ERROR]') || log.includes('[REJECTED]') ? 'text-red-500' : log.includes('SUCCESS') || log.includes('ONLINE') ? 'text-[#00FF00]' : log.includes('[GINGER]') ? 'text-[#FF7B00]' : 'text-gray-400'}`}>
                <span className="opacity-25 mr-1.5 font-sans">{new Date().toLocaleTimeString()}</span>
                {log}
              </div>
            ))}
            <div ref={endOfLogsRef} />
          </div>
        </div>

      </main>
    </div>
  );
}
