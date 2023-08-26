import 'dotenv/config'
import telegram from 'node-telegram-bot-api'

const bot = new telegram(process.env.TG_TOKEN)

const getTip = () => 'анжуманя'

const main = async () => {
  const tip = getTip()
  const message = await bot.sendMessage(process.env.TG_CHAT_ID, tip)
  console.log(message)
}

main()
