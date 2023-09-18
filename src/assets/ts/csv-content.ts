import * as fn from "./functions.js";
import showChart from "./chart.js";

const heading = document.querySelector('#heading')! as HTMLElement;
const tableCsvContent = document.querySelector('#csv-content')! as HTMLTableElement;
const ulPaging = document.querySelector('.pagination')! as HTMLUListElement;
const pNote = document.querySelector('#note')! as HTMLParagraphElement;

declare var csvFileId: string;

const dataPerPage = 10;

let contents: any[] = [];
let filteredContents: any[] = [];
let pagedContents: any[] = [];

let pageNo: number = 1;
let sortColumnName: string | null = null;
let sortOrder: 'asc' | 'desc' = 'asc';



// filter handlers

function handleSearching(searchTerm: string) {
    filteredContents = fn.getSearchedContents(contents, searchTerm);
    handleSorting(null, 'asc');
}


function handleSorting(column: string | null, order: 'asc' | 'desc') {
    sortColumnName = column;
    sortOrder = order;
    filteredContents = fn.getSortedContents(filteredContents, sortColumnName, sortOrder);
    handlePaging(1);
}

function handlePaging(currentPageNo: number) {
    pageNo = currentPageNo;
    pagedContents = fn.getPagedContents(filteredContents, pageNo, dataPerPage);
    render();
}


// html generator functions

function setPageIntro(fileName: string) {

    heading.classList.add('d-flex', 'justify-content-between');

    const html = `  <strong>File Content : ${fileName}</strong>                    
                    <div id="search-bar" class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </div>`;

    heading.innerHTML = html;

    pNote.innerText = '** Double click on any table header to view pie chart **';

    const txtSearch = heading.querySelector('input')!;

    txtSearch.onchange = () => handleSearching(txtSearch.value);

}



// render functions

function renderPager() {

    const noOfPages = Math.ceil(filteredContents.length / dataPerPage);

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
    ulPaging.querySelectorAll('li a').forEach((a: any) => a.onclick = onPageClick);

    function onPageClick(event: Event) {
        const anchor = event.target as HTMLAnchorElement;
        const anchorText = anchor.innerText;

        if (anchorText === 'Previous') pageNo > 1 && handlePaging(pageNo - 1);
        else if (anchorText === 'Next') pageNo < noOfPages && handlePaging(pageNo + 1);
        else handlePaging(Number(anchorText));

    }

}


function renderTableHeader() {

    const tHead = document.createElement('thead');
    const tr = document.createElement('tr');

    tHead.appendChild(tr);

    let thString = '<th scope="col">#</th>';

    for (const key in contents[0]) {
        thString += `<th scope="col" class="${sortColumnName !== key ? '' : sortOrder}" >${key}</th>`;
    }

    tr.innerHTML = thString;

    let clickCount: number = 0, timeoutId: any = null;

    tr.querySelectorAll('th').forEach((th: any) => th.onclick = () => {

        if (th.innerText === '#') return;

        clickCount++;
        timeoutId && clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            timeoutId = null;
            let count = clickCount;
            clickCount = 0;

            if (count === 1) sort(th.innerText);
            else showChart(filteredContents, th.innerText);

        }, 500);

    });


    function sort(columnName: string) {
        if (sortColumnName !== columnName) handleSorting(columnName, 'asc');
        else handleSorting(sortColumnName, sortOrder === 'asc' ? 'desc' : 'asc');
    }

    tableCsvContent.appendChild(tHead);

}


function renderTableBody() {

    const tBody = document.createElement('tbody');
    const headers = Object.keys(pagedContents[0]);

    for (let i = 0; i < pagedContents.length; i++) {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);

        let tdString = `<th scope="row">${i + 1}</th>`;

        for (const header of headers) {
            const value = pagedContents[i][header];
            tdString += `<td>${value}</td>`;
        }

        tr.innerHTML = tdString;
    }

    tableCsvContent.appendChild(tBody);

}


function renderTable() {
    tableCsvContent.innerHTML = '';
    renderTableHeader();
    renderTableBody();
}

// react style render function 
function render() {
    renderPager();
    renderTable();
}


// csv loading functions

async function loadCsv() {

    const response = await fetch(`/api/csv-content/${csvFileId}`);
    const result = await response.json();

    if (!result.success) return;

    contents = result.data.contents;

    if (contents.length === 0) return;

    setPageIntro(result.data.fileName);

    handleSearching('');


}

loadCsv();