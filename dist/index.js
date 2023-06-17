"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const client_1 = __importDefault(require("./lib/client"));
const handlersDir = (0, path_1.join)(__dirname, './handlers');
(0, fs_1.readdirSync)(handlersDir).forEach((handler) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(`${handlersDir}/${handler}`)(client_1.default);
});
