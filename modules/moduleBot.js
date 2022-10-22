const fs = require('fs');
const downloadFileController = require('../controllers/downloadFileController');
const {Telegraf, } = require('telegraf');
const dbControllers = require('../controllers/dbControllers');
const {textForTelegram} = require('../config').settings()
const cron = require('node-cron');

class moduleBot{
    botStart(TELEGRAM_API_TOKEN, urlHTTP, lunchShed) {
        const bot = new Telegraf(TELEGRAM_API_TOKEN);
        bot.start(async (ctx) => {
            await ctx.reply(textForTelegram.start)
            const dailyPost = cron.schedule('0 6 * * *', () => {
                post(ctx);
            });
            dailyPost.start()
        });
        // Список предметов и учителей
        bot.command('subjects', async (ctx) => {
            try {
                const listSubject = await dbControllers.dbSubjectList();
                let arrInlineSubject = [];
                for(let i = 0; i < listSubject.length; i++){
                    arrInlineSubject.push([{text: `${listSubject[i].title}`, callback_data: `sub`}])
                }
                await ctx.reply('Список предметов',{
                    reply_markup: {
                        inline_keyboard: arrInlineSubject
                    }
                })
            } catch (err) {
                console.error(err);
            }
        });

        bot.command('teachers', async (ctx) => {
            try {
                const listTeacher = await dbControllers.dbTeachersList();
                let arrInlineTeacher = [];
                for(let i = 0; i < listTeacher.length; i++){
                    arrInlineTeacher.push([{text: `${listTeacher[i].nameTeacher}`, callback_data: `teach`}])
                }
                await ctx.reply('Список преподователей',{
                    reply_markup: {
                        inline_keyboard: arrInlineTeacher
                    }
                })
            } catch (err) {
                console.error(err);
            }
        });
        // Расписание
        bot.command('timetable', async (ctx) => {
            try {
                await ctx.reply('Дни недели',{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Понедельник', callback_data: 'bttn-mon'}],
                            [{text: 'Вторник', callback_data: 'bttn-tue'}],
                            [{text: 'Среда', callback_data: 'bttn-wed'}],
                            [{text: 'Четверг', callback_data: 'bttn-thu'}],
                            [{text: 'Пятница', callback_data: 'bttn-fri'}]
                        ]
                    }
                })
            } catch (err) {
                console.error(err);
            }
        });
        
        // Обед
        bot.command('lunch', async (ctx) => {
            try {
                require('../controllers/scrapController').connHTTP(urlHTTP)
                for (let i = 0; i < lunchShed.length; i++){
                    downloadFileController.downloadLunch(lunchShed[i].id, lunchShed[i].title, lunchShed[i].href);
                }
                await ctx.reply('Расписание вкуснятины',{
                    reply_markup: {
                        inline_keyboard: [
                        [{text: `${lunchShed[0].title}`, callback_data: 'lunch-1'}],
                        [{text: `${lunchShed[1].title}`, callback_data: 'lunch-2'}]
                        ]
                    }
                })
            } catch(err){
                console.error(err);
            }
        })
        //закрыть рассылку
        bot.command('stop', async (ctx) => {
            await dailyPost.stop()
            ctx.sendMessage(ctx.message.chat.id, `Рассылка закрыта`);
        })

        //Меню на завтра
        function sendLunchPdf(bttnName, idLunchShed){
            bot.action(bttnName, async (ctx) => {
                try {
                    await ctx.answerCbQuery()
                    await ctx.replyWithDocument({
                        source: `content/file/${idLunchShed.title}-${idLunchShed.id}.pdf`
                    })
                } catch(err){
                    console.error(err)
                }        
            })
        }
        sendLunchPdf('lunch-1', lunchShed[0]);
        sendLunchPdf('lunch-2', lunchShed[1]);

        //Функция кнопок subject
        bot.action('sub', async (ctx) => {
            try {
                await ctx.answerCbQuery();
            } catch(err){
                console.error(err)
            }        
        })

        //Функция кнопок teacher
        bot.action('teach', async (ctx) => {
            try {
                await ctx.answerCbQuery();
            } catch(err){
                console.error(err)
            }        
        })

        //Функция кнопок расписания
        function postListDay(bttn, weekday, dayDB){
            bot.action(bttn, async (ctx) => {
                try {
                    await ctx.answerCbQuery();
                    dayDB = await dayDB;
                    weekday = weekday
                    let arrList = `${weekday}\n\n`;
                    for(let i = 0; i < dayDB.length; i++){
                        const id = dayDB[i].id; 
                        const teacher = dayDB[i].id_teacher; 
                        const subject = dayDB[i].id_categories; 
                        const time = dayDB[i].id_time; 
                        const office = dayDB[i].id_office; 
                        arrList += await dbControllers.dbListDay(id, teacher, subject, time, office)
                    }
                    await ctx.replyWithHTML(arrList)
                } catch(err){
                    console.error(err)
                }        
            })
        }
        postListDay('bttn-mon', 'Понедельник', dbControllers.dbMonday())
        postListDay('bttn-tue', 'Вторник', dbControllers.dbTuesday())
        postListDay('bttn-wed', 'Среда', dbControllers.dbWednesday())
        postListDay('bttn-thu', 'Четверг', dbControllers.dbThursday())
        postListDay('bttn-fri', 'Пятница', dbControllers.dbFriday())
        
        //Ежедневная рассылка расписания
        async function post(ctx){
            const data = new Date().getDay()
            switch (data){
                case 1:
                    ctx.telegram.sendMessage(ctx.message.chat.id,await require('../controllers/sendPostListDayControllers').sendPostList(dbControllers.dbMonday(), 'Понедельник'))
                    break;
                case 2:
                    ctx.telegram.sendMessage(ctx.message.chat.id,await require('../controllers/sendPostListDayControllers').sendPostList(dbControllers.dbTuesday(), 'Вторник'))
                    break;
                case 3:
                    ctx.telegram.sendMessage(ctx.message.chat.id,await require('../controllers/sendPostListDayControllers').sendPostList(dbControllers.dbWednesday(), 'Среда'))
                    break;
                case 4:
                    ctx.telegram.sendMessage(ctx.message.chat.id,await require('../controllers/sendPostListDayControllers').sendPostList(dbControllers.dbThursday(), 'Четверг'))
                    break;
                case 5:
                    ctx.telegram.sendMessage(ctx.message.chat.id, await require('../controllers/sendPostListDayControllers').sendPostList(dbControllers.dbFriday(), 'Пятница'))
                    break;
                default:
                    ctx.telegram.sendMessage(ctx.message.chat.id, `хороших выходных!`)
                    break;
            }
        }
        bot.hears("/start@bezdarSBRF_bot", (ctx) => {
        });

        bot.launch();
    }
}

module.exports = new moduleBot()