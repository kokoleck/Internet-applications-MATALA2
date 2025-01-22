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
describe("Comments tests", () => {
    let commentId;
    test("Add a new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post(`/comments/post/${postInfo._id}`).set("Authorization", `Bearer ${userInfo.token}`).send({
            content: "This is a test comment",
            author: userInfo._id,
            post: postInfo._id
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("content", "This is a test comment");
        commentId = response.body._id;
    }));
    test("Add a comment to a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post(`/comments/post/invalidPostId`).set("Authorization", `Bearer ${userInfo.token}`).send({
            content: "This is a test comment",
            author: userInfo._id,
            post: "invalidPostId"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Get comments by post ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/comments/post/${postInfo._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Get comments by non-existent post ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get(`/comments/post/invalidPostId`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid post ID");
    }));
    test("Get comments by valid post ID with no comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const newPostResponse = yield (0, supertest_1.default)(app_1.app).post("/posts").set("Authorization", `Bearer ${userInfo.token}`).send({
            title: "Empty Post",
            content: "No comments here",
            senderId: userInfo._id,
        });
        const newPostId = newPostResponse.body._id;
        const response = yield (0, supertest_1.default)(app_1.app).get(`/comments/post/${newPostId}`);
        expect(response.statusCode).toBe(404); // Expecting 404 for no comments
        expect(response.body).toHaveProperty("error", "No comments found for this post");
    }));
    test("Update comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/comments/${commentId}`).set("Authorization", `Bearer ${userInfo.token}`).send({
            content: "Updated test comment"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("content", "Updated test comment");
    }));
    test("Update comment unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/comments/${commentId}`).send({
            content: "Unauthorized update"
        });
        expect(response.statusCode).toBe(401);
    }));
    test("Update non-existent comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put(`/comments/invalidCommentId`).set("Authorization", `Bearer ${userInfo.token}`).send({
            content: "Updated test comment"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Delete comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/comments/${commentId}`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Comment deleted successfully");
    }));
    test("Delete comment unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/comments/${commentId}`);
        expect(response.statusCode).toBe(401);
    }));
    test("Delete non-existent comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).delete(`/comments/invalidCommentId`).set("Authorization", `Bearer ${userInfo.token}`);
        expect(response.statusCode).toBe(400);
    }));
});
