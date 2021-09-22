"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var ws_1 = __importStar(require("ws"));
var dotenv_1 = __importDefault(require("dotenv"));
var uuid_1 = require("uuid");
var mongoose_1 = __importDefault(require("mongoose"));
var Response_1 = require("./models/Response");
dotenv_1.default.config();
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var PORT = process.env.PORT || 8080;
var wss = new ws_1.default.Server({ server: server });
var clients = new Map();
wss.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    var id, metadata, responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("A new client connected");
                id = (0, uuid_1.v4)();
                metadata = { id: id };
                clients.set(ws, metadata);
                return [4 /*yield*/, Response_1.Response.find()];
            case 1:
                responses = _a.sent();
                ws.send(JSON.stringify(responses.reverse().slice(0, 100)));
                ws.on("message", function (data) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, uniqueClients;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                response = Response_1.Response.build({
                                    response: data.toString(),
                                    createdDate: Date.now(),
                                });
                                return [4 /*yield*/, response.save()];
                            case 1:
                                _a.sent();
                                uniqueClients = Array.from(clients.keys());
                                uniqueClients.forEach(function (client) { return __awaiter(void 0, void 0, void 0, function () {
                                    var responses_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(client.readyState === ws_1.OPEN)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, Response_1.Response.find()];
                                            case 1:
                                                responses_1 = _a.sent();
                                                client.send(JSON.stringify(responses_1.reverse().slice(0, 100)));
                                                _a.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/];
                        }
                    });
                }); });
                ws.on("close", function () { return clients.delete(ws); });
                return [2 /*return*/];
        }
    });
}); });
var startup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGO_URI)];
            case 1:
                _a.sent();
                console.log("mongodb connected");
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                console.log("unable to connect to mongodb");
                return [3 /*break*/, 3];
            case 3:
                server.listen(PORT, function () { return console.log("Server is listening on port " + PORT); });
                return [2 /*return*/];
        }
    });
}); };
startup();
