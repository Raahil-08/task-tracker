import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 60,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      // Use Record<string, unknown> so TypeScript allows delete/assign on any key
      transform(_doc: unknown, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Never expose passwordHash in API responses
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

/**
 * Instance method to compare a plain-text password against the stored hash.
 */
userSchema.methods.comparePassword = async function (
  plain: string
): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", userSchema);
