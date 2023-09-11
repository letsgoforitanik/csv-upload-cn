const btnUploadFile = document.querySelector('#upload-file-btn')! as HTMLButtonElement;
const flUploadFile = document.querySelector('#file-upload-csv')! as HTMLInputElement;
const smInvalidFeedback = document.querySelector('#invalid-feedback')! as HTMLElement;
const formUpload = document.querySelector('#form-upload')! as HTMLFormElement;

btnUploadFile.onclick = () => flUploadFile.click();

flUploadFile.onchange = function () {

    if (!flUploadFile.files || flUploadFile.files.length === 0) return;

    const fileName = flUploadFile.value;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    const file = flUploadFile.files[0];

    if (fileExtension !== 'csv') {
        smInvalidFeedback.innerText = 'Upload .csv file';
        return;
    }

    console.log(file);
    console.log(file.size);

    if (file.size === 0) {
        smInvalidFeedback.innerText = "Upload non-empty .csv file";
        return;
    }

    smInvalidFeedback.innerText = '';

    formUpload.submit();

};