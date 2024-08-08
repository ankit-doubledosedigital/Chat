global.CONFIG = require("../../config.js")
process.env = { ...process.env, ...global.CONFIG }
const express = require('express')
const cors = require('cors');
const path = require('path');
const morgan = require("./utils/morgan");
require('./configs/db.connection.js')
require('./controller/cron.js');
const app = express()

// these allow clients to send large data like an image/pdf
app.use(express.json({ limit: '1000mb' }))
app.use(express.urlencoded({ limit: '1000mb', extended: true }))

const port = CONFIG.SERVER_PORT || 3000
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' }))
// app.use(morgan);

app.use('/chats', require('./routes/chats.js'));

app.listen(port, () => console.log(`🧞Server is up and running on port ${port}🧞`))