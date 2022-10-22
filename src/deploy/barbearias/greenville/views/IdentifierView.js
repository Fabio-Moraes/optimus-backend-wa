"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierView = void 0;
const CleanStatus_1 = require("../components/CleanStatus");
const alerts_1 = require("../messages/alerts");
const views_1 = require("../messages/views");
async function IdentifierView(props) {
    const { status } = props;
    switch (props.message.body.toLowerCase()) {
        case '1':
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).ServicesView);
            break;
        case '2':
            status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
            (0, CleanStatus_1.CleanStatus)(props);
            await props.client
                .sendText(props.message.from, (0, alerts_1.alert)().Finished);
            break;
        default:
            await props.client
                .sendText(props.message.from, (0, alerts_1.alert)().OptionsBelow);
            await props.client
                .sendText(props.message.from, (0, views_1.view)(props).IdentifierView);
            break;
    }
}
exports.IdentifierView = IdentifierView;
