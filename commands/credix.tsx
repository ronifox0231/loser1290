import Zeyah, { Bold, Italic, type PropsWithInfo, ZeyahJSX } from "@kayelaa/zeyah";
import { Menu } from "@zeyah-bot/menu";
import { UserDB, usersDB } from "@zeyah-bot/database";
import {
  Breaks,
  Choice,
  DecimalNode,
  Divider,
  Random,
  ResIDontKnow,
} from "@zeyah-bot/components";
import { Decimal } from "decimal.js";

import type { ZeyahCMDCTX } from "@zeyah-bot/types";
import { parseBetDecimal } from "@zeyah-utils";

export const CredixMenu = new Menu();

export const CredixCommand = module.register({
  emoji: "💎",
  name: "credix",
  version: "2.0.0",
  author: "@lianecagara",
  description: "Credix financial intelligence dashboard.",
  pluginNames: [],
  aliases: ["bank", "crdix", "cdx", "b"],
  onCommand: CredixMenu,
});

export const CredixDesign: Zeyah.FC<PropsWithInfo> = ({ childrenString }) => {
  return (
    <>
      <Bold>
        <Random>
          <Choice>💠 Credix Platform</Choice>
          <Choice>📊 Credix Dashboard</Choice>
          <Choice>🏦 Credix Financial Center</Choice>
          <Choice>🪙 Credix Economy Engine</Choice>
          <Choice>🔷 Credix Workspace</Choice>
          <Choice>✨ Credix Terminal</Choice>
          <Choice>📈 Credix Analytics</Choice>
          <Choice>💰 Credix Wallet System</Choice>
          <Choice>🔐 Credix Vault</Choice>
          <Choice>⚡ Credix Core</Choice>
          <Choice>🧠 Credix Intelligence</Choice>
          <Choice>🌐 Credix Network</Choice>
          <Choice>📑 Credix Ledger</Choice>
          <Choice>🏛️ Credix Control Panel</Choice>
          <Choice>💎 Credix Premium Interface</Choice>
          <Choice>🚀 Credix Operations</Choice>
          <Choice>📦 Credix Assets</Choice>
          <Choice>📁 Credix Portfolio</Choice>
          <Choice>🧾 Credix Records</Choice>
        </Random>
      </Bold>
      <Divider break />
      {childrenString}
    </>
  );
};

CredixMenu.ShowMenuComponent = CredixDesign;

CredixMenu.option({
  subcommand: "overview",
  description: "Account summary dashboard",
  emoji: "📊",
  aliases: ["o"],
  async handler({ userDB, zeyahIO, ctx }, {}) {
    const credix = await Credix.loadCredix(userDB);
    const guard = requireCredixRegistered(credix, ctx);
    if (guard) {
      await zeyahIO.reply(guard);
      return;
    }

    await zeyahIO.reply(
      <>
        <CredixDesign>
          <Italic>📊 Account Overview</Italic>
          <Breaks n={1} />
          Name: {credix.bankName || "Unnamed"}
          <Breaks n={1} />
          Reserves: <DecimalNode n={credix.bankBalance} />
        </CredixDesign>
      </>,
    );
  },
});

CredixMenu.option({
  subcommand: "reserves",
  description: "Show credix reserves",
  emoji: "💰",
  aliases: ["check", "c"],
  async handler({ userDB, zeyahIO, ctx }, {}) {
    const credix = await Credix.loadCredix(userDB);
    const guard = requireCredixRegistered(credix, ctx);
    if (guard) {
      await zeyahIO.reply(guard);
      return;
    }
    const points = await userDB.getPoints();

    await zeyahIO.reply(
      <CredixDesign>
        <Italic>💰 Credix Reserves</Italic>
        <Breaks n={1} />
        <DecimalNode n={credix.bankBalance} />
        <br />
        <Italic>🎯 Local Points</Italic>
        <Breaks n={1} />
        <DecimalNode n={points} />
      </CredixDesign>,
    );
  },
});

