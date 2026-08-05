import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, message, userEmail, pageUrl } = await request.json();

    // Basic validation
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Feedback <onboarding@resend.dev>', // Default testing domain provided by Resend
      to: [process.env.MY_NOTIFICATION_EMAIL!],
      replyTo: userEmail || undefined, // Allows you to hit "Reply" in your email client to talk to the user
      subject: `[App Feedback] New ${type || 'Report'} Received`,
      html: `
        <h2>New ${type || 'Feedback'} Submitted</h2>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #00f58d;">
          ${message}
        </blockquote>
        <p><strong>User Email:</strong> ${userEmail || 'Anonymous / Not provided'}</p>
        <p><strong>Page URL:</strong> ${pageUrl || 'Not provided'}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}