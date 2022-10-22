"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alert = void 0;
const moment_1 = __importDefault(require("moment"));
const defaultResults = {
    name: '',
    service: '',
    employee: '',
    service_time: '',
    service_date: '',
};
function alert(results = defaultResults) {
    const timeDelete = results.service_time.substring(0, results.service_time.length - 3);
    const dateListDeleteNow = moment_1.default.utc(results.service_date).format('DD/MM/YY');
    return {
        OptionsBelow: 'Por favor, escolha uma das opçoes abaixo. 👇️',
        InvalidTextFormat: 'Formato de texto Inválido, por favor, siga os seguintes passos. 👇️',
        InvalidDate: 'A data escolhida não está dentro do prazo, por favor, siga os seguintes passos. 👇️',
        FailConnect: 'Não foi possível comunicar com o servidor. Por favor, tente novamente em alguns instantes',
        TimeNotAvailable: 'Já está agendado, por favor, escolha um outro horario',
        TimeNotExpired: 'Não está dentro do prazo, por favor, escolha um horário disponivel',
        Finished: 'Agradecemos por confiar em nosso atendimento. Volte sempre! 🎉🎉',
        Cancel: 'Agradecemos pela visita. Volte sempre!',
        Deleted: `*🗑️ Agendamento cancelado.*\n\n~Nome: ${results.name.replace(/_/g, ' ')}~\n~Barbeiro: ${results.employee.replace(/_/g, ' ')}~\n~Serviço: ${results.service.replace(/_/g, ' ')}~\n~Data e hora: ${dateListDeleteNow} as ${timeDelete}~`,
    };
}
exports.alert = alert;
