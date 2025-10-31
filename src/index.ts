// it must be first
import "./env";

import { formatNearAmount } from "@near-js/utils";

import { logger } from "./logger";
import {
  getAccountAtBlock,
  getLatestBlockHeight,
  getStakersAtBlock,
} from "./near";
import { sendTelegramNotification } from "./telegram";
import { average, median } from "./utils";

try {
  const blockHeight = await getLatestBlockHeight();

  const [account, stakers] = await Promise.all([
    getAccountAtBlock(blockHeight),
    getStakersAtBlock(blockHeight),
  ]);

  const totalStake = formatNearAmount(account.locked.toString(), 3);
  const averageStake = formatNearAmount(
    average(stakers.map(({ staked_balance }) => staked_balance)).toString(),
    3
  );
  const medianStake = formatNearAmount(
    median(stakers.map(({ staked_balance }) => staked_balance)).toString(),
    3
  );

  await sendTelegramNotification(
    `📊*Validator Stats Update*

Total staked: \`${totalStake} NEAR\`

Number of stakers: \`${stakers.length}\`
Average stake: \`${averageStake} NEAR\`
Median stake: \`${medianStake} NEAR\`

_The data was queried at block height \`${blockHeight}\`_`
      .trim()
      .replaceAll(".", "\\.")
  );
} catch (error: unknown) {
  logger.error({ error }, `Caught an error`);
  process.exit(1);
}
