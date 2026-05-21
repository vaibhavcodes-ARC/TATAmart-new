<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New TATAmart RFQ Alert</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; text-align: center; }
        .alert-banner { background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-size: 14px; font-weight: 600; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 28px; }
        .grid { width: 100%; margin-bottom: 28px; border-collapse: collapse; }
        .grid td { font-size: 14px; padding: 10px 0; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
        .grid .label { color: #64748b; font-weight: 600; width: 35%; }
        .grid .val { color: #0f172a; font-weight: 600; }
        .grid tr:last-child td { border-bottom: none; }
        .btn-center { text-align: center; margin-top: 24px; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: background-color 0.2s; }
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
                <h1>New Sourcing Opportunity</h1>
                <div class="alert-banner">Matching RFQ Category Detected</div>
                <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    Hello Partner, <br><br>
                    A buyer has created a new Request for Quote (RFQ) that matches your business product category. Review the requirements below to submit your quote.
                </p>
                
                <table class="grid">
                    <tr>
                        <td class="label">Product Name</td>
                        <td class="val">{{ $productName }}</td>
                    </tr>
                    <tr>
                        <td class="label">Quantity Required</td>
                        <td class="val">{{ $quantity }} {{ $unit }}</td>
                    </tr>
                    <tr>
                        <td class="label">Target Unit Price</td>
                        <td class="val">INR {{ number_format($expectedPrice, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Description</td>
                        <td class="val" style="font-weight: normal; color: #475569;">{{ $description }}</td>
                    </tr>
                </table>

                <div class="btn-center">
                    <a href="{{ $marketplaceUrl }}" target="_blank" class="btn">Submit Quote</a>
                </div>
            </div>
            <div class="footer">
                <p class="footer-text">© {{ date('Y') }} TATAmart B2B Marketplace. All rights reserved.</p>
                <p class="footer-text">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
