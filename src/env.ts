import { z } from "zod";

const EnvironmentSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(10),
  TELEGRAM_CHAT_ID: z.string().min(1),
  RPC_URL: z.url(),
  VALIDATOR_ACCOUNT_ID: z.string(),
});

const parsed = await EnvironmentSchema.safeParseAsync(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(` - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvironmentSchema> {}
  }
}
