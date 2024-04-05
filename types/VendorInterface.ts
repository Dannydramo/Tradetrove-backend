import { Document } from 'mongoose';

export interface VendorTypes extends Document {
    businessName: string;
    email: string;
    password: string | undefined;
    confirmPassword: string | undefined;
    active: boolean;
    created_at: Date;
    updated_at: Date | null;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
}

export interface VendorFilteredBody {
    businessName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    logo?: string;
}
