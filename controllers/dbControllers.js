const mysql = require("mysql2/promise");
const {dbSettings} = require('../config').settings();

class dbControllers {
    async dbSubjectList(){
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from id_categories`);
        connection.end()
        return rows;
    }
    async dbTeachersList(subTeacher) {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from id_teachers`);
        connection.end()
        return rows;
    }
    async dbTime() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from id_time`);
        connection.end()
        return rows;
    }
    async dbOffice() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from id_office`);
        connection.end()
        return rows;
    }
    async dbMonday() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from monday`);
        connection.end()
        return rows;
    }
    async dbTuesday() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from tuesday`);
        connection.end()
        return rows;
    }
    async dbWednesday() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from wednesday`);
        connection.end()
        return rows;
    }
    async dbThursday() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from thursday`);
        connection.end()
        return rows;
    }
    async dbFriday() {
        const connection = await mysql.createConnection(dbSettings);
        const [ rows, field ] = await connection.execute(`select * from friday`);
        connection.end()
        return rows;
    }
    async dbListDay(id, teacher, subject, time, office) {
        const connection = await mysql.createConnection(dbSettings);
        const [row_teacher, field_teach] = await connection.execute(`select * from id_teachers where id_teachers = ${teacher}`);
        const [row_subject, field_sub] = await connection.execute(`select * from id_categories where id_categories = ${subject}`);
        const [row_time, field_time] = await connection.execute(`select * from id_time where id_time = ${time}`);
        const [row_office, field_office] = await connection.execute(`select * from id_office where id_office = ${office}`);
        connection.end()
        return `Пара: ${id}\nВремя: ${row_time[0].time}\nКабинет: ${row_office[0].office}\nПредмет: ${row_subject[0].title}\nУчитель: ${row_teacher[0].nameTeacher}\n\n`
    }
}

module.exports = new dbControllers()