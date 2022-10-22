"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodView = void 0;
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
const connect_1 = require("../database/connect");
const Session_json_1 = __importDefault(require("../config/Session.json"));
async function PeriodView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    const business = session.Business.replace(/ /g, '_').toLowerCase();
    const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]].replace(/\//g, '-');
    const employee = status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]]
        .toLowerCase()
        .replace(/(\/)|(\s)/g, '_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const selectValues = [business, employee, service_date];
    const select = 'SELECT service_time FROM optimus WHERE business = ? AND employee = ? AND service_date = ?';
    switch (props.message.body.toLowerCase()) {
        case '1':
            status[`PERIOD${props.message.sender.id}`.split('@')[0]] = 'Afternoon';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'HourView';
            connect_1.db.query(select, selectValues, (error, results) => {
                if (error)
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
            });
            break;
        case '2':
            status[`PERIOD${props.message.sender.id}`.split('@')[0]] = 'Morning';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'HourView';
            connect_1.db.query(select, selectValues, (error, results) => {
                if (error)
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
            });
            break;
        case '#inicio':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).MainView);
            break;
        case '#voltar':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).DateView);
            break;
        case '#sair':
            status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
            (0, CleanStatus_1.CleanStatus)(props);
            await props.client
                .sendText(props.message.from, (0, alerts_1.alert)().Cancel);
            break;
        default:
            await props.client
                .sendText(props.message.from, (0, alerts_1.alert)().OptionsBelow);
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).PeriodView);
            break;
    }
}
exports.PeriodView = PeriodView;
