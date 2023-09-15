import { isNumber, isValidDate } from "./lib.js";

export function getSearchedContents(contents: any[], searchTerm: string) {

    if (!searchTerm) return contents;

    const filtered = [];

    for (const content of contents) {

        for (const key in content) {

            const value = content[key];

            if (value.includes(searchTerm)) {
                filtered.push(content);
                break;
            }

        }
    }

    return filtered;

}


export function getSortedContents(contents: any[], sortColumnName: string | null, sortOrder: 'asc' | 'desc') {

    if (!sortColumnName || sortColumnName === '#') return contents;


    contents.sort((first, second) => {

        const order = sortOrder === 'asc' ? 1 : -1;

        let firstValue = first[sortColumnName!];
        let secondValue = second[sortColumnName!];

        if (isNumber(firstValue)) {
            firstValue = Number(firstValue);
            secondValue = Number(secondValue);
        }

        if (isValidDate(firstValue)) {
            firstValue = new Date(firstValue);
            secondValue = new Date(secondValue);
        }


        const sortValue = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;

        return sortValue * order;

    });

    return contents;


}


export function getPagedContents(contents: any[], pageNo: number, dataPerPage: number) {

    const startIndex = (pageNo - 1) * dataPerPage;
    const endIndex = Math.min(startIndex + dataPerPage - 1, contents.length - 1);

    const pagedContents = [];

    for (let i = startIndex; i <= endIndex; i++) {
        pagedContents.push(contents[i]);
    }

    return pagedContents;

}
