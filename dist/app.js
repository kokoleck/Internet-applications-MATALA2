"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const users_routes_1 = __importDefault(require("./routes/users_routes")); // ייבוא ברירת מחדל
dotenv_1.default.config();
// import { authenticateJWT } from "./middlewares/authMiddleware";
const app = (0, express_1.default)();
exports.app = app;
// הגדרת ה-Routes של פוסטים ותגובות תחת אימות JWT
app.use("/posts", authMiddleware_1.default, posts_routes_1.default);
app.use("/comments", authMiddleware_1.default, comments_routes_1.default);
const port = process.env.PORT || 3000;
mongoose_1.default.connect(process.env.DB_CONNECTION);
// חיבור ה-Middleware של האימות
app.use("/posts", authMiddleware_1.default, posts_routes_1.default);
const db = mongoose_1.default.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/users", users_routes_1.default); // הוספת המסלול של המשתמשים
app.get("/about", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    }
    else {
        console.error(err);
    }
});
