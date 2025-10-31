import { z } from "zod";

import { NearRpcClient } from "@near-js/jsonrpc-client/no-validation";
import {
  block,
  viewAccount,
  viewFunctionAsJson,
} from "@near-js/jsonrpc-client";

const client = new NearRpcClient({
  endpoint: process.env.RPC_URL,
});

const AccountSchema = z.object({
  amount: z.coerce.bigint(),
  codeHash: z.string(),
  globalContractAccountId: z.string().nullable().optional(),
  globalContractHash: z.string().nullable().optional(),
  locked: z.coerce.bigint(),
  storagePaidAt: z.number().optional(),
  storageUsage: z.coerce.bigint(),
});

export async function getLatestBlockHeight(): Promise<number> {
  const { header } = await block(client, {
    finality: "final",
  });

  return header.height;
}

export async function getAccountAtBlock(
  blockHeight: number
): Promise<z.infer<typeof AccountSchema>> {
  const data = await viewAccount(client, {
    accountId: process.env.VALIDATOR_ACCOUNT_ID,
    blockId: blockHeight,
  });

  return AccountSchema.parseAsync(data);
}

const StakerSchema = z.object({
  account_id: z.string(),
  unstaked_balance: z.coerce.bigint(),
  staked_balance: z.coerce.bigint(),
  can_withdraw: z.boolean(),
});

export async function getStakersAtBlock(
  blockHeight: number
): Promise<Array<z.infer<typeof StakerSchema>>> {
  const accounts = await viewFunctionAsJson(client, {
    accountId: process.env.VALIDATOR_ACCOUNT_ID,
    methodName: "get_accounts",
    argsBase64: Buffer.from(
      JSON.stringify({ from_index: 0, limit: 1_000 })
    ).toBase64(),
    blockId: blockHeight,
  });

  const validatedAccounts = await z.array(StakerSchema).parseAsync(accounts);

  // cut out zero balances
  return validatedAccounts.filter((account) => account.staked_balance > 0n);
}
