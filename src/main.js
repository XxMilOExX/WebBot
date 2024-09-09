const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }
    async start(msg){
        this.mode = "main"
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text)

            //add menu
        this.showMainMenu({
            "start":"Start",
            "profile":"генерация Tinder-профиля",
            "opener":"сообщение для знакомства",
            "message":"переписка от вашего имени",
            "date":"переписка со звездами",
            "gpt":"Talk with AI",
            "html":"HTML demonstration"
        })
    }
    async html(msg){
        await this.sendHTML('<h3 style = "color: #1558b0"> Hello</h3>')
        const html = this.loadMessage("main")
        await this.sendHTML(html,{theme: "dark"})
    }
    async gpt (msg){
        this.mode = "gpt"
        const text = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(text)

    }
    async gptDialog(msg){
        const text = msg.text;
        const ans = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.sendText(ans)
    }

    async hello(msg){
        if(this.mode === "gpt"){
            await this.gptDialog(msg);
        }
        else {
            const text = msg.text;
            await this.sendText("<b>Hello!</b>");
            await this.sendText("<i>How are you?</i>");
            await this.sendText(`you type: ${text}`);

            await this.sendImage("avatar_main");
            await this.sendTextButtons("what is your telegram back",
                {
                    "theme_light": "White",
                    "theme_dark": "Dark",
                })
        }
    }
    async helloButton(callBackQuery){
        const query = callBackQuery.data;
        if(query === "theme_light")
        await this.sendText("You have a light theme!");
        else if(query === "theme_dark"){
            await this.sendText("You have a dark theme!");
        }
    }
}
const chatgpt = new ChatGptService("gpt:9p4dgMGH8xaays5cTFbEJFkblB3TGdVvUMGZg2yosnt0BhOs");
const bot = new MyTelegramBot("7256586247:AAE8FxZcL27LQyf8N6sbyqJDdHPhGsA6nI4");

bot.onCommand(/\/start/, bot.start)
bot.onCommand(/\/html/, bot.html)
bot.onCommand(/\/gpt/, bot.gpt)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/,bot.helloButton)