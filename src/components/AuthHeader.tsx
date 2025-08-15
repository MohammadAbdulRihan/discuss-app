"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import { signIn } from "@/actions/sign-in";
import { signOut } from "@/actions/sign-out";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const AuthHeader =  () => {
    const session =  useSession();

    // if( session?status == 'loading' ) return null;
    if( session?.status == 'loading') return null;

    let AuthContent : React.ReactNode;
    if( !session.data?.user ){
        AuthContent = (
            <form action={signIn}>
              <Button type="submit" className="mx-2">Sign In</Button>
              <Button type='submit'>Sign Up</Button>
            </form>
        )
    }
    else {
        AuthContent = (
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <img src={session.data.user.image || ""} alt="User Avatar" className="w-8 h-8 rounded-full" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-4">
                  <p className="text-sm font-semibold">{session.data.user.name}</p>
                  <p className="text-xs text-gray-500">{session.data.user.email}</p>
                  <form action={signOut} className="mt-4">
                    <Button type="submit" variant="outline" className="w-full">Sign Out</Button>
                  </form>
                </div>
              </PopoverContent>
            </Popover>
        )
    }
  return (
    AuthContent
  )
}

export default AuthHeader
