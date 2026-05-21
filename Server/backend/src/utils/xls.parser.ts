import * as XLSX from "xlsx";
import type { DailyParseResult, RawStockProduct } from "../types/types.js";
import { normalizeDailyRow, normalizeStockRow } from "./normalizeRow.js";

export function parseDailyXls(buffer: Buffer): DailyParseResult {
    const workbook = XLSX.read(buffer, { type: "buffer", WTF: false });

    const sheetName = workbook.SheetNames[0];

    // TS CHECK
    if (!sheetName) {
        throw new Error("Arquivo Excel sem abas");
    };

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        throw new Error("Planilha inválida");
    };

    const rawData = XLSX.utils.sheet_to_json<(string | null)[]>(sheet, {
        header: 1,
        defval: null,
        blankrows: false
    });
    
    const notNullData = rawData.map(row => row.filter(item => item !== null));

    const sumIndex = notNullData.findIndex(row => row[0] === "Resumo");
    const slicedData = notNullData.slice(0, sumIndex);

    const tenantName = notNullData?.[0]?.[0] ?? "Sem tenantName";
    const productData = slicedData.filter(row => row.length > 8).map(row => normalizeDailyRow(row));


    return { data: { tenantName, productData } };
};

export function parseStockXls(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer", WTF: false });

    const sheetName = workbook.SheetNames[0];

    // TS CHECK
    if (!sheetName) {
        throw new Error("Arquivo Excel sem abas");
    };

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        throw new Error("Planilha inválida");
    };

    const rawData = XLSX.utils.sheet_to_json<RawStockProduct>(sheet, {
        defval: null,
        blankrows: false
    });

    const normalized = rawData.map(row => normalizeStockRow(row));
    
    return normalized;
};