import { isNumber, isValidDate } from "./lib.js";

// This method traverses through each record. A record will be filtered
// if any of it's attributes includes the given search term. If no search 
// term is given, it returns the original contents. If no matches are found
// it returns an empty array. 
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

// This method sorts the given contents based on the given column and given order
// If column data is of number type, it coerces each data to number and then performs
// sorting. Coercion happens for strings which are parsable to number or date. Otherwise
// all data are treated as string and the string based sorting occurs. This method changes
// the input array.
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

// This method takes the contents, the current page number and number of data per page
// as input. It outputs the data which pertains to the current page number
export function getPagedContents(contents: any[], pageNo: number, dataPerPage: number) {

    const startIndex = (pageNo - 1) * dataPerPage;
    const endIndex = Math.min(startIndex + dataPerPage - 1, contents.length - 1);

    const pagedContents = [];

    for (let i = startIndex; i <= endIndex; i++) {
        pagedContents.push(contents[i]);
    }

    return pagedContents;

}
