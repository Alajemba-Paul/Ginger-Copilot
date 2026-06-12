import React, { useEffect, useRef } from 'react';

interface TerminalLogProps {
  logs: string[];
}

export default function TerminalLog({ logs }: TerminalLogProps) {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-2/3 p-6 flex flex-col">
      <h2 className="text-sm text-gray-500 mb-4 uppercase tracking-widest border-b border-gray-800 pb-2">
        Ginger Activity Log
      </h2>
      
      <div className="flex-1 overflow-y-auto bg-black p-4 rounded border border-gray-800 shadow-inner">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`mb-2 ${log.includes('[REJECTED]') ? 'text-red-500' : 'text-[#00FF00]'}`}
          >
            <span className="opacity-50 text-xs mr-2">{new Date().toLocaleTimeString()}</span>
            {log}
          </div>
        ))}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
}
