import { logger } from "./logger";

export async function sendTelegramNotification(text: string): Promise<void> {
  const url = new URL(
    `/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    "https://api.telegram.org"
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
      protect_content: false,
    }),
  });

  if (response.ok) return;

  logger.error(
    {
      response_data: await response.json(),
    },
    `Server returned HTTP ${response.status} code`
  );
  throw new Error(`Couldn't send a Telegram notification`);
}
