"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HourView = void 0;
const moment_1 = __importDefault(require("moment"));
const GenerateIdentifier_1 = require("../components/GenerateIdentifier");
const AddLeadingZeros_1 = require("../components/AddLeadingZeros");
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
const connect_1 = require("../database/connect");
const Session_json_1 = __importDefault(require("../config/Session.json"));
function parseHours(input) {
    const regexExp = /^([0-1]?[0-9]|2[0-3])(:)([0-5][0-9])$/gi;
    return regexExp.test(input) ? input.split(':') : ['00', '00'];
}
async function HourView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    function hours() {
        if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning') {
            return session.Morning.split(', ').map((item) => `${item}:00`);
        }
        if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Afternoon') {
            return session.Afternoon.split(', ').map((item) => `${item}:00`);
        }
        return [];
    }
    const splitHours = parseHours(props.message.body);
    const inputHours = [
        (0, AddLeadingZeros_1.AddLeadingZeros)(splitHours[0], 2),
        (0, AddLeadingZeros_1.AddLeadingZeros)(splitHours[1], 2),
        '00'
    ];
    const business = session.Business.toLowerCase().replace(/ /g, '_');
    const name = status[`NAME${props.message.sender.id}`.split('@')[0]].replace(/ /g, '_');
    const phone = String(props.message.sender.id);
    const identifier = (0, GenerateIdentifier_1.GenerateIdentifier)(4);
    const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]].replace(/\//g, '-');
    const service_time = inputHours.join(':');
    const employee = status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]]
        .toLowerCase()
        .replace(/(\/)|(\s)/g, '_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const service = status[`SERVICE${props.message.sender.id}`.split('@')[0]]
        .toLowerCase()
        .replace(/(\/)|(\s)/g, '_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const indexHours = (value) => hours()[Number(hours()
        .map((item, index) => (item === service_time ? index : ''))
        .filter((item) => String(item))[0]) + value];
    const selectValues = [business, employee, service_date];
    const select = 'SELECT service_time FROM optimus WHERE business = ? AND employee = ? AND service_date = ?;';
    const ValidateHours = (results, selectHours) => {
        if (!selectHours)
            return false;
        return !(results === null || results === void 0 ? void 0 : results.filter((item) => item.service_time === selectHours).length);
    };
    const insertValues = [
        business, employee, name, phone, service, identifier, service_date, service_time
    ];
    const insert = 'INSERT INTO optimus SET business = ?, employee = ?, name = ?, phone = ?, service = ?, identifier = ?, service_date = ?, service_time = ?;';
    const dualInsertValues = (results) => {
        if (ValidateHours(results, indexHours(1))) {
            return [business, employee, name, phone, service, identifier, service_date, service_time,
                business, employee, name, phone, service, identifier, service_date, indexHours(1)];
        }
        if (ValidateHours(results, indexHours(-1))) {
            return [business, employee, name, phone, service, identifier, service_date, service_time,
                business, employee, name, phone, service, identifier, service_date, indexHours(-1)];
        }
        return [];
    };
    const dualInsert = 'INSERT INTO optimus (business, employee, name, phone, service, identifier, service_date, service_time) VALUES(?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?);';
    function isWithinTime(end) {
        const now = (0, moment_1.default)().format('HH:mm');
        if (now.toString() >= end)
            return true;
        return false;
    }
    function isWithinDate(end) {
        const now = (0, moment_1.default)().format('YYYY-MM-DD');
        if (end === now.toString())
            return true;
        return false;
    }
    switch (props.message.body.toLowerCase()) {
        case '#inicio':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
            await props.client.sendText(props.message.from, (0, views_1.view)(props).MainView);
            break;
        case '#voltar':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'PeriodView';
            await props.client.sendText(props.message.from, (0, views_1.view)(props).PeriodView);
            break;
        case '#sair':
            status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
            (0, CleanStatus_1.CleanStatus)(props);
            await props.client.sendText(props.message.from, (0, alerts_1.alert)().Cancel);
            break;
        default:
            connect_1.db.query(select, selectValues, (errorSelect, results) => {
                if (errorSelect) {
                    // props.client.sendText(props.message.from, 'err-0');
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                    props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
                }
                else if (hours().includes(inputHours.join(':'))) {
                    if (isWithinDate(service_date) && isWithinTime(service_time)) {
                        props.client.sendText(props.message.from, 'horario do dia não disponivel');
                    }
                    else if (service === 'corte_de_cabelo') {
                        if (ValidateHours(results, service_time)) {
                            connect_1.db.query(insert, insertValues, (errorInsert) => {
                                if (errorInsert) {
                                    // props.client.sendText(props.message.from, 'err-1');
                                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                                    props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
                                }
                                else {
                                    status[`identifier${props.message.sender.id}`.split('@')[0]] = identifier;
                                    status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'IdentifierView';
                                    props.client.sendText(props.message.from, (0, views_1.view)(props).IdentifierView);
                                }
                            });
                        }
                        else
                            props.client.sendText(props.message.from, (0, alerts_1.alert)().TimeNotAvailable);
                    }
                    else if (ValidateHours(results, service_time)) {
                        if (ValidateHours(results, indexHours(1)) || ValidateHours(results, indexHours(-1))) {
                            connect_1.db.query(dualInsert, dualInsertValues(results), (errorInsert) => {
                                if (errorInsert) {
                                    // props.client.sendText(props.message.from, 'err-2');
                                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                                    props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
                                }
                                else {
                                    status[`identifier${props.message.sender.id}`.split('@')[0]] = identifier;
                                    status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'IdentifierView';
                                    props.client.sendText(props.message.from, (0, views_1.view)(props).IdentifierView);
                                }
                            });
                        }
                        else
                            props.client.sendText(props.message.from, (0, alerts_1.alert)().TimeNotAvailable);
                    }
                    else
                        props.client.sendText(props.message.from, (0, alerts_1.alert)().TimeNotAvailable);
                }
                else {
                    // props.client.sendText(props.message.from, 'err-3');
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().InvalidTextFormat);
                    props.client.sendText(props.message.from, (0, views_1.view)(props, results).HourView);
                }
            });
            break;
    }
}
exports.HourView = HourView;
