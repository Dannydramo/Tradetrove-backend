import { Document } from 'mongoose';

export interface UserTypes extends Document {
    username: string;
    email: string;
    password: string | undefined;
    confirmPassword: string | undefined;
    active: boolean;
    created_at: Date;
    updated_at: Date | null;
    passwordChangedAt: Date;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
}
