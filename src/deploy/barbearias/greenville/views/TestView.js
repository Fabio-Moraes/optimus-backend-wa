"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const views_1 = require("../messages/views");
const alerts_1 = require("../messages/alerts");
async function Test(props) {
    const { status } = props;
    switch (props.message.body.toLocaleLowerCase()) {
        case 'test':
            await props.client.sendText(props.message.from, '123');
            break;
        case 'finalizar':
            props.client.sendText(props.message.from, (0, alerts_1.alert)().Finished);
            break;
        default:
            if (status[`NAME${props.message.sender.id}`.split('@')[0]] === '' || !status[`NAME${props.message.sender.id}`.split('@')[0]])
                status[`NAME${props.message.sender.id}`.split('@')[0]] = props.message.body;
            await props.client.sendText(props.message.from, (0, views_1.view)(props).MainView);
            break;
    }
}
exports.Test = Test;
