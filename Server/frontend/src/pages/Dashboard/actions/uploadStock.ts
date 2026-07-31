import { StockService } from "@/services/stock.service";
import { ApiError } from "@/utils/ApiError";

export function uploadStock(formData: FormData) {
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
        // JUST IN CASE
        // FAKE API ERROR
        throw new ApiError("Arquivo ausente", "Por favor, envie um aquivo .xls");
    };

    const mimetypesXls = [
        'application/vnd.ms-excel',
        'application/msexcel',
        'application/x-msexcel',
        'application/x-ms-excel',
        'application/x-excel',
        'application/x-dos_ms_excel',
        'application/xls',
        'text/xls'
    ];

    if (!mimetypesXls.includes(file.type)) {
        throw new ApiError("Por favor, envie um arquivo .xls", "Formato inválido");
    };

    return StockService.refillStock(formData);
};