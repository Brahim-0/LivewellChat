import {verifyToken} from '../auth'
import supabase from "../db"
import { NextResponse } from "next/server";
import { headers } from 'next/headers'

export async function GET(req, res) {
    try {
        // auth verification
        const authorization = headers().get('authorization')        
        if (!authorization || !authorization.startsWith('bearer ')) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }
        const token = authorization.slice(7);
        const userId = verifyToken(token);
        
        if (!userId) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
        .from('users')
        .select('*') 
        .neq('id', userId); // exclude self
        
        if (error)
            throw error;
        
        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 'Error fetching users:': error.message }, { status: 500 });
    }
}