const heading = document.querySelector('#heading')! as HTMLElement;
const tableCsvContent = document.querySelector('#csv-content')! as HTMLTableElement;
const ulPaging = document.querySelector('.pagination')! as HTMLUListElement;
const canvas = document.querySelector('#canvas')! as HTMLCanvasElement;
const divModal = document.querySelector('#modalCharting')! as HTMLDivElement;
const modalTitle = divModal.querySelector('.modal-title')! as HTMLHeadingElement;
const pNote = document.querySelector('#note')! as HTMLParagraphElement;

const modal = new bootstrap.Modal(divModal, { keyboard: false });

declare var csvFileId: string;
declare var bootstrap: any;
declare var Chart: any;

const dataPerPage = 10;

let contents: any[] = [];
let searchTerm: string = '';
let pageNo: number = 1;
let sortColumnName: string | null = null;
let sortOrder: 'asc' | 'desc' = 'asc';

/////////////////////////////////////////////////

// charting function 

function handleCharting(columnName: string) {

    const columnData = contents.map(content => content[columnName]);

    const map: { [key: string]: number } = {};

    for (let d of columnData) {
        if (!map[d]) map[d] = 1;
        else map[d]++;
    }

    const keys = [];
    const values = [];

    for (let key in map) {
        keys.push(key);
        values.push(map[key] / columnData.length * 100);
    }

    const data = {
        labels: keys,
        datasets: [{ data: values }]
    };

    const options = { responsive: true, maintainAspectRatio: false };

    const ctx = canvas.getContext("2d");

    const pieChart = new Chart(ctx, { type: 'pie', data, options });

    modalTitle.innerText = `${columnName} Pie Chart`;

    divModal.addEventListener('hidden.bs.modal', closeModal);

    function closeModal() {
        divModal.removeEventListener('hidden.bs.modal', closeModal);
        pieChart.destroy();
    }


    modal.show();

}


// html generator functions

function setPaging(dataLength: number) {

    const noOfPages = Math.ceil(dataLength / dataPerPage);

    let liHtml = '';

    for (let i = 1; i <= noOfPages; i++) {
        liHtml += `<li class="page-item ${i === pageNo ? 'active' : ''}">
                        <a class="page-link" href="#">${i}</a>
                    </li>`;
    }

    const html = `  <li class="page-item">
                        <a class="page-link" href="#">Previous</a>
                    </li>
                    ${liHtml}
                    <li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>`;

    ulPaging.innerHTML = html;
    ulPaging.querySelectorAll('li a').forEach((a: any) => a.onclick = handlePaging);

    function handlePaging(event: Event) {
        const anchor = event.target as HTMLAnchorElement;
        const anchorText = anchor.innerText;

        if (anchorText === 'Previous') pageNo > 1 && pageNo--;
        else if (anchorText === 'Next') pageNo < noOfPages && pageNo++;
        else pageNo = Number(anchorText);

        renderTable();
    }

}


function setHeading(fileName: string) {

    heading.classList.add('d-flex', 'justify-content-between');

    const html = `  <strong>File Content : ${fileName}</strong>                    
                    <div id="search-bar" class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </div>`;

    heading.innerHTML = html;

    pNote.innerText = 'Double click on any table header to view pie chart';

    const txtSearch = heading.querySelector('input')!;

    txtSearch.onchange = function () {
        searchTerm = txtSearch.value;
        pageNo = 1;
        sortColumnName = null;
        sortOrder = 'asc';
        renderTable();
    }

}


// filter functions

function getPagedContents(contents: any[]) {
    const startIndex = (pageNo - 1) * dataPerPage;
    const endIndex = Math.min(startIndex + dataPerPage - 1, contents.length - 1);

    const pagedContents = [];

    for (let i = startIndex; i <= endIndex; i++) {
        pagedContents.push(contents[i]);
    }

    return pagedContents;
}


function getSearchedContents(contents: any[]) {

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


function getSortedContents(contents: any[]) {

    if (!sortColumnName || sortColumnName === '#') return contents;

    contents.sort((first, second) => {

        const order = sortOrder === 'asc' ? 1 : -1;

        const firstValue = first[sortColumnName!];
        const secondValue = second[sortColumnName!];

        if (!isNaN(firstValue)) {
            const firstNumber = Number(firstValue);
            const secondNumber = Number(secondValue);
            return firstNumber - secondNumber * order;
        }

        const sortValue = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;

        return sortValue * order;

    });

    return contents;


}

// render function

function renderTable() {

    tableCsvContent.innerHTML = '';

    // table head =============================================

    const tHead = document.createElement('thead');
    const tr = document.createElement('tr');

    tHead.appendChild(tr);

    let thString = '<th scope="col">#</th>';

    for (const key in contents[0]) {
        thString += `<th scope="col" class="${sortColumnName !== key ? '' : sortOrder}" >${key}</th>`;
    }

    tr.innerHTML = thString;

    let clickCount = 0, timeoutId: any = null;

    tr.querySelectorAll('th').forEach((th: any) => th.onclick = () => {
        clickCount++;
        timeoutId && clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            timeoutId = null;
            let count = clickCount;
            clickCount = 0;

            if (count === 1) handleSorting(th.innerText);
            else handleCharting(th.innerText);


        }, 500);
    });


    function handleSorting(columnName: string) {

        if (sortColumnName !== columnName) {
            sortColumnName = columnName;
            sortOrder = 'asc';
        }
        else {
            if (sortOrder === 'asc') sortOrder = 'desc';
            else sortOrder = 'asc';
        }

        renderTable();

    }

    tableCsvContent.appendChild(tHead);

    // table body =============================================

    let filteredContents = contents;

    filteredContents = getSearchedContents(filteredContents);

    filteredContents = getSortedContents(filteredContents);

    setPaging(filteredContents.length);

    filteredContents = getPagedContents(filteredContents);

    const tBody = document.createElement('tbody');
    const headers = Object.keys(filteredContents[0]);

    for (let i = 0; i < filteredContents.length; i++) {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);

        let tdString = `<th scope="row">${i + 1}</th>`;

        for (const header of headers) {
            const value = filteredContents[i][header];
            tdString += `<td>${value}</td>`;
        }

        tr.innerHTML = tdString;
    }

    tableCsvContent.appendChild(tBody);

}

// csv loading functions

async function loadCsv() {

    const response = await fetch(`/api/csv-content/${csvFileId}`);
    const result = await response.json();

    if (!result.success) return;

    contents = result.data.contents;

    if (contents.length === 0) return;

    setHeading(result.data.fileName);

    renderTable();

}

loadCsv();