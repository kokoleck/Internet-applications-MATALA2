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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_URL_ENV || 'mongodb://localhost:27017/mydatabase');
    yield user_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Auth tests", () => {
    test("Register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/register").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.user).toHaveProperty("username", "testuser");
    }));
    test("Register with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/register").send({
            username: "testuser2",
            email: "testuser@example.com",
            password: "password123"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty("message", "Email already exists");
    }));
    test("Login with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/login").send({
            email: "testuser@example.com",
            password: "password123"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
    }));
    test("Login with invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/login").send({
            email: "testuser@example.com",
            password: "wrongpassword"
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid credentials");
    }));
    test("Logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/auth/logout");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Logged out successfully");
    }));
});
