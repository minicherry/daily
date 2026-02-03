import { Resend } from 'resend';
import { NextResponse } from 'next/server';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email } = await request.json();
        const { error: createError } = await resend.contacts.create({
            email: email,
        });

        if (createError) {
            // If the contact already exists, we can still try to add them to the segment
            if (createError.message && createError.message.includes('already exists')) {
                console.log('Contact already exists, proceeding to segment check.');
            } else {
                console.error('Resend create contact error:', createError);
                return NextResponse.json({ error: createError.message || 'Failed to create contact' }, { status: 500 });
            }
        }

        const { error: segmentError } = await resend.contacts.segments.add({
            email: email,
            segmentId: "d9e05414-2fae-466a-82b0-9891e38ef7c8",
        });

        if (segmentError) {
            console.error('Resend add to segment error:', segmentError);
            return NextResponse.json({ error: segmentError.message || 'Failed to add contact to segment' }, { status: 500 });
        }

        return NextResponse.json({ message: 'OK' }, { status: 200 });
    } catch (error) {
        console.error('Subscribe API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}