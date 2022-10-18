"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameView = void 0;
const views_1 = require("../messages/views");
async function NameView(props) {
    const { status } = props;
    if (status[`NAME${props.message.sender.id}`.split('@')[0]] === '' || !status[`NAME${props.message.sender.id}`.split('@')[0]]) {
        await props.client
            .sendText(props.message.from, (0, views_1.view)(props).NameView).then(() => {
            status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
        });
    }
}
exports.NameView = NameView;
