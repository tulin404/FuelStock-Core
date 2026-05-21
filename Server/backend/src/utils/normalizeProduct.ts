export default function normalizeProduct(productName: string): string {
    return productName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "")
        .trim()
        .toLowerCase();
};