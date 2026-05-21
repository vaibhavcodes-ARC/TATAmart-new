<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - TATAmart</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; text-align: center; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
        p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 28px 0; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; text-transform: none; letter-spacing: 0.01em; transition: background-color 0.2s; margin-bottom: 24px; }
        .btn:hover { background-color: #4338ca; }
        .divider { border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .alternative-link { font-size: 12px; color: #64748b; word-break: break-all; line-height: 1.5; }
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
                <h1>Reset Your Password</h1>
                <p>Hello,</p>
                <p>We received a request to reset your TATAmart account password. Click the button below to set up a new password.</p>
                <a href="{{ $resetUrl }}" target="_blank" class="btn">Reset Password</a>
                <p>If you did not request a password change, you can safely ignore this email; your account remains secure.</p>
                <div class="divider"></div>
                <p class="alternative-link">If the button doesn't work, copy and paste this URL into your browser: <br> <a href="{{ $resetUrl }}" style="color: #4f46e5; text-decoration: none;">{{ $resetUrl }}</a></p>
            </div>
            <div class="footer">
                <p class="footer-text">© {{ date('Y') }} TATAmart B2B Marketplace. All rights reserved.</p>
                <p class="footer-text">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
