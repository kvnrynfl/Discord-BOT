const mongoose = require('mongoose');
const { reportBugs } = require('../../models/mongoDB');
require('dotenv').config();

async function countDataReportBug() {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });

        const count = await reportBugs.countDocuments();
        return count;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return error;
    }
}

async function findDataReportBug(userId) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const reportBugFind = await reportBugs.find({ userId: userId });
        return reportBugFind;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return error;
    }
}

async function inputDataReportBug(guildId, userId, fullName, title, screenshotUrl, description) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const reportId = await countDataReportBug() + 1;
        const reportBugData = new reportBugs({
            reportId: reportId,
            guildId: guildId,
            userId: userId,
            fullName: fullName,
            title: title,
            screenshotUrl: screenshotUrl,
            description: description
        });

        await reportBugData.save();
        return true;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function updateStatusReportBug(reportId, status) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const reportBugFind = await reportBugs.findOne({ reportId: reportId }).exec();
        reportBugFind.status = status;
        await reportBugFind.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

module.exports = {
    countDataReportBug,
    findDataReportBug,
    inputDataReportBug,
    updateStatusReportBug,
};