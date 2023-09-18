declare var bootstrap: any;
declare var Chart: any;

const divModal = document.querySelector('#modalCharting')! as HTMLDivElement;
const modalTitle = divModal.querySelector('.modal-title')! as HTMLHeadingElement;
const canvas = document.querySelector('#canvas')! as HTMLCanvasElement;

const modal = new bootstrap.Modal(divModal, { keyboard: false });


// This method shows pie chart in a modal. This method accepts two
// arguments. First one being contents and second one being column
// name. It first maps the required contents in an array. It then counts
// frequency of elements in the array and finally represents the items
// their frequenecies in percentage in a pie chart.
export default function showChart(contents: any[], columnName: string) {

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