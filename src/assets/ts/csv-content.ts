const heading = document.querySelector('#heading')! as HTMLElement;
const tableCsvContent = document.querySelector('#csv-content')! as HTMLTableElement;
const ulPaging = document.querySelector('.pagination')! as HTMLUListElement;

declare var csvFileId: string;

const dataPerPage = 10;

let contents: any[] = [];
let searchTerm: string = '';
let pageNo = 1;


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

        renderTableBody();
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

    const txtSearch = heading.querySelector('input')!;

    txtSearch.onchange = function () {
        searchTerm = txtSearch.value;
        pageNo = 1;
        renderTableBody();
    }

}


function getTableHeader() {
    const tHead = document.createElement('thead');
    const tr = document.createElement('tr');

    tHead.appendChild(tr);

    let thString = '<th scope="col">#</th>';

    for (const key in contents[0]) {
        thString += `<th scope="col">${key}</th>`;
    }

    tr.innerHTML = thString;

    return tHead;
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

// render functions

function renderTableHeader() {
    const tHead = getTableHeader();
    tableCsvContent.appendChild(tHead);
}


function renderTableBody() {

    let filteredContents = contents;

    filteredContents = getSearchedContents(filteredContents);

    setPaging(filteredContents.length);

    filteredContents = getPagedContents(filteredContents);

    tableCsvContent.querySelector('tbody')?.remove();

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

    renderTableHeader();
    renderTableBody();

}

loadCsv();