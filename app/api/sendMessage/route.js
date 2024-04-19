import { verifyToken } from '../auth';
import supabase from '../db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req) {
    try {
        // Auth verification
        const authorization = headers().get('authorization');
        if (!authorization || !authorization.startsWith('bearer ')) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }
        const token = authorization.slice(7);
        const userId = verifyToken(token);

        if (!userId) {
            return NextResponse.json({ "message": "Unauthorized" }, { status: 401 });
        }

        // Get the user IDs and updated conversation data from the request
        const { conversationId, updatedConversation } = await req.json();
        console.log(updatedConversation);
        console.log(conversationId);

        // Update the conversation in the database
        const { data: updatedData, error: updateError } = await supabase
            .from('conversations')
            .update({ conversation: updatedConversation })
            .eq('id', conversationId)
            .single().select();

        console.log(updatedData)
        console.log("error", updateError)

        if (updateError) {
            console.log("oops")
            throw updateError;
        }        

        return NextResponse.json({ conversation: updatedData.conversation, conversationId:updatedData.id }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 'Error updating conversation:': error.message }, { status: 500 });
    }
}
