<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your TATAmart Order Confirmation</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center; }
        .success-banner { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 14px; font-weight: 600; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 28px; }
        .grid { width: 100%; margin-bottom: 28px; border-collapse: collapse; }
        .grid td { font-size: 14px; padding: 10px 0; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
        .grid .label { color: #64748b; font-weight: 600; width: 40%; }
        .grid .val { color: #0f172a; font-weight: 600; text-align: right; }
        .grid tr:last-child td { border-bottom: none; }
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
                <h1>Order Confirmed</h1>
                <div class="success-banner">Payment Received Successfully</div>
                <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    Thank you for your order. Your payment has been verified, and we are preparing your order for shipment. Below are the order summary details.
                </p>
                
                <table class="grid">
                    <tr>
                        <td class="label">Order Number</td>
                        <td class="val">#{{ $orderNumber }}</td>
                    </tr>
                    <tr>
                        <td class="label">Payment Status</td>
                        <td class="val" style="color: #166534;">Paid</td>
                    </tr>
                    <tr>
                        <td class="label">Invoice Number</td>
                        <td class="val">#{{ $invoiceNumber }}</td>
                    </tr>
                    @if(!empty($gstin))
                    <tr>
                        <td class="label">GSTIN</td>
                        <td class="val">{{ $gstin }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td class="label">Shipping Address</td>
                        <td class="val" style="font-size: 13px; color: #475569; font-weight: normal;">{{ $shippingAddress }}</td>
                    </tr>
                    <tr>
                        <td class="label" style="font-size: 16px; color: #4f46e5; padding-top: 16px;">Grand Total</td>
                        <td class="val" style="color: #4f46e5; font-size: 18px; padding-top: 16px;">INR {{ number_format($grandTotal, 2) }}</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p class="footer-text">© {{ date('Y') }} TATAmart B2B Marketplace. All rights reserved.</p>
                <p class="footer-text">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
