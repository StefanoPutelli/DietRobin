import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClientUser, createNutritionistUser, getClientUserInfoByEmail, getNutritionistUserInfoByEmail, UserRole } from "@/db/user";

declare module "next-auth" {
    interface User {
        role?: UserRole;
    }
    interface Session {
        user: {
            name: string;
            email: string;
            image?: string;
            role: UserRole;
            id: string;
        };
    }
}

const providers = [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            },
        }
    }),
];

export const authOptionsClient = NextAuth({
    providers: providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.email) {
                let userInfo = await getClientUserInfoByEmail(user.email || '');
                if(!userInfo){
                    userInfo = await createClientUser(user.email, user.name);
                }
                token.role = "client";
                token.id = userInfo.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.role)
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
            return session;
        }
    }
});

export const authOptionsNutritionist = NextAuth({
    providers: providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.email) {
                let userInfo = await getNutritionistUserInfoByEmail(user.email || '');
                if(!userInfo){
                    userInfo = await createNutritionistUser(user.email, user.name);
                }
                token.role = "nutritionist";
                token.id = userInfo.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.role)
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
            return session;
        }
    }
});

