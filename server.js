const dotenv = require("dotenv");
const { app } = require("./app");
const { db } = require("./utils/database.util.js");

// Utils
const { initModels } = require("./models/init.models.js");

dotenv.config({ path: "./config.env" });

const startServer = async () => {
    try {
        await db.authenticate();

        initModels();
        await db.sync();

        const PORT = 4000;
        app.listen(PORT, () => {
            console.log("Express app running!");
            // console.log(process.env);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
