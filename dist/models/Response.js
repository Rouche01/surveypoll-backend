"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var responseSchema = new mongoose_1.default.Schema({
    response: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Number,
        default: Date.now,
    },
}, {
    toJSON: {
        versionKey: false,
        transform: function (_, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
responseSchema.statics.build = function (attrs) {
    return new Response(attrs);
};
var Response = mongoose_1.default.model("Response", responseSchema);
exports.Response = Response;
