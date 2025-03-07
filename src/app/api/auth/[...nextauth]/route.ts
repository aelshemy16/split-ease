import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth.js API route for handling authentication
 * This handles all authentication flows such as sign in, sign out, 
 * callbacks, and session management
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 