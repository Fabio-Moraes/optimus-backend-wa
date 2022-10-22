"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteView = void 0;
const moment_1 = __importDefault(require("moment"));
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
const connect_1 = require("../database/connect");
const Session_json_1 = __importDefault(require("../config/Session.json"));
async function DeleteView(props) {
    const session = JSON.parse(JSON.stringify(Session_json_1.default));
    const { status } = props;
    const business = session.Business.replace(/ /g, '_').toLowerCase();
    const phone = String(props.message.sender.id);
    // const phone = '554192626233@c.us';
    const listSqlValues = [business, phone];
    const listSql = 'SELECT name, identifier, employee, service, service_date, service_time FROM optimus WHERE business = ? AND phone = ?;';
    switch (props.message.body.toLowerCase()) {
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
            connect_1.db.query(listSql, listSqlValues, (error, results) => {
                const setResults = new Set();
                const filterResults = results.filter((res) => {
                    const duplicatedIdentifier = setResults.has(res.identifier);
                    setResults.add(res.identifier);
                    return !duplicatedIdentifier;
                });
                if (error) {
                    props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                }
                else if (results.length > 0) {
                    const { service_time } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const { service_date } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const { employee } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const { name } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const { service } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const { identifier } = filterResults
                        .filter((i, index) => index === Number(props.message.body))[0];
                    const resultAlert = {
                        name, employee, service, service_date, service_time,
                    };
                    const dateListDeleteNow = moment_1.default.utc(service_date).format('YYYY/MM/DD');
                    const deleteSqlValues = [
                        employee, service, phone, business, dateListDeleteNow, identifier
                    ];
                    const deleteSql = 'DELETE FROM optimus WHERE employee = ? AND service = ? AND phone = ? AND business = ? AND service_date = ? AND identifier = ?;';
                    if (Number(props.message.body) < results.length && Number(props.message.body) >= 0) {
                        connect_1.db.query(deleteSql, deleteSqlValues, (_error) => {
                            if (_error) {
                                props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                            }
                            else {
                                connect_1.db.query(listSql, listSqlValues, (subError, subResults) => {
                                    if (subError) {
                                        props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                                    }
                                    else {
                                        props.client.sendText(props.message.from, (0, alerts_1.alert)(resultAlert).Deleted);
                                        props.client.sendText(props.message.from, (0, views_1.view)(props, subResults).DeleteView);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        connect_1.db.query(listSql, listSqlValues, (subError, subResults) => {
                            if (subError)
                                props.client.sendText(props.message.from, (0, alerts_1.alert)().FailConnect);
                            props.client.sendText(props.message.from, 'ID Inexistente');
                            props.client.sendText(props.message.from, (0, views_1.view)(props, subResults).DeleteView);
                        });
                    }
                }
                else {
                    props.client.sendText(props.message.from, (0, views_1.view)(props).DeleteView);
                }
            });
            break;
    }
}
exports.DeleteView = DeleteView;
