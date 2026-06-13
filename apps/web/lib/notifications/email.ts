async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.info("[pawbase] email skipped; RESEND_API_KEY or EMAIL_FROM is not configured", {
      to: opts.to,
      subject: opts.subject
    });
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html
    })
  });

  if (!response.ok) {
    throw new Error(`Email send failed: ${response.status}`);
  }

  return response.json();
}

export async function sendPasswordResetEmail(opts: { to: string; name: string; resetUrl: string }) {
  return sendEmail({
    to: opts.to,
    subject: "Reset your PawBase password",
    html: `
      <h2>Hi ${opts.name},</h2>
      <p>Click below to reset your password. This link expires in 1 hour.</p>
      <a href="${opts.resetUrl}" style="background:#059669;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    `
  });
}

export async function sendWelcomeEmail(opts: { to: string; name: string; tempPassword: string }) {
  return sendEmail({
    to: opts.to,
    subject: "Welcome to PawBase",
    html: `
      <h2>Welcome, ${opts.name}!</h2>
      <p>Your PawBase account has been created.</p>
      <p><strong>Email:</strong> ${opts.to}</p>
      <p><strong>Temporary password:</strong> <code>${opts.tempPassword}</code></p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}/login">Sign in to PawBase</a>
    `
  });
}
