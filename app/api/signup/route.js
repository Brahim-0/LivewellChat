import supabase from "../db"
import { NextResponse } from "next/server";
import {hashPassword, generateToken} from "../auth"

// Signup API endpoint
export async function POST(req, res) {
    const { email, password, role, username } = await req.json();

    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert user into Supabase 'users' table
        const { data, error } = await supabase
            .from('users')
            .upsert([{ email: email, password: hashedPassword, role: role, username:username }])
            .select();

        if (error)
            throw error;

        // Generate JWT token
        const token = await generateToken(data[0].id);

        return NextResponse.json({token})

    } catch (error) {
        return NextResponse.json({ error: error.message })
    }
}