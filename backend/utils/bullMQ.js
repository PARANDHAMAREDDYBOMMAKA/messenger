const { Queue } = require("bullmq");
const queue = new Queue("messages");

module.exports = queue;
