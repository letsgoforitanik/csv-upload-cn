declare const Noty: any;

export function showMessage(message: string) {
    const noty = new Noty({
        theme: 'metroui',
        type: "success",
        text: message,
        timeout: 2000
    });

    noty.show();
}

export function showError(errorMessage: string) {
    const noty = new Noty({
        theme: 'metroui',
        type: "error",
        text: errorMessage,
        timeout: 2000
    });

    noty.show();
}

export function isValidDate(dateString: string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export function isNumber(arg: any) {
    return !isNaN(arg);
}