// user_model.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface למודל המשתמש
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;  // הוספת טיפוס למתודה comparePassword
}

// הגדרת הסכמה למודל משתמש
const userSchema = new Schema<IUser>({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

// הצפנת הסיסמה לפני שמירה במסד נתונים
userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();

    // הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// בדיקת סיסמא
userSchema.methods.comparePassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// יצירת המודל
const User = model<IUser>('User', userSchema);
export default User;
