<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your TATAmart Account</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; text-align: center; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
        p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
        .otp-box { display: inline-block; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 32px; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; margin-bottom: 24px; text-indent: 8px; }
        .expiry { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer { background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">TATA<span>mart</span></div>
            </div>
            <div class="body">
                <h1>Verify Your Email Address</h1>
                <p>Hello {{ $name }},</p>
                <p>Thank you for signing up with TATAmart. Please use the verification code below to verify your email address and activate your account.</p>
                <div class="otp-box">{{ $otpCode }}</div>
                <div class="expiry">This verification code will expire in 30 minutes.</div>
            </div>
            <div class="footer">
                <p class="footer-text">© {{ date('Y') }} TATAmart B2B Marketplace. All rights reserved.</p>
                <p class="footer-text">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
