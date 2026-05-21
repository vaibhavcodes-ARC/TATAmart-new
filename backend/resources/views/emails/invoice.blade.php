<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TATAmart Tax Invoice</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin: 0; text-transform: uppercase; }
        .logo span { color: #6366f1; }
        .body { padding: 40px 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 24px 0; text-align: center; }
        .meta-table { width: 100%; margin-bottom: 24px; border-collapse: collapse; }
        .meta-table td { font-size: 13px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .meta-table .label { color: #64748b; font-weight: 600; }
        .meta-table .val { color: #0f172a; font-weight: 600; text-align: right; }
        .meta-table tr:last-child td { border-bottom: none; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; margin-top: 16px; }
        .items-table th { background-color: #f8fafc; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        .items-table td { font-size: 13px; padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .items-table .totals-row td { border-bottom: none; font-weight: 600; font-size: 13px; padding: 6px 12px; text-align: right; color: #475569; }
        .btn-center { text-align: center; margin-top: 24px; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: background-color 0.2s; }
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
                <h1>Tax Invoice</h1>
                
                <table class="meta-table">
                    <tr>
                        <td class="label">Invoice Number</td>
                        <td class="val">#{{ $invoiceNumber }}</td>
                    </tr>
                    <tr>
                        <td class="label">Order Reference</td>
                        <td class="val">#{{ $orderNumber }}</td>
                    </tr>
                    @if(!empty($gstin))
                    <tr>
                        <td class="label">GSTIN</td>
                        <td class="val">{{ $gstin }}</td>
                    </tr>
                    @endif
                </table>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($items as $item)
                        <tr>
                            <td>{{ $item['product_name'] }}</td>
                            <td style="text-align: center;">{{ $item['quantity'] }}</td>
                            <td style="text-align: right;">INR {{ number_format($item['price'], 2) }}</td>
                            <td style="text-align: right;">INR {{ number_format($item['total'], 2) }}</td>
                        </tr>
                        @endforeach
                        
                        <tr class="totals-row" style="padding-top: 16px;">
                            <td colspan="3">Subtotal:</td>
                            <td>INR {{ number_format($financials['subtotal'], 2) }}</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3">CGST (9%):</td>
                            <td>INR {{ number_format($financials['cgst'], 2) }}</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3">SGST (9%):</td>
                            <td>INR {{ number_format($financials['sgst'], 2) }}</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3">Shipping Fee:</td>
                            <td>INR {{ number_format($financials['shipping_cost'], 2) }}</td>
                        </tr>
                        <tr class="totals-row" style="font-size: 15px; font-weight: 700; color: #4f46e5;">
                            <td colspan="3" style="color: #4f46e5;">Total Amount Paid:</td>
                            <td>INR {{ number_format($financials['grand_total'], 2) }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="btn-center">
                    <a href="{{ $downloadUrl }}" target="_blank" class="btn">Download PDF Copy</a>
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
