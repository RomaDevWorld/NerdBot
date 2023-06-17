"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cooldown = new Set();
const event = {
    name: 'messageCreate',
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.author.bot)
            return;
        const ignoredRules = ['UPPERCASE_SENTENCE_START', 'UK_SIMPLE_REPLACE'];
        if (cooldown.has(message.author.id))
            return;
        const response = yield axios_1.default
            .post('https://api.languagetoolplus.com/v2/check', {
            text: message.content,
            language: 'auto',
            enabledOnly: 'false',
        }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' } })
            .catch((error) => {
            console.error(error);
            return;
        });
        if (!response)
            return;
        const matches = response.data.matches.filter((match) => !ignoredRules.includes(match.rule.id));
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 15000);
        if (response.data.language.code === 'ru-RU')
            return;
        if (!matches[0])
            return;
        message
            .reply(`🤓☝️\n${matches.map((match, index) => `${index + 1}. ${match.message}`).join('\n')}`)
            .then((msg) => {
            msg.react('🤓').catch((error) => console.error(error));
        })
            .catch((error) => console.error(error));
    }),
};
exports.default = event;
