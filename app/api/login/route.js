import { NextResponse } from "next/server";
import supabase from "../db"
const bcrypt = require('bcryptjs');
import {generateToken} from "../auth"


// Login API endpoint
export async function POST(req, res) {

    const { email, password } = await req.json();
    console.log(email)
    console.log(password)

    try {
        // Query user by email
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return NextResponse.json({msg: error.message}, { status: 401 });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, data.password);
        if (!passwordMatch) {
            return NextResponse.json({msg:"fuck2"}, { status: 401 });
        }

        // Generate JWT token
        const token = generateToken(data.id);

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error signing in user:', error);
        return NextResponse.json({msg:"fuck"}, { status: 500 });
        
    }
}

export async function GET(req, res) {
    return NextResponse.json({msg:"fuck"})
}