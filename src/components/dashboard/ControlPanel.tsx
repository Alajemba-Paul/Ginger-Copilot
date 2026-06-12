import React from 'react';
import { InjectiveMCPClient } from '@/core/mcp/client';
import { TxBuilder } from '@/core/injective/tx-builder';
import { LedgerDMKPipeline } from '@/core/ledger/dmk-pipeline';

interface ControlPanelProps {
  addLog: (msg: string) => void;
}

export default function ControlPanel({ addLog }: ControlPanelProps) {
  const mcpClient = new InjectiveMCPClient(addLog);
  const txBuilder = new TxBuilder(addLog);
  const dmkPipeline = new LedgerDMKPipeline(addLog);

  const runAutoCompounder = async () => {
    addLog("[GINGER] Meow! Waking up Auto-Compounder...");
    const rewards = await mcpClient.getPendingStakingRewards();
    const payload = txBuilder.buildAutoCompoundIntent(rewards);
    await dmkPipeline.executeClearSign("Staking Auto-Compounder", payload);
  };

  const simulateBuyBack = async () => {
    addLog("[GINGER] 🎯 BuyBack Open detected. Pouncing!");
    const payload = txBuilder.buildBuyBackCommitment();
    await dmkPipeline.executeClearSign("BuyBack Sniper Commitment", payload);
  };

  const checkLPRouting = async () => {
    await mcpClient.queryOptimalYields();
  };

  return (
    <div className="w-1/3 p-6 border-r border-gray-800 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-[#FF7B00]">GINGER COPILOT</h1>
        <p className="text-sm text-gray-400 mb-8">Agentic Intent-Solver for Injective.</p>
        
        <div className="space-y-4">
          <button 
            onClick={runAutoCompounder}
            className="w-full p-4 border border-[#FF7B00] text-[#FF7B00] hover:bg-[#FF7B00] hover:text-[#0A0A0A] transition-all rounded text-left font-bold"
          >
            [ ⚡ Run Staking Auto-Compounder ]
          </button>
          
          <button 
            onClick={simulateBuyBack}
            className="w-full p-4 border border-[#FF7B00] text-[#FF7B00] hover:bg-[#FF7B00] hover:text-[#0A0A0A] transition-all rounded text-left font-bold"
          >
            [ 🎯 Activate BuyBack Sniper (Sim) ]
          </button>

          <button 
            onClick={checkLPRouting}
            className="w-full p-4 border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all rounded text-left"
          >
            [ 📊 Check LP Routing ]
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        <p>Hardware Guardrail: Active</p>
        <p>Speculos Target: localhost:5000</p>
      </div>
    </div>
  );
}
