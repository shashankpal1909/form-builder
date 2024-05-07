import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const link = `${domain}/reset-password?token=${token}`;

  const info = transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Reset your password",
    html: generateEmailHTML(`
      <div class="content">
        <h2>Password Reset</h2>
        <p>Dear ${name},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <p><a href="${link}" class="button">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you!</p>
      </div>
    `),
  });

  console.log("email sent!", info);
};

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const link = `${domain}/verify?token=${token}`;

  const info = await transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Confirm your email",
    html: generateEmailHTML(
      `
        <div class="content">
          <h2>Email Verification</h2>
          <p>Dear ${name},</p>
          <p>To complete the email verification process, please click on the following link: <a href="${link}">Verify Email</a></p>
          <p>If you encounter any issues, please don't hesitate to contact our support team.</p>
          <p>Thank you for using FormBuilderPro!</p>
        </div>
      `
    ),
  });

  console.log("email sent!", info);
};

export const sendSubscriptionPurchaseConfirmationEmail = (
  name: string,
  email: string,
  subscription: {
    status: string;
    plan: string;
    stripeInvoiceId: string;
    stripeSubscriptionId: string;
    startDate: Date;
    endDate: Date;
  }
) => {
  const info = transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Subscription Purchase Confirmation",
    html: generateEmailHTML(`
      <div class="content">
        <h2>Subscription Purchase Confirmation</h2>
        <div class="details">
          <p>Dear ${name},</p>
          <p>We are delighted to confirm that your subscription purchase was successful. Below are the details of your subscription:</p>
          <ul>
            <li><strong>Subscription Plan:</strong> ${subscription.plan}</li>
            <li><strong>Subscription Status:</strong> ${
              subscription.status
            }</li>
            <li><strong>Start Date:</strong> ${subscription.startDate.toLocaleDateString()}</li>
            <li><strong>End Date:</strong> ${subscription.endDate.toLocaleDateString()}</li>
            <li><strong>Invoice ID:</strong> ${
              subscription.stripeInvoiceId
            }</li>
            <li><strong>Subscription ID:</strong> ${
              subscription.stripeSubscriptionId
            }</li>
          </ul>
        </div>
        <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
        <p>Thank you for choosing us!</p>
      </div>
    `),
  });

  console.log("email sent!", info);
};

const generateEmailHTML = (body: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FormBuilderPro Email Notification</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; background-color: #ffffff; margin: 0; padding: 0; color: #000000;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div class="logo" style="text-align: center; margin-bottom: 20px;">
              <div class="logo-text" style="font-size: 24px; font-weight: bold; color: #000000;">FormBuilderPro</div>
          </div>
          <hr style="border-top: 2px solid #000000; margin-bottom: 20px;">
          ${body}
          <hr style="border-top: 2px solid #000000; margin-bottom: 20px;">
          <div class="footer" style="text-align: center; font-size: 12px; color: #999999;">
              This email was sent by FormBuilderPro. If you have any questions, please contact us at formbuilderpro@gmail.com
          </div>
      </div>
  </body>
  </html>
  `;
};
