import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import env from "dotenv";
import cheerio from "cheerio";

env.config();

const token = process.env.TOKEN;
const chat = process.env.CHAT;
const bot = new TelegramBot(token, { polling: true });
const djinni =
  "https://djinni.co/jobs/?primary_keyword=JavaScript&exp_level=1y";
const workuaFront = "https://www.work.ua/jobs-remote-front-end/";
const workuaJS = "https://www.work.ua/jobs-remote-javascript/";
var lastJobDjini = "0";
var lastJobWorkUAFront = "0";
var lastJobWorkUAJS = "0";

getJobsDJINNI();
getJobsFromWorkUAFront();
getJobsFromWorkUAJS();

async function getJobsDJINNI() {
  try {
    const result = await axios.get(djinni);
    const data = result.data;
    const $ = cheerio.load(data);
    const jobs = $(".list-jobs__item");
    const link = $(jobs[0]).find(".job-list-item__link").attr("href");
    const id = $(jobs[0]).attr("id");

    if (lastJobDjini !== id) {
      lastJobDjini = id;
      bot.sendMessage(chat, "https://djinni.co" + link);
    }
    //console.log(id, link)
    setTimeout(() => {
      getJobsDJINNI();
    }, 20000);
  } catch (error) {
    console.log(error);
  }
}

async function getJobsFromWorkUAFront() {
  try {
    const result = await axios.get(workuaFront);
    const data = result.data;
    const $ = cheerio.load(data);
    const jobs = $(".job-link");
    const link_id = $(jobs[0]).prev().attr("name");
    if (lastJobWorkUAFront !== link_id) {
      lastJobWorkUAFront = link_id;
      bot.sendMessage(chat, "https://www.work.ua/jobs/" + link_id);
    }
    //console.log(link_id)
    setTimeout(() => {
      getJobsFromWorkUAFront();
    }, 20000);
  } catch (error) {
    console.log(error);
  }
}

async function getJobsFromWorkUAJS() {
  try {
    const result = await axios.get(workuaJS);
    const data = result.data;
    const $ = cheerio.load(data);
    const jobs = $(".job-link");
    const link_id = $(jobs[0]).prev().attr("name");
    if (lastJobWorkUAJS !== link_id) {
      lastJobWorkUAJS = link_id;
      bot.sendMessage(chat, "https://www.work.ua/jobs/" + link_id);
    }
    //console.log(link_id)
    setTimeout(() => {
      getJobsFromWorkUAJS();
    }, 20000);
  } catch (error) {
    console.log(error);
  }
}

bot.on("message", (msg) => {
  try {
    const chatId = msg.chat.id;
    if (chatId==chat && msg.text === "/try") {
      bot.sendMessage(chat, "okey");
    }
  } catch (error) {
    console.log(error)
  }
});