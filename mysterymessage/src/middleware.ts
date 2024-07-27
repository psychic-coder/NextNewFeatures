import { NextRequest, NextResponse } from 'next/server';
export { default } from "next-auth/middleware"

//this method is used to get the access to the token wherever we want from nextauth
import { getToken } from "next-auth/jwt"


 
// This function can be marked `async` if using `await` inside
// This is a middleware setup
export async function middleware(request: NextRequest) {

    const token =await getToken({req:request})
    const url=request.nextUrl;
    //if we have the token and the url we're going towards is signin then we'll be redirected to dashboard as we're already signedin
    if(token && (
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign-up')||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }


  return NextResponse.redirect(new URL('/home', request.url))
}
 

//the below are the paths where we want out middleware to run
// "/dashboard/:path*"--->this signifies all the paths of the dashboard
export const config = {
  matcher: ['/sign-in','/sign-up','/','/dashboard/:path*','/verify/:path*']
}

