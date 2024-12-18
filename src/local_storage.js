export const TOKEN_KEY = 'token';

const storageHelper = {
    /**
     * Сохраняет значение в localStorage с заданным ключом.
     * @param {string} key - Ключ, по которому будет сохранено значение.
     * @param {*} value - Значение, которое нужно сохранить. Оно будет преобразовано в JSON.
     */
    set (key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Ошибка при сохранении в localStorage:', error);
        }
    },

    /**
     * Получает значение из localStorage по заданному ключу.
     * @param {string} key - Ключ, по которому будет получено значение.
     * @returns {*} Возвращает значение, если оно найдено, или null, если ключ не существует или произошла ошибка.
     */
    get (key) {
        try {
            const serializedValue = localStorage.getItem(key);
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            console.error('Ошибка при получении данных из localStorage:',
                error);
            return null;
        }
    },

    /**
     * Удаляет значение из localStorage по заданному ключу.
     * @param {string} key - Ключ, по которому будет удалено значение.
     */
    remove (key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Ошибка при удалении данных из localStorage:', error);
        }
    },

    /**
     * Очищает все значения в localStorage.
     */
    clear () {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Ошибка при очистке localStorage:', error);
        }
    },
};

export default storageHelper;