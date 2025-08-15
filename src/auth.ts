import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib";
import { NextAuthConfig } from 'next-auth';
import NextAuth from "next-auth";
import  GitHubProvider  from "next-auth/providers/github";


const authOptions : NextAuthConfig = {

    adapter : PrismaAdapter(prisma),
    providers : [
        GitHubProvider({
            clientId : process.env.GITHUB_CLIENT_ID as string,
            clientSecret : process.env.GITHUB_CLIENT_SECRET as string
        }),
        // GoogleProvider({
        //     clientId : process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GooGLE_CLIENT_SECRET as string
        // })
    ],

    // once a user is authenticated,this will be called
    callbacks : {
        async session({user , session}){
            if( session && user)
                session.user.id = user.id;
            return session;
        }
    }
}


export const { handlers:{GET, POST} , auth , signIn , signOut} = NextAuth(authOptions);

