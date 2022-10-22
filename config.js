const fs = require('fs');

class configController {
    settings(PORT, TELEGRAM_API_TOKEN, urlHTTP, lunchShed, dbSettings, textForTelegram)
    {
        PORT = "8080";
        TELEGRAM_API_TOKEN = "//TELEGRAM TOKEN";
        urlHTTP = "http://kst.mskobr.ru/roditelyam/vse-voprosi-o-pitanii"; //сайт для парсинга
        lunchShed = JSON.parse(fs.readFileSync('content/data/lunchData.json')); //Копируем данные парсинга в переменную
        dbSettings = {
            //Инфа для подключения к бд
            host: ,
            port: ,
            user: ,
            password: ,
            database: ,
        }
        textForTelegram = {
            "start": 'Всем привет! я бот анонимной группы бездарей.\nМой функционал довольно скудный, но полезный. Я могу отправить вам актуальное меню, расписание, список предметов или учителей, а также каждый день в 6 утра я буду отправлять расписание занятий этого дня\n\n/start - вызов главного сообщения\n/lunch - меню на завтра\n/teachers - список учителей\n/subjects - список предметов, нажав на которые, можно узнать о его преподавателе\n/timetable - Расписание\n/stop - выключить ежедневную рассылку'
        }
        return {PORT, TELEGRAM_API_TOKEN, urlHTTP, lunchShed, dbSettings, textForTelegram}
    }
}

module.exports = new configController()
