"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewController = void 0;
require("moment/locale/pt-br");
const ServicesView_1 = require("../views/ServicesView");
const EmployeeView_1 = require("../views/EmployeeView");
const PeriodView_1 = require("../views/PeriodView");
const IdentifierView_1 = require("../views/IdentifierView");
const DeleteView_1 = require("../views/DeleteView");
const HourView_1 = require("../views/HourView");
const NameView_1 = require("../views/NameView");
const DateView_1 = require("../views/DateView");
const MainView_1 = require("../views/MainView");
function ViewController(client) {
    const status = {};
    client.onMessage(async (message) => {
        switch (status[`VIEW${message.sender.id}`.split('@')[0]]) {
            case 'MainView':
                await (0, MainView_1.MainView)({ client, message, status });
                break;
            case 'ServicesView':
                await (0, ServicesView_1.ServicesView)({ client, message, status });
                break;
            case 'EmployeeView':
                await (0, EmployeeView_1.EmployeeView)({ client, message, status });
                break;
            case 'PeriodView':
                await (0, PeriodView_1.PeriodView)({ client, message, status });
                break;
            case 'DateView':
                await (0, DateView_1.DateView)({ client, message, status });
                break;
            case 'HourView':
                await (0, HourView_1.HourView)({ client, message, status });
                break;
            case 'IdentifierView':
                await (0, IdentifierView_1.IdentifierView)({ client, message, status });
                break;
            case 'DeleteView':
                await (0, DeleteView_1.DeleteView)({ client, message, status });
                break;
            default:
                await (0, NameView_1.NameView)({ client, message, status });
                break;
        }
    });
}
exports.ViewController = ViewController;
