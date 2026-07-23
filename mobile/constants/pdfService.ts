import * as Print from "expo-print";
import * as Sharing from "expo-sharing";


console.log("print", Print );
export async function exportPdf(html: string) {
  const { uri } = await Print.printToFileAsync({
    html,
  });

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Invoice",
    UTI: ".pdf",
  });
}