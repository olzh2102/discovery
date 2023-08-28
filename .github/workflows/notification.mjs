import 'dotenv/config'
import telegram from 'node-telegram-bot-api'

const bot = new telegram(process.env.TG_TOKEN)

bot.sendMessage(
  process.env.TG_CHAT_ID,
  process.env.LINK
)
