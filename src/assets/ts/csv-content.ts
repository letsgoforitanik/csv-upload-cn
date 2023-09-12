const strHeading = document.querySelector('#strong-heading')! as HTMLElement;
const tableCsvContent = document.querySelector('#csv-content')! as HTMLTableElement;

function getTableHeader(contents: any[]) {
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


function getTableBody(contents: any[]) {
    const tBody = document.createElement('tbody');
    const headers = Object.keys(contents[0]);

    for (let i = 0; i < contents.length; i++) {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);

        let tdString = `<th scope="row">${i + 1}</th>`;

        for (const header of headers) {
            const value = contents[i][header];
            tdString += `<td>${value}</td>`;
        }

        tr.innerHTML = tdString;
    }

    return tBody;
}

function renderTable(contents: any[]) {
    const tHead = getTableHeader(contents);
    const tBody = getTableBody(contents);

    tableCsvContent.appendChild(tHead);
    tableCsvContent.appendChild(tBody);
}


declare var csvFileId: string;

async function loadCsv() {

    const response = await fetch(`/api/csv-content/${csvFileId}`);
    const result = await response.json();

    if (!result.success) return;

    const { fileName, contents } = result.data;

    strHeading.innerText = `File Content : ${fileName}`;

    if (contents.length === 0) return;

    renderTable(contents);

}

loadCsv();