CredixMenu.option({
  subcommand: "profile",
  description: "User profile info",
  emoji: "👤",
  args: ["[name]"],
  aliases: ["p"],
  async handler({ zeyahIO, userDB, event, ctx }, { args }) {
    let credix: Credix = null;
    let id: string;
    const otherName = args[0] ?? null;
    if (otherName) {
      const r = await Credix.findOneByName(otherName);
      if (r) {
        credix = r.credix;
        id = r.id;
      } else {
        await zeyahIO.reply(
          <CredixDesign>
            <ResIDontKnow />
          </CredixDesign>,
        );
        return;
      }
    } else {
      id = event.senderID;
      credix = await Credix.loadCredix(userDB);
      const guard = requireCredixRegistered(credix, ctx);
      if (guard) {
        await zeyahIO.reply(guard);
        return;
      }
    }

    await zeyahIO.reply(
      <CredixDesign>
        <Bold>👤 Credix Profile</Bold>
        <Breaks n={1} />
        <Italic>User ID:</Italic> {id}
        <Breaks n={1} />
        <Italic>Label:</Italic> {credix.bankName || "Not Set"}
        <Breaks n={1} />
        <Italic>Reserves:</Italic> <DecimalNode n={credix.bankBalance} />
      </CredixDesign>,
    );
  },
});

CredixMenu.option({
  subcommand: "register",
  description: "Register Credix financial account",
  emoji: "🪪",
  aliases: ["r"],
  async handler({ userDB, zeyahIO, event }, { args }) {
    const bankName = args[0]?.trim();

    if (!bankName) {
      await zeyahIO.reply(
        <CredixDesign>❌ Please provide name/label.</CredixDesign>,
      );
      return;
    }

    if (bankName.length > 32) {
      await zeyahIO.reply(
        <CredixDesign>❌ Name name too long (max 32).</CredixDesign>,
      );
      return;
    }
    const existing = await Credix.findOneByName(bankName);
    if (existing) {
      await zeyahIO.reply(
        <CredixDesign>
          ⚠️ An account has been already registered with the same label, try a
          different name.
        </CredixDesign>,
      );
      return;
    }

    const credix = await Credix.loadCredix(userDB);

    if (credix.bankName) {
      await zeyahIO.reply(
        <CredixDesign>⚠️ Account already registered.</CredixDesign>,
      );
      return;
    }

    credix.bankName = bankName;
    await Credix.saveCredix(userDB, credix);

    await zeyahIO.reply(
      <CredixDesign>
        ✅ Credix account registered
        <Breaks n={1} />
        Account Name: {bankName}
      </CredixDesign>,
    );
  },
});

CredixMenu.option({
  subcommand: "rename",
  description: "Rename Credix Label",
  emoji: "✏️",
  aliases: ["rn"],
  args: ["<new_name>"],
  async handler({ userDB, zeyahIO }, { args }) {
    const newName = args[0]?.trim();

    if (!newName) {
      await zeyahIO.reply(
        <CredixDesign>❌ Please provide a name/label.</CredixDesign>,
      );
      return;
    }

    if (newName.length > 32) {
      await zeyahIO.reply(
        <CredixDesign>❌ Name too long (max 32).</CredixDesign>,
      );
      return;
    }

    const existing = await Credix.findOneByName(newName);
    if (existing) {
      await zeyahIO.reply(
        <CredixDesign>
          ⚠️ An account has been already registered with the same label, try a
          different name.
        </CredixDesign>,
      );
      return;
    }

    const credix = await Credix.loadCredix(userDB);

    credix.bankName = newName;
    await Credix.saveCredix(userDB, credix);

    await zeyahIO.reply(
      <CredixDesign>
        ✅ Credix Account renamed
        <Breaks n={1} />
        New Name: {newName}
      </CredixDesign>,
    );
  },
});

export function requireCredixRegistered(
  credix: Credix,
  { currentPrefix, commandName }: ZeyahCMDCTX,
): ZeyahJSX.Element | void {
  if (!credix.bankName) {
    return (
      <CredixDesign>
        ❌ You are not registered in Credix system.
        <Breaks n={1} />
        Use{" "}
        <Bold>
          {currentPrefix}
          {commandName} register
        </Bold>{" "}
        <Italic>{"<bank_name>"}</Italic>
      </CredixDesign>
    );
  }
}

