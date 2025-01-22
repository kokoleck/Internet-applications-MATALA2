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
const user_model_1 = __importDefault(require("../models/user_model"));
let userInfo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_URL_ENV || 'mongodb://localhost:27017/mydatabase');
    yield user_model_1.default.deleteMany();
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
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Users tests", () => {
    test("Get user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/users/${userInfo._id}`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty("username", "testuser");
    }));
    test("Get user by ID not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/users/invalidId`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(500);
    }));
    test("Get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/users").set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveLength(1);
    }));
    test("Update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/users/${userInfo._id}`).set("Authorization", `Bearer ${userInfo.token}`).send({
            username: "updateduser",
            email: "updateduser@example.com"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty("username", "updateduser");
    }));
    test("Update user with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).post("/auth/register").send({
            username: "testuser2",
            email: "testuser2@example.com",
            password: "password123"
        });
        const response = yield (0, supertest_1.default)(app_1.app).put(`/users/${userInfo._id}`).set("Authorization", `Bearer ${userInfo.token}`).send({
            email: "testuser2@example.com"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Username or email already in use");
    }));
    test("Delete user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/users/${userInfo._id}`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "User deleted successfully");
    }));
    test("Delete user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/users/invalidId`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(500);
    }));
});
