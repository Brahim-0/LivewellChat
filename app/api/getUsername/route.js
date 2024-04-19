import { verifyToken } from '../auth';
import supabase from '../db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req) {
    try {
        // Authorization verification
        const authorization = headers().get('authorization');
        if (!authorization || !authorization.startsWith('bearer ')) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }
        const token = authorization.slice(7);
        const userId = verifyToken(token);
        
        if (!userId) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }

        // Fetch the username from the users table
        const { data: user, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', userId)
            .single();

        if (error) {
            return NextResponse.json({ 'Error fetching username:': error.message }, { status: 500 });
        } else {
            if (user) {
                return NextResponse.json({ username: user.username }, { status: 200 });
            } else {
                return NextResponse.json({ "message": "User not found" }, { status: 404 });
            }
        }
    } catch (error) {
        return NextResponse.json({ 'Error fetching username:': error.message }, { status: 500 });
    }
}