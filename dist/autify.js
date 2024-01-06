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
exports.getResults = exports.processGetResultsData = void 0;
const axios_1 = __importDefault(require("axios"));
const datadog_1 = require("./datadog");
function processGetResultsData(getResultsData) {
    getResultsData.forEach((result, index) => {
        if (result === null || result.test_plan === null) {
            return; // skip if test_plan.name is null. This happens when rerunning a test
        }
        const status = result.status;
        const duration_sec = Math.floor(result.duration / 1000); // duration unit is mill seconds
        const started_at = result.started_at; // 2023-11-30T06:01:21.029Z, ISO8601 UTC
        const test_plan_name = result.test_plan.name;
        const started_at_unixtime = new Date(started_at).getTime(); // Unix timestamp in milliseconds
        const metrics = {
            timestamp: started_at_unixtime,
            value: duration_sec,
            status: status,
            test_plan_name: test_plan_name
        };
        (0, datadog_1.submitGetResultsMetrics)(metrics);
        console.log(metrics);
    });
}
exports.processGetResultsData = processGetResultsData;
function getResults(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load inputs
        const autify_personal_access_token = inputs.autify_personal_access_token;
        const autify_project_id = inputs.autify_project_id;
        const per_page = 100;
        const url = `https://app.autify.com/api/v1/projects/${autify_project_id}/results?per_page=${per_page}`;
        const headers = {
            accept: 'application/json',
            Authorization: `Bearer ${autify_personal_access_token}`
        };
        try {
            const response = yield axios_1.default.get(url, {
                headers
            });
            return response.data;
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    });
}
exports.getResults = getResults;
