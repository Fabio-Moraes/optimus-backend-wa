"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLeadingZeros = void 0;
function AddLeadingZeros(str, targetLength) {
    return String(str).padStart(targetLength, '0');
}
exports.AddLeadingZeros = AddLeadingZeros;
