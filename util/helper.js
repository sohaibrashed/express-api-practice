const crypto = require("crypto");

// Email templates
exports.createEmailVerificationTemplate = (verificationUrl) => {
  return {
    subject: "Verify Your Email Address - Clothify",
    text: `Welcome to Clothify! Please verify your email address by clicking on the following link: ${verificationUrl}`,
    html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Welcome to Clothify!</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; 
                      text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Verify Email Address
            </a>
            <p>If the button doesn't work, you can also click this link:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
  };
};

exports.createPasswordResetTemplate = (resetUrl) => {
  return {
    subject: "Password Reset Request - Clothify",
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to continue:</p>
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; 
                      text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Reset Password
            </a>
            <p>If the button doesn't work, you can also click this link:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
          </div>
        `,
  };
};

exports.EmailVerificationSuccess = () => {
  return {
    subject: "Password Reset Request - Clothify",
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    html: `
              <div>
      <h2>
        Email Verified Successfully!
      </h2>
      <p>
        Your email has been verified. You can now use all features of your
        account.
      </p>
      <a
        href="/login"
      >
        Continue to Login
      </a>
    </div>
            `,
  };
};

// Generate verification token
exports.generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
};
