const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = []
        this.user = {};
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
        this.list = []
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
    async profile(){
        this.mode = "profile"
        const text = this.loadMessage("profile")
        await this.sendImage("profile")
        await this.sendText(text)
        this.user = {}
        this.count = 0;
        await this.sendText("How old are you?")
    }


    async profileDialog(msg){
        const text = msg.text
        this.count++;

        if(this.count === 1){
            this.user["age"] = text;
            await this.sendText("What is your work")
        }
        if(this.count === 2){
            this.user["work"] = text;
            await this.sendText("What is your hobie")
        }
        if(this.count === 3){
            this.user["occupation"] = text;
            await this.sendText("What is you dont like in people")
        }
        if(this.count === 4){
            this.user["annoys"] = text;
            await this.sendText("What are you want here")
        }
        if(this.count === 5){
            this.user["goals"] = text;
            const prompt = this.loadPrompt("profile")
            const info = userInfoToString(this.user);
            const ans = await chatgpt.sendQuestion(prompt, info);
            await this.sendText(ans)
        }


    }

    async opener(msg){
        this.mode = "opener"
        const text = this.loadMessage("opener")
        await this.sendImage("opener")
        await this.sendText(text)
        this.user = {}
        this.count = 0;
        await this.sendText("What is your partner name?")
    }

    async openerDialog(msg){

        const text = msg.text
        this.count++;

        if(this.count === 1){
            this.user["name"] = text;
            await this.sendText("How is it old")
        }
        if(this.count === 2){
            this.user["age"] = text;
            await this.sendText("Is it pretty ? 1-10")
        }
        if(this.count === 3){
            this.user["handsome"] = text;
            await this.sendText("What is it work?")
        }
        if(this.count === 4){
            this.user["occupation"] = text;
            await this.sendText("What are your goal?")
        }
        if(this.count === 5){
            this.user["goals"] = text;
            const prompt = this.loadPrompt("opener")
            const info = userInfoToString(this.user);
            const ans = await chatgpt.sendQuestion(prompt, info);
            await this.sendText(ans)
        }
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
        else if(this.mode === "profile"){
            await this.profileDialog(msg);
        }
        else if(this.mode === "opener"){
            await this.openerDialog(msg);
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
bot.onCommand(/\/profile/, bot.profile)
bot.onCommand(/\/opener/, bot.opener)

bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/, bot.dateButton)
bot.onButtonCallback(/^message_.*/, bot.messageButton)
bot.onButtonCallback(/^.*/,bot.helloButton)