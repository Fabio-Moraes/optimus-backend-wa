"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanStatus = void 0;
function CleanStatus(props) {
    const { status } = props;
    delete status[`NAME${props.message.sender.id}`.split('@')[0]];
    delete status[`VIEW${props.message.sender.id}`.split('@')[0]];
    delete status[`DATE${props.message.sender.id}`.split('@')[0]];
    delete status[`SERVICE${props.message.sender.id}`.split('@')[0]];
    delete status[`PERIOD${props.message.sender.id}`.split('@')[0]];
    delete status[`COUPON${props.message.sender.id}`.split('@')[0]];
}
exports.CleanStatus = CleanStatus;
