
import { z } from "zod";

export const zNerdyFinance_availableStrategies = z.enum(["BITCOIN_ONLY","GOLD_ONLY","BITCOIN_GOLD_VOLA_BALANCED_360","GOLD_CRYPTO_60_40"]);

export type TNerdyFinance_availableStrategies = z.infer<typeof zNerdyFinance_availableStrategies>;
