"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event = {
    name: 'ready',
    once: true,
    execute: (client) => {
        var _a;
        console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    },
};
exports.default = event;
