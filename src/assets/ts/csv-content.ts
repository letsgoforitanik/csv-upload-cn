const heading = document.querySelector('#heading')! as HTMLElement;
const tableCsvContent = document.querySelector('#csv-content')! as HTMLTableElement;

declare var csvFileId: string;
let contents: any[] = [];
let searchTerm: string = '';

// html generator functions

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