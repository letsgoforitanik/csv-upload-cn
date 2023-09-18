import { CSV } from "@/models";
import { success } from "@/helpers";

export async function addCsv(fileName: string, contents: object[]) {
    const result = await CSV.create({ fileName, contents });
    return success(result);
}

export async function getAllCsv() {
    const csvList = await CSV.find().sort('-createdAt');
    return success(csvList);
}

export async function getCsv(id: string) {
    const csv = await CSV.findById(id);
    return success(csv);
}

export async function deleteCsv(id: string) {
    await CSV.findByIdAndDelete(id);
    return success(null);
}