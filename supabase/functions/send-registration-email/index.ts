
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  parentEmail: string;
  parentName: string;
  childName: string;
  registrationId: string;
  preferredBatch: string;
  registrationSummary: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { parentEmail, parentName, childName, registrationId, preferredBatch, registrationSummary }: EmailPayload = await req.json();
    
    console.log(`Sending email to ${parentEmail} for registration ${registrationId}`);

    // Check if API key is available
    if (!Deno.env.get("RESEND_API_KEY")) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // 1. Send confirmation to the parent
    const parentEmailResponse = await resend.emails.send({
      from: "Summer Robotics Program <noreply@resend.dev>",
      to: [parentEmail],
      subject: `Registration Confirmation #${registrationId} - Summer Robotics Program`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #0A4B78;">Registration Confirmation</h2>
          <p>Dear ${parentName},</p>
          <p>Thank you for registering ${childName} for our Summer Robotics Program!</p>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Preferred Batch:</strong> ${preferredBatch}</p>
          
          <h3 style="color: #0A4B78; margin-top: 20px;">Registration Details:</h3>
          <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${registrationSummary}</pre>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f0f7ff; border-radius: 5px;">
            <h3 style="color: #0A4B78; margin-top: 0;">Payment Information:</h3>
            <p>Payment options include Zelle, Cheque, or Cash.</p>
            <p><em>Please include your child's name and registration ID in the payment reference/memo.</em></p>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Summer Robotics Program Team</p>
        </div>
      `,
    });

    console.log("Parent email response:", parentEmailResponse);

    if (parentEmailResponse.error) {
      console.error("Error sending parent email:", parentEmailResponse.error);
      throw new Error(`Failed to send parent email: ${parentEmailResponse.error.message}`);
    }

    // 2. Send notification to the admin
    const adminEmailResponse = await resend.emails.send({
      from: "Summer Robotics Program <noreply@resend.dev>",
      to: ["billoreavinash12@gmail.com"],
      subject: `New Registration Alert: ${childName} (ID: ${registrationId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #0A4B78;">New Registration Alert</h2>
          <p>A new registration has been submitted:</p>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Parent:</strong> ${parentName} (${parentEmail})</p>
          <p><strong>Child:</strong> ${childName}</p>
          <p><strong>Preferred Batch:</strong> ${preferredBatch}</p>
          
          <h3 style="color: #0A4B78; margin-top: 20px;">Registration Details:</h3>
          <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${registrationSummary}</pre>
          
          <p style="margin-top: 30px;">View this registration in the admin dashboard.</p>
        </div>
      `,
    });

    console.log("Admin email response:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("Error sending admin email:", adminEmailResponse.error);
      // Don't throw here - parent email was successful, admin email is secondary
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        parentEmailId: parentEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
        message: "Emails sent successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error sending registration email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email",
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
