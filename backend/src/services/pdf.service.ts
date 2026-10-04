import { PDFParse } from "pdf-parse";

export const extractPdfText = async (buffer: Buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });
  const parsedPdf = await parser.getText();
  await parser.destroy();
  return parsedPdf;
};
