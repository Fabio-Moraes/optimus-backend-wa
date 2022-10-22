"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeView = void 0;
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
const Session_json_1 = __importDefault(require("../config/Session.json"));
async function EmployeeView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    switch (props.message.body.toLowerCase()) {
        case '1':
            status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]] = session.Employee1;
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).DateView);
            break;
        case '2':
            status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]] = session.Employee2;
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).DateView);
            break;
        case '#inicio':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).MainView);
            break;
        case '#voltar':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
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
                .sendText(props.message.from, (0, views_1.view)(props).EmployeeView);
            break;
    }
}
exports.EmployeeView = EmployeeView;
