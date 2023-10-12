"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_config_1 = __importDefault(require("./databases/redis_config"));
const mongo_config_1 = require("./databases/mongo_config");
const node_cron_1 = __importDefault(require("node-cron"));
const cts_1 = require("./controllers/cts");
dotenv_1.default.config();
const app = (0, express_1.default)();
redis_config_1.default.connect();
(0, mongo_config_1.mongoConnect)();
//Run the worker daily at midnight
node_cron_1.default.schedule('0 0 * * *', cts_1.UpdateDateWorker);
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`A Node JS TaskManager API is listening on port: ${port}`);
});
const routes = require('./router');
//middleware
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use('/', routes);
