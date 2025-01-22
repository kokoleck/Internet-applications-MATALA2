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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const mongoose_1 = __importDefault(require("mongoose"));
const comment_1 = __importDefault(require("../models/comment"));
const user_model_1 = __importDefault(require("../models/user_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let userInfo;
let postInfo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_URL_ENV || 'mongodb://localhost:27017/mydatabase');
    yield comment_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
    const userResponse = yield (0, supertest_1.default)(app_1.app).post("/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123"
    });
    userInfo = userResponse.body.user;
    const loginResponse = yield (0, supertest_1.default)(app_1.app).post("/auth/login").send({
        email: userInfo.email,
        password: "password123"
    });
    userInfo.token = loginResponse.body.token;
    const postResponse = yield (0, supertest_1.default)(app_1.app).post("/posts").set("Authorization", `Bearer ${userInfo.token}`).send({
        title: "Test Post",
        content: "This is a test post",
        senderId: userInfo._id
    });
    postInfo = postResponse.body;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("App tests", () => {
    test("GET / should return Hello world!", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Hello world!");
    }));
    test("GET /comments should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/comments");
        expect(response.statusCode).toBe(200);
    }));
    test("GET /posts should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/posts");
        expect(response.statusCode).toBe(200);
    }));
    test("GET /users should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/users");
        expect(response.statusCode).toBe(401);
    }));
    test("POST /auth/login should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/login").send({
            email: "testuser@example.com",
            password: "password123"
        });
        expect(response.statusCode).toBe(200);
    }));
    test("GET /nonexistent should return 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/nonexistent");
        expect(response.statusCode).toBe(404);
    }));
});