CredixMenu.option({
  subcommand: "deposit",
  description: "Deposit wallet points into reserves.",
  emoji: "📥",
  args: ["<amount>"],
  aliases: ["d", "in"],
  async handler({ userDB, zeyahIO, ctx }, { args }) {
    const credix = await Credix.loadCredix(userDB);
    const guard = requireCredixRegistered(credix, ctx);
    if (guard) {
      await zeyahIO.reply(guard);
      return;
    }
    const wallet = await userDB.getPoints();

    const input = args[0];
    if (!input) {
      await zeyahIO.reply(<CredixDesign>❌ Provide amount.</CredixDesign>);
      return;
    }

    let amount: Decimal;
    try {
      amount = parseBetDecimal(input, wallet);
      if (amount.isNaN()) throw "wtf";
    } catch {
      await zeyahIO.reply(<CredixDesign>❌ Invalid number.</CredixDesign>);
      return;
    }

    if (amount.lte(0)) {
      await zeyahIO.reply(
        <CredixDesign>❌ Amount must be positive.</CredixDesign>,
      );
      return;
    }

    if (wallet.lt(amount)) {
      await zeyahIO.reply(
        <CredixDesign>❌ Not enough wallet points.</CredixDesign>,
      );
      return;
    }

    const newWallet = wallet.minus(amount);
    const newBank = credix.bankBalance.plus(amount);

    await userDB.setPoints(newWallet);
    credix.bankBalance = newBank;
    await Credix.saveCredix(userDB, credix);

    await zeyahIO.reply(
      <CredixDesign>
        ✅ Deposited <DecimalNode n={amount} />
        <Breaks n={1} />
        New Reserves: <DecimalNode n={newBank} />
      </CredixDesign>,
    );
  },
});

CredixMenu.option({
  subcommand: "withdraw",
  description: "Withdraw reserved points into wallet",
  emoji: "📤",
  args: ["<amount>"],
  aliases: ["w", "out"],
  async handler({ userDB, zeyahIO, ctx }, { args }) {
    const credix = await Credix.loadCredix(userDB);
    const guard = requireCredixRegistered(credix, ctx);
    if (guard) {
      await zeyahIO.reply(guard);
      return;
    }

    const input = args[0];
    if (!input) {
      await zeyahIO.reply(<CredixDesign>❌ Provide amount.</CredixDesign>);
      return;
    }

    let amount: Decimal;
    try {
      amount = parseBetDecimal(input, credix.bankBalance);
      if (amount.isNaN()) throw "wtf";
    } catch {
      await zeyahIO.reply(<CredixDesign>❌ Invalid number.</CredixDesign>);
      return;
    }

    if (amount.lte(0)) {
      await zeyahIO.reply(
        <CredixDesign>❌ Amount must be positive.</CredixDesign>,
      );
      return;
    }

    if (credix.bankBalance.lt(amount)) {
      await zeyahIO.reply(
        <CredixDesign>❌ Not enough reserves..</CredixDesign>,
      );
      return;
    }

    const wallet = await userDB.getPoints();

    const newWallet = wallet.plus(amount);
    const newBank = credix.bankBalance.minus(amount);

    await userDB.setPoints(newWallet);
    credix.bankBalance = newBank;
    await Credix.saveCredix(userDB, credix);

    await zeyahIO.reply(
      <CredixDesign>
        ✅ Withdrawn <DecimalNode n={amount} />
        <Breaks n={1} />
        New Reserves: <DecimalNode n={newBank} />
      </CredixDesign>,
    );
  },
});

