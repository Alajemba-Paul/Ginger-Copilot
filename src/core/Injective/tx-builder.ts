export class TxBuilder {
  private addLog: (msg: string) => void;

  constructor(logger: (msg: string) => void) {
    this.addLog = logger;
  }

  buildAutoCompoundIntent(amount: number) {
    this.addLog("[GINGER] Constructing multi-message intent:");
    this.addLog("  -> MsgWithdrawDelegatorReward");
    this.addLog(`  -> MsgDelegate (${amount} INJ)`);
    
    return {
      type: "auto_compound",
      messages: ["MsgWithdrawDelegatorReward", "MsgDelegate"],
      amount
    };
  }

  buildBuyBackCommitment() {
    this.addLog("[GINGER] Constructing 50 INJ commitment payload to secure slot...");
    return {
      type: "buyback_commit",
      messages: ["MsgExecuteContract"],
      amount: 50
    };
  }
}
