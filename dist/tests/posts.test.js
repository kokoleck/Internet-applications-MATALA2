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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let userInfo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_URL_ENV || 'mongodb://localhost:27017/mydatabase');
    yield posts_model_1.default.deleteMany();
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
describe("Posts tests", () => {
    let postId;
    test("Add a new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/posts").set("Authorization", `Bearer ${userInfo.token}`).send({
            title: "Test Post",
            content: "This is a test post",
            senderId: userInfo._id
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("title", "Test Post");
        postId = response.body._id;
    }));
    test("Add a post with missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/posts").set("Authorization", `Bearer ${userInfo.token}`).send({
            title: "Test Post"
        });
        expect(response.statusCode).toBe(500);
    }));
    test("Get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Get post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/posts/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", "Test Post");
    }));
    test("Get post by non-existent ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/posts/invalidPostId`);
        expect(response.statusCode).toBe(404);
    }));
    test("Update post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/posts/${postId}`).set("Authorization", `Bearer ${userInfo.token}`).send({
            title: "Updated Test Post"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", "Updated Test Post");
    }));
    test("Update post unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/posts/${postId}`).send({
            title: "Unauthorized update"
        });
        expect(response.statusCode).toBe(401);
    }));
    test("Update non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/posts/invalidPostId`).set("Authorization", `Bearer ${userInfo.token}`).send({
            title: "Updated Test Post"
        });
        expect(response.statusCode).toBe(404);
    }));
    test("Delete post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Post deleted successfully");
    }));
    test("Delete post unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/posts/${postId}`);
        expect(response.statusCode).toBe(401);
    }));
    test("Delete non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/posts/invalidPostId`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(404);
    }));
});
