"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateView = void 0;
const moment_1 = __importDefault(require("moment"));
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
function parseDate(input) {
    const regexExp = /^(0?[1-9]|[12][0-9]|3[01])(\/)(0?[1-9]|1[012])(\/)(\d{4}|\d{2})$/gi;
    return regexExp.test(input) ? input.split('/') : ['00', '00', '00'];
}
function addZero(value) {
    return `0${value}`.toString().slice(-2);
}
async function DateView(props) {
    const { status } = props;
    const split = parseDate(props.message.body);
    const oneDay = (1000 * 60 * 60 * 24);
    const date = new Date();
    const now = [date.getFullYear(), addZero(date.getMonth() + 1), addZero(date.getDate())];
    const input = [`20${split[2].toString().slice(-2)}`, addZero(split[1]), addZero(split[0])];
    const getLimiter = new Date((date.getTime() + (oneDay * 14)));
    const getInput = new Date(input.join('/'));
    const getNow = new Date(now.join('/'));
    switch (props.message.body.toLowerCase()) {
        case '#inicio':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).MainView);
            break;
        case '#voltar':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).ServicesView);
            break;
        case '#sair':
            status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
            (0, CleanStatus_1.CleanStatus)(props);
            await props.client
                .sendText(props.message.from, (0, alerts_1.alert)().Cancel);
            break;
        default:
            if ((0, moment_1.default)(input.join('/'), 'YYYY/MM/DD', true).isValid()) {
                if (getInput.getTime() <= getLimiter.getTime()
                    && getInput.getTime() >= getNow.getTime()) {
                    status[`DATE${props.message.sender.id}`.split('@')[0]] = input.join('/');
                    status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'PeriodView';
                    await props.client
                        .sendText(props.message.from, (0, views_1.view)(props).PeriodView);
                }
                else {
                    await props.client
                        .sendText(props.message.from, (0, alerts_1.alert)().InvalidDate);
                    await props.client
                        .sendText(props.message.from, (0, views_1.view)(props).DateView);
                }
            }
            else {
                await props.client
                    .sendText(props.message.from, (0, alerts_1.alert)().InvalidTextFormat);
                await props.client
                    .sendText(props.message.from, (0, views_1.view)(props).DateView);
            }
            break;
    }
}
exports.DateView = DateView;
