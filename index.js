const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const express = require('express')
const axios = require('axios')
const app = express()
const dotenv = require('dotenv')


// Configuring environment variables
dotenv.config({path: './config/.env'})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    let output = `👋 What up? *Actively* will find you a random activity when you are bored. Just send a /random command to get another activity.
Get more commands here - /help`

    ctx.reply(output, Extra.markdown())
})

bot.command('random', (ctx) => {
    axios.get('https://www.boredapi.com/api/activity')
            .then(res => {
                let data = res.data;
                ctx.reply(data.activity);
            })
})

const types = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

for (let type of types) {
    bot.command(type, (ctx) => {
        return axios.get(`https://www.boredapi.com/api/activity?type=${type}`)
            .then(res => {
                let data = res.data
                ctx.reply(data.activity)
            })
    })
}

bot.help((ctx) => {
    let output = `😎 *Actively* will find you an activity when you are bored. Just send a /random command to get another activity.

You can also find activities by their types.
*/education* - Educational activity
*/recreational* - Recreational activity
*/social* - Social activity
*/diy* - "Do It Yourself" activity
*/charity* - To make world better
*/cooking* - Cooking activity 
*/relaxation* - Relaxation activity
*/music* - Musical activity
*/busywork* - Busywork activity

_Source: bit.ly/3kaAK8I
Creator: @snvk3_`

    ctx.reply(output, Extra.markdown())
})


if (process.env.NODE_ENV === 'development') {
    bot.launch()
} else {
    // Setting up Webhook
    let URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=activelybot.herokuapp.com/${process.env.BOT_TOKEN}`
    bot.telegram.setWebhook(`${URL}`)
    app.get('/', (req, res) => res.send('Hello'))
    app.use(bot.webhookCallback(`/${process.env.BOT_TOKEN}`))

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    });
}
