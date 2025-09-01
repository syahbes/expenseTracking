// utils/transactionParser.ts
import { ParsedTransaction } from '@/types/transaction';

export const parseTransactionText = (text: string): ParsedTransaction => {
  const parsed: ParsedTransaction = {};

  // Remove extra whitespace and normalize
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  // Parse amount - look for currency symbols followed by numbers
  const amountPatterns = [
    /€(\d+(?:,\d{2})?)/g, // Euro format: €5,15
    /\$(\d+(?:\.\d{2})?)/g, // Dollar format: $5.15
    /£(\d+(?:\.\d{2})?)/g, // Pound format: £5.15
    /(\d+(?:[,\.]\d{2})?)(?:\s*€)/g, // Amount before euro: 5,15 €
    /(\d+(?:[,\.]\d{2})?)(?:\s*\$)/g, // Amount before dollar: 5.15 $
    /(\d+(?:[,\.]\d{2})?)(?:\s*£)/g, // Amount before pound: 5.15 £
  ];

  for (const pattern of amountPatterns) {
    const match = pattern.exec(normalizedText);
    if (match) {
      let amountStr = match[1];
      // Convert comma decimal separator to dot
      amountStr = amountStr.replace(',', '.');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
        parsed.amount = amount;
        break;
      }
    }
  }

  // Parse time - look for HH:MM format
  const timePattern = /(\d{1,2}):(\d{2})/g;
  const timeMatch = timePattern.exec(normalizedText);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = timeMatch[2];
    parsed.time = `${hours}:${minutes}`;
  }

  // Parse description - extract merchant name
  let description = '';

  // Common patterns for different bank formats
  const descriptionPatterns = [
    // "YOUR CARD *4177 WAS AUTHORISED FOR WWW RIDENOW TECH, €5,15 AT 14:42"
    /(?:AUTHORISED FOR|AUTHORIZED FOR)\s+([^,€$£]+)(?:[,€$£])/i,

    // "PAYMENT TO MERCHANT NAME"
    /PAYMENT TO\s+([^,€$£]+)(?:[,€$£])/i,

    // "POS TRANSACTION MERCHANT NAME"
    /POS TRANSACTION\s+([^,€$£]+)(?:[,€$£])/i,

    // "CARD PAYMENT MERCHANT NAME"
    /CARD PAYMENT\s+([^,€$£]+)(?:[,€$£])/i,

    // Generic fallback - text between common keywords
    /(?:FOR|TO)\s+([A-Z\s\w]+?)(?:\s*[,€$£]|\s+\d)/i,
  ];

  for (const pattern of descriptionPatterns) {
    const match = pattern.exec(normalizedText);
    if (match) {
      description = match[1].trim();
      // Clean up common prefixes/suffixes
      description = description
        .replace(/^WWW\s+/i, '')
        .replace(/\s+TECH$/i, '')
        .replace(/\s+LTD$/i, '')
        .replace(/\s+INC$/i, '')
        .trim();
      break;
    }
  }

  // If no specific pattern matched, try to extract a reasonable description
  if (!description) {
    // Remove card numbers, amounts, times, and common banking terms
    let cleanText = normalizedText
      .replace(/YOUR CARD \*\d+/gi, '')
      .replace(/WAS AUTHORISED FOR/gi, '')
      .replace(/WAS AUTHORIZED FOR/gi, '')
      .replace(/€\d+(?:,\d{2})?/g, '')
      .replace(/\$\d+(?:\.\d{2})?/g, '')
      .replace(/£\d+(?:\.\d{2})?/g, '')
      .replace(/\d+(?:[,\.]\d{2})?\s*[€$£]/g, '')
      .replace(/AT \d{1,2}:\d{2}/gi, '')
      .replace(/\d{1,2}:\d{2}/g, '')
      .trim();

    if (cleanText) {
      description = cleanText.substring(0, 50); // Limit length
    }
  }

  if (description) {
    parsed.description = description;
  }

  return parsed;
};
