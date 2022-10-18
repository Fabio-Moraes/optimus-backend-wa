"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const wa_automate_1 = require("@open-wa/wa-automate");
const ViewController_1 = require("../controllers/ViewController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
class Server {
    constructor() {
        (0, wa_automate_1.create)({
            sessionId: 'james_barbearia',
            multiDevice: true,
            disableSpins: true,
            headless: true,
            hostNotificationLang: wa_automate_1.NotificationLanguage.PTBR,
            logConsole: false,
            popup: true,
            qrTimeout: 0,
        }).then((client) => (0, ViewController_1.ViewController)(client));
    }
}
exports.Server = Server;
