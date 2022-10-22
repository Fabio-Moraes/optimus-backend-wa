"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainView = void 0;
const moment_1 = __importDefault(require("moment"));
const views_1 = require("../messages/views");
const alerts_1 = require("../messages/alerts");
// import { Test } from '../views/TestView';
const connect_1 = require("../database/connect");
const Session_json_1 = __importDefault(require("../config/Session.json"));
async function MainView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    const business = session.Business.replace(/ /g, '_').toLowerCase();
    const phone = String(props.message.sender.id);
    const now = moment_1.default.utc().format('YYYY-MM-DD');
    const checkDate = (date) => moment_1.default
        .utc(date.service_date).valueOf() < moment_1.default.utc().valueOf();
    const selectValues = [business, phone];
    const deleteDate = 'DELETE FROM optimus WHERE service_date < ?;';
    const select = 'SELECT name, identifier, employee, service, service_date, service_time FROM optimus WHERE business = ? AND phone = ?';
    switch (props.message.body.toLocaleLowerCase()) {
        case '1':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).ServicesView);
            break;
        case '2':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DeleteView';
            connect_1.db.query(select, selectValues, (error, results) => {
                if (error) {
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                }
                else if (results.some(checkDate)) {
                    connect_1.db.query(deleteDate, [now], (err) => {
                        if (err) {
                            props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                        }
                        else {
                            props.client.sendText(props.message.from, (0, views_1.view)(props, results).DeleteView);
                        }
                    });
                }
                else
                    props.client.sendText(props.message.from, (0, views_1.view)(props, results).DeleteView);
            });
            break;
        case '0':
            await props.client
                .sendContact(props.message.sender.id, '554192626733@c.us');
            break;
        case '#perfil':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).NameView);
            break;
        default:
            if (status[`NAME${props.message.sender.id}`.split('@')[0]] === ''
                || !status[`NAME${props.message.sender.id}`.split('@')[0]]) {
                status[`NAME${props.message.sender.id}`.split('@')[0]] = props.message.body;
            }
            await props.client.sendText(props.message.from, (0, views_1.view)(props).MainView);
            // Test(props);
            break;
    }
}
exports.MainView = MainView;
