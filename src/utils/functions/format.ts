const format = {
    money: (value: number) => {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        });

        return formatter.format(value);
    },
    time: (value: Date | string, format: 'HH:MM:SS' | 'HHhMM') => {
        if (typeof value === 'string') {
            value = new Date(value);
        }

        if (format === 'HHhMM') {
            const hours = value.getHours() < 10 ? `0${value.getHours()}` : value.getHours();
            const minutes = value.getMinutes() < 10 ? `0${value.getMinutes()}` : value.getMinutes();

            return `${hours}h${minutes}`;
        }

        return value.toLocaleTimeString();
    },
    date: (value: Date | string, format: 'DD/MM/AAAA') => {
        if (typeof value === 'string') {
            value = new Date(value);
        }

        if (format === 'DD/MM/AAAA') {
            const day = value.getDay() < 10 ? `0${value.getDay()}` : value.getDay();
            const month = value.getMonth() < 10 ? `0${value.getMonth()}` : value.getMonth();
            const year = value.getFullYear();

            return `${day}/${month}/${year}`;
        }

        return value.toLocaleDateString();
    },
    dateFromDays: (days: number) => {
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years) {
            return `${years} ano${years === 1 ? '' : 's'}`;
        }

        if (months) {
            return `${months} ${months === 1 ? 'mês' : 'meses'}`;
        }

        return `${days} dia${days === 1 ? '' : 's'}`;
    }
};

export default format;
