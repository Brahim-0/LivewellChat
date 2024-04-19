import { verifyToken } from '../auth';
import supabase from '../db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers'

export async function POST(req) {
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

        // Get the user IDs from the request query or parameters
        const { userId1, userId2 } = await req.json();
        console.log(userId1)
        console.log(userId2)

        // Determine the correct order of user IDs
        const [smallerUserId, largerUserId] = [userId1, userId2].sort();

        // Retrieve the conversation from the database
        const { data: existingConversation, error } = await supabase
        .from('conversations')
        .select('id, conversation')
        .eq('user_id1', smallerUserId)
        .eq('user_id2', largerUserId)
        .single();


        if (existingConversation) {
            // Conversation already exists, do something with it
            return NextResponse.json({ conversation: existingConversation.conversation, conversationId:existingConversation.id }, { status: 200 });
        } else {
        // Conversation doesn't exist, create a new record
        const { data: newConversation, error: creationError } = await supabase
            .from('conversations')
            .insert([{ user_id1: smallerUserId, user_id2: largerUserId, conversation: "[]" }]).select();

        if (creationError) {
            return NextResponse.json({ 'Error fetching conversation:': error.message }, { status: 500 });
        } else {
            return NextResponse.json({ conversation: newConversation[0].conversation, conversationId:newConversation[0].id }, { status: 200 });

        }
        
        }

    } catch (error) {
    
        return NextResponse.json({ 'Error fetching conversation:': error.message }, { status: 500 });
    }
}
