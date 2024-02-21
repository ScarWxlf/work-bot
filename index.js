import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import env from "dotenv";
import cheerio from "cheerio";

env.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const djinni = "https://djinni.co/jobs/?primary_keyword=JavaScript&exp_level=1y";
const workua = "https://www.work.ua/jobs-remote-front-end+%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%96%D1%81%D1%82/";
var lastJob = "0";
var lastJobWorkua = "0";
const chat = 655526453;


getJobsDJINNI();
getJobsFromWORKUA();
async function getJobsDJINNI() {
    const result = await axios.get(djinni);
    const data = result.data;
    const $ = cheerio.load(data);
    const jobs = $(".list-jobs__item");
    const link = $(jobs[0]).find(".job-list-item__link").attr("href");
    const id = $(jobs[0]).attr("id");
    
    if (lastJob !== id) {
        lastJob = id;
        bot.sendMessage(chat, "https://djinni.co" + link);
    }
    console.log(id, link)
    setTimeout(() => {
        getJobsDJINNI();
    }, 5000);
}

async function getJobsFromWORKUA() {
    const result = await axios.get(workua);
    const data = result.data;
    const $ = cheerio.load(data);
    const jobs = $(".job-link");
    const link_id = $(jobs[0]).prev().attr("name");
    if (lastJobWorkua !== link_id) {
        lastJobWorkua = link_id;
        bot.sendMessage(chat, "https://www.work.ua/jobs/" + link_id);
    }
    console.log(link_id)
    setTimeout(() => {
        getJobsFromWORKUA();
    }, 5000);
    // const link = $(jobs[0]).find(".job-list-item__link").attr("href");
    // const id = $(jobs[0]).attr("id");
}

// function sendMessage(job) {
//     bot.on("message", (msg) => {
//         const chatId = msg.chat.id;
//         console.log(chatId)
//         bot.sendMessage(chat, "https://djinni.co" + job);
//     });
// }
