const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = []
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
        const mess = await this.sendText("User typing...")
        const ans = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.editText(mess, ans)
    }

    async date(msg){
        this.mode = "date"
        const text = this.loadMessage("date")
        await this.sendImage("date")
        await this.sendTextButtons(text, {
            "date_grande":"Арианда",
            "date_robbie":"Робби",
            "date_zendaya":"Зендея",
            "date_gosling":"РАян Гослинг",
            "date_hardy":"Том Харди"
        })
    }
    async dateButton(callBackQuery){
        const query = callBackQuery.data;
        await this.sendImage(query)
        await this.sendText("Nice choise")
        const prompt = this.loadPrompt(query)
        chatgpt.setPrompt(prompt);
    }

    async dateDialog(msg){
        const text = msg.text;
        const mess = await this.sendText("User typing...")
        const ans = await chatgpt.addMessage(text)
        await this.editText(mess, ans)
        //await this.sendText(ans)
    }
    async message(msg){
        this.mode = "message"
        const text = this.loadMessage("message")
        await this.sendImage("message")
        await this.sendTextButtons(text, {
            "message_next":"Следущее сообщение",
            "message_date":"Пригалсить на свидание"
            }
        )
    }
    async messageButton(callbackQuery){
        const query = callbackQuery.data;
        const prompt = this.loadPrompt(query)
        const userChatHist = this.list.join("\n\n")
        const mess = await this.sendText("User typing...")
        const answer = await chatgpt.sendQuestion(prompt, userChatHist);
        await this.editText(mess, answer);
    }
    async messageDialog(msg){
        const text = msg.text;
        this.list.push(text);
    }

    async hello(msg){
        if(this.mode === "gpt"){
            await this.gptDialog(msg);
        }
        else if(this.mode === "date"){
            await this.dateDialog(msg);
        }
        else if(this.mode === "message"){
            await this.messageDialog(msg);
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
bot.onCommand(/\/date/, bot.date)
bot.onCommand(/\/message/, bot.message)

bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/, bot.dateButton)
bot.onButtonCallback(/^message_.*/, bot.messageButton)
bot.onButtonCallback(/^.*/,bot.helloButton)