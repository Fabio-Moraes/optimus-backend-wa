"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesView = void 0;
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
const Session_json_1 = __importDefault(require("../config/Session.json"));
async function ServicesView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    switch (props.message.body.toLowerCase()) {
        case '1':
            status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Oneservice;
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).EmployeeView);
            break;
        case '2':
            status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Twoservice;
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).EmployeeView);
            break;
        case '3':
            status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Threeservice;
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).EmployeeView);
            break;
        case '4':
            status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Otrerservice;
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).EmployeeView)
                .then(() => {
                status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
            });
            break;
        case '#inicio':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).MainView);
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
                .sendText(props.message.from, (0, views_1.view)(props).ServicesView);
            break;
    }
}
exports.ServicesView = ServicesView;
