"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateIdentifier = void 0;
function GenerateIdentifier(length) {
    const dateNow = Date.now();
    const first = Math.random().toString(36).slice(length * -1).toUpperCase();
    const last = String(dateNow).split('').slice(length * -1).join('');
    return `${first.replace(/.{2}/, '$&-')}-${last.replace(/.{2}/, '$&-')}`;
}
exports.GenerateIdentifier = GenerateIdentifier;
