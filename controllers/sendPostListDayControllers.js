const dbControllers = require('./dbControllers');

class sendPostControllers {
    async sendPostList(dayDB, weekday){
        try {
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
            return arrList;
        } catch(err){
            console.error(err)
        }
    }
}

module.exports = new sendPostControllers();