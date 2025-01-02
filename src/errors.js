export default class HttpError extends Error {
    /**
     * @param {number} status - HTTP статус-код.
     * @param {string} url - URL, по которому выполнялся запрос.
     * @param {string} [message] - Сообщение об ошибке (необязательно).
     * @param {any} [details] - Дополнительные данные об ошибке (необязательно).
     * @param {any} [responseBody] - Тело ответа (если доступно, может быть JSON).
     */
    constructor(status, url, message = "HTTP Error", details = null, responseBody = null) {
        super(message);

        // Устанавливаем имя класса для ошибки
        this.name = "HttpError";

        // HTTP статус-код
        this.status = status;

        // URL запроса
        this.url = url;

        // Дополнительные данные (например, заголовки или сообщение об ошибке)
        this.details = details;

        // Тело ответа (если доступно)
        this.responseBody = responseBody;

        // Удерживаем стек вызовов для дебага (если поддерживается)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }

    /**
     * Собирает ошибки в карту (Map) по полям (path -> msg).
     * @returns {Map<string, string>} Карта ошибок.
     */
    getFieldErrors() {
        const fieldErrors = new Map();

        if (Array.isArray(this.responseBody.errors)) {
            for (const errorObj of this.responseBody.errors) {
                if (errorObj.path && errorObj.msg) {

                    let msg = fieldErrors.get(errorObj.path);

                    if (msg) {
                        msg += `\n${errorObj.msg}`;
                    } else {
                        msg = errorObj.msg;
                    }

                    fieldErrors.set(errorObj.path, msg);
                }
            }
        }

        // TODO: cache

        return fieldErrors;
    }

    getErrorsAsText() {
        const map = this.getFieldErrors();

        let text = '';

        map.forEach((value, key) => {
           text += `;\n${key}: ${value}`;
        });

        return text;
    }
}