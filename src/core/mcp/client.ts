export class InjectiveMCPClient {
  private addLog: (msg: string) => void;

  constructor(logger: (msg: string) => void) {
    this.addLog = logger;
  }

  async getPendingStakingRewards(): Promise<number> {
    this.addLog("[GINGER] Querying Injective MCP Server for pending INJ rewards...");
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockYield = 14.5;
    this.addLog(`[GINGER] Found ${mockYield} INJ in pending rewards.`);
    return mockYield;
  }

  async queryOptimalYields(): Promise<void> {
    this.addLog("[GINGER] Querying Injective MCP Server for live yields...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.addLog("[GINGER] Mito Vault INJ/USDT: 12.4% APY");
    this.addLog("[GINGER] Neptune Lending INJ: 8.2% APY");
    this.addLog("[GINGER] Suggestion: Route liquidity to Mito Vault for optimal yield.");
  }
}
