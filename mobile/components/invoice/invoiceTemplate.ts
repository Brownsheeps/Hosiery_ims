import { InvoiceRowData } from "@/components/invoice/InvoiceRow";

interface InvoiceTemplateProps {
    rows: InvoiceRowData[];
    grandTotal: number;
}

export function generateInvoiceHtml({
    rows,
    grandTotal,
}: InvoiceTemplateProps) {
    const today = new Date().toLocaleDateString();

    const tableRows = rows
        .map(
            (row) => `
      <tr>
        <td>${row.product?.productName ?? "-"}</td>
        <td>${row.quantity}</td>
        <td>${row.rate}</td>
        <td>${row.total}</td>
      </tr>
    `
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html>

        <head>

            <style>

            body{
            font-family:Arial,sans-serif;
            padding:30px;
            }

            h1{
            text-align:center;
            margin-bottom:30px;
            }

            .date{
            margin-bottom:20px;
            font-size:15px;
            }

            table{
            width:100%;
            border-collapse:collapse;
            }

            th,td{
            border:1px solid #000;
            padding:10px;
            text-align:center;
            }

            th{
            background:#f3f4f6;
            }

            tfoot td{
            font-weight:bold;
            }

            </style>

        </head>

    <body>

    <h1>Order Estimate</h1>

    <p class="date">
    Date: ${today}
    </p>

        <table>

            <thead>
            <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            </tr>
            </thead>

        <tbody>

        ${tableRows}

        </tbody>

        <tfoot>

            <tr>
                <td colspan="3">
                Total
                </td>

                <td>
                ${grandTotal}
                </td>

            </tr>

        </tfoot>

        </table>

    </body>

    </html>
`;
}