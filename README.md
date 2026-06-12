```markdown
# Ginger Copilot 🐈⬛

An institutional-grade Agentic Intent-Solver for the Injective Ecosystem, featuring strict hardware-enforced execution via Ledger DMK. Named in honor of Eric Chen's cat.

**Context:** This project was developed as a hackathon/bounty submission, showcasing the secure integration of agentic AI with isolated hardware signing environments on the Injective network.

## 🧠 Core Architecture

Ginger Copilot operates on a strict separation of concerns between intelligence and execution:

1. **The Intelligence Layer (Ginger AI):** Connects to the `injective-mcp-servers` to query live chain state, monitor pending staking rewards, and check DeFi yields. It constructs standard CosmWasm payload messages but holds zero private keys.
   
2. **The Action Layer (Hardware Guardrail):** Utilizes `@ledgerhq/device-management-kit` (DMK) to establish a secure pipeline to a local Speculos hardware emulator. The agent passes the constructed intent to the device, waits for a human to physically review and "Clear-Sign" the transaction, and only broadcasts upon explicit hardware approval.

## ⚡ Features (MVP)

* **Staking Auto-Compounder:** Agent queries pending INJ rewards via MCP and constructs a multi-message intent (`MsgWithdrawDelegatorReward` + `MsgDelegate`) for secure execution.
* **BuyBack Sniper:** A simulated trigger where the agent constructs an instant commitment payload to secure a slot in a simulated BuyBack event.
* **Dynamic LP Routing:** Agent queries live yields across Injective dApps (e.g., Mito Vaults vs. Neptune Lending) to suggest optimal liquidity deployment.

## 🛠️ Quick Start

### Prerequisites
* Node.js (v18+)
* [Ledger Speculos Emulator](https://github.com/LedgerHQ/speculos) running the Cosmos/Injective app.
* Local instance of the Injective MCP Server.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/ginger-copilot.git](https://github.com/yourusername/ginger-copilot.git)
   cd ginger-copilot

```
 2. **Install dependencies:**
   ```bash
   npm install
   
   ```
 3. **Set up environment variables:**
   Copy the example environment file and configure your ports.
   ```bash
   cp .env.example .env
   
   ```
 4. **Run the development server:**
   ```bash
   npm run dev
   
   ```
 5. **Open the Dashboard:**
   Navigate to http://localhost:3000 to interact with the Ginger Copilot terminal.
## 📂 Project Structure
 * /src/app: Next.js 14 App Router configuration and root layout.
 * /src/components: React UI components (Dashboard, Control Panel, Terminal).
 * /src/core/mcp: Injective Model Context Protocol client logic.
 * /src/core/injective: CosmWasm transaction payload builders.
 * /src/core/ledger: The 5-step Ledger Device Management Kit pipeline.
 * /src/hooks: Centralized state management for terminal logs and UI updates.
## 🛡️ Security Note
This application enforces a strict Human-in-the-Loop (HITL) model. The agent runtime is fundamentally incapable of signing transactions on its own. All actions must pass through the Ledger DMK pipeline.
```

```
