import mongoose from "mongoose";
import { hash, compare } from 'bcryptjs'

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    username: String,
    email: String,
    password: String
},{
    timestamps: true
});

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 10)
    }
})

UserSchema.methods.matchesPassword = function (password) {
    return compare(password, this.password)
}

export default mongoose.model('User', UserSchema);
