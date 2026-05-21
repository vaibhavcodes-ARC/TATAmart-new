<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TATAmart Payment Failed</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; text-align: center; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
        .fail-banner { background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 14px; font-weight: 600; border-radius: 12px; padding: 16px; margin-bottom: 28px; }
        .grid { width: 100%; margin-bottom: 28px; border-collapse: collapse; text-align: left; }
        .grid td { font-size: 14px; padding: 10px 0; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
        .grid .label { color: #64748b; font-weight: 600; width: 40%; }
        .grid .val { color: #0f172a; font-weight: 600; text-align: right; }
        .grid tr:last-child td { border-bottom: none; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-top: 16px; margin-bottom: 24px; }
        .btn:hover { background-color: #4338ca; }
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
                <h1>Payment Attempt Failed</h1>
                <div class="fail-banner">Transaction Failed or Interrupted</div>
                <p style="font-size: 15px; line-height: 1.6; color: #475569; text-align: left; margin-bottom: 24px;">
                    We were unable to complete your payment attempt for the following order. Please review the details below and retry the checkout process.
                </p>
                
                <table class="grid">
                    <tr>
                        <td class="label">Order Reference</td>
                        <td class="val">#{{ $orderNumber }}</td>
                    </tr>
                    <tr>
                        <td class="label">Payment Status</td>
                        <td class="val" style="color: #b91c1c;">Failed</td>
                    </tr>
                    <tr>
                        <td class="label">Decline Reason</td>
                        <td class="val" style="color: #b91c1c;">{{ $reason }}</td>
                    </tr>
                    <tr>
                        <td class="label">Amount Attempted</td>
                        <td class="val">INR {{ number_format($grandTotal, 2) }}</td>
                    </tr>
                </table>

                <a href="{{ $retryUrl }}" target="_blank" class="btn">Retry Payment</a>
            </div>
            <div class="footer">
                <p class="footer-text">© {{ date('Y') }} TATAmart B2B Marketplace. All rights reserved.</p>
                <p class="footer-text">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
