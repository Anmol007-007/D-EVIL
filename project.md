# D'EVIL STEAKHOUSE & GRILL — Management & Dining System

### How to Run:

Step 1: Open Terminal / PowerShell in VS Code (or open PowerShell / Command Prompt).

Step 2: Navigate to the project directory:
```powershell
cd "c:\Users\anmol\Documents\Restraunt management Project"
```

Step 3: Start the server:
```powershell
node server.js
```
*(or `npm start`)*

You will see:
```text
D'EVIL Steakhouse & Grill running at http://127.0.0.1:3000
```

Step 4: Open your web browser and navigate to:
👉 **http://localhost:3000** (or **http://127.0.0.1:3000**)

---

### Features Overview:

**Customer Dining View:**
- Filter cuts & feast items by categories (*Primal Steaks & Cuts, Ember Starters, Inferno Woodfire, Charred Ocean, Molten Desserts, Smoked Alchemy & Brews*) or dietary tags.
- Customize cuts with pitmaster preparation notes (*"Medium rare, flamed table-side"*).
- Order directly for Dine-in tables with gratuity calculation or schedule for takeaway/delivery.
- Reserve tables in the Ember Pit Room, Flames & Forge, Hellfire Terrace, Inferno Rooftop, or VIP Warlock Vault.

**Grill & Staff Command Hub:**
- **Floor & Tables:** Live floor map with table status indicators (Available, Occupied, Reserved, Cleaning).
- **Kitchen Display (KDS):** Real-time grill tickets with elapsed order timers and stage advancement (*Pending ➔ Cooking ➔ Ready ➔ Served*).
- **Menu & 86 Editor:** Real-time price updates and 86'd (Sold Out) toggles.
- **Sales & Billing:** Live shift revenue analytics, top-selling cuts leaderboard, and printable guest receipts.