CredixMenu.option({
  subcommand: "transfer",
  description: "Transfer reserves to another Credix account",
  emoji: "🔁",
  args: ['<bankname | "<bankname>">', "<amount>"],
  aliases: ["send", "t"],
  async handler({ userDB, zeyahIO, ctx }, { args }) {
    const senderCredix = await Credix.loadCredix(userDB);
    const guard = requireCredixRegistered(senderCredix, ctx);
    if (guard) {
      await zeyahIO.reply(guard);
      return;
    }

    const targetName = args[0]?.trim();
    const input = args[1];

    if (!targetName) {
      await zeyahIO.reply(
        <CredixDesign>❌ Provide target bank name.</CredixDesign>,
      );
      return;
    }

    if (!input) {
      await zeyahIO.reply(<CredixDesign>❌ Provide amount.</CredixDesign>);
      return;
    }

    const target = await Credix.findOneByName(targetName);
    if (!target) {
      await zeyahIO.reply(
        <CredixDesign>❌ Target account not found.</CredixDesign>,
      );
      return;
    }

    if (target.user.key === userDB.key) {
      await zeyahIO.reply(
        <CredixDesign>❌ You cannot transfer to yourself.</CredixDesign>,
      );
      return;
    }

    let amount: Decimal;
    try {
      amount = parseBetDecimal(input, senderCredix.bankBalance);
      if (amount.isNaN()) throw "nope";
    } catch {
      await zeyahIO.reply(<CredixDesign>❌ Invalid number.</CredixDesign>);
      return;
    }

    if (amount.lte(0)) {
      await zeyahIO.reply(
        <CredixDesign>❌ Amount must be positive.</CredixDesign>,
      );
      return;
    }

    if (senderCredix.bankBalance.lt(amount)) {
      await zeyahIO.reply(<CredixDesign>❌ Not enough reserves.</CredixDesign>);
      return;
    }

    const receiverCredix = target.credix;

    senderCredix.bankBalance = senderCredix.bankBalance.minus(amount);

    receiverCredix.bankBalance = receiverCredix.bankBalance.plus(amount);

    await Credix.saveCredix(userDB, senderCredix);
    await Credix.saveCredix(target.user, receiverCredix);

    await zeyahIO.reply(
      <CredixDesign>
        ✅ Transferred <DecimalNode n={amount} /> to{" "}
        <Bold>{receiverCredix.bankName}</Bold>
        <Breaks n={1} />
        New Reserves: <DecimalNode n={senderCredix.bankBalance} />
      </CredixDesign>,
    );
  },
});

declare global {
  interface GlobalUserDBProps {
    credix: Credix.RawCredixData;
  }
}
export namespace Credix {
  export interface CredixData {
    bankName: string;
    bankBalance: Decimal;
  }

  export interface RawCredixData {
    bal: string;
    n: string;
  }

  export function fromRaw(raw: RawCredixData): Credix {
    return {
      bankBalance: Decimal(raw.bal || "0"),
      bankName: String(raw.n ?? ""),
    };
  }

  export function toRaw(data: Credix): RawCredixData {
    return {
      bal: data.bankBalance.toString(),
      n: data.bankName,
    };
  }

  export async function saveCredix(userDB: UserDB, credix: Credix) {
    const raw = Credix.toRaw(credix);
    await userDB.set("credix", raw);
  }
  export async function loadCredix(userDB: UserDB): Promise<Credix> {
    const raw = (await userDB.get("credix")) ?? { bal: "0", n: "" };
    return Credix.fromRaw(raw);
  }
  export interface CredixAll {
    user: UserDB;
    credix: Credix;
    id: string;
  }
  export async function loadAllCredix(): Promise<Map<string, CredixAll>> {
    const all = await usersDB.getAllUsers();
    const anotherMap = new Map<string, CredixAll>();
    for (const [uid, user] of all) {
      const credix = await loadCredix(user);
      anotherMap.set(uid, {
        credix,
        user,
        id: uid,
      });
    }
    return anotherMap;
  }
  export async function findOneByName(
    name: string,
    allCredix?: Map<string, CredixAll>,
  ): Promise<CredixAll | null> {
    const result = allCredix ?? (await loadAllCredix());
    return (
      Array.from(result.values()).find((i) => i.credix?.bankName === name) ??
      null
    );
  }
}
export interface Credix extends Credix.CredixData {}
