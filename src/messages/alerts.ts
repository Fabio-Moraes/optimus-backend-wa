import moment from 'moment';

const defaultResults = {
  name: '',
  service: '',
  employee: '',
  service_time: '',
  service_date: '',
};

export function alert(results = defaultResults) {
  const timeDelete = results!.service_time.substring(0, results!.service_time.length - 3);
  const dateListDeleteNow = moment.utc(results.service_date).format('DD/MM/YY');
  return {
    OptionsBelow: 'Por favor, escolha uma das opçoes abaixo. 👇️',

    InvalidTextFormat: 'Formato de texto Inválido, por favor, siga os seguintes passos. 👇️',

    InvalidDate: 'A data escolhida não está dentro do prazo, por favor, siga os seguintes passos. 👇️',

    FailConnect: 'ERRO! Não foi possível comunicar com o servidor. Por favor, tente novamente mais tarde',

    TimeNotAvailable: 'Já está agendado, por favor, escolha um outro horario',

    Finished: 'Agradecemos por confiar em nosso atendimento. Volte sempre! 🎉🎉',

    Cancel: 'Agradecemos pela visita. Volte sempre!',

    Deleted: `*🗑️ Agendamento cancelado.*\n\n~Nome: ${results!.name.replace(/_/g, ' ')}~\n~Barbeiro: ${results!.employee.replace(/_/g, ' ')}~\n~Serviço: ${results!.service.replace(/_/g, ' ')}~\n~Data e hora: ${dateListDeleteNow} as ${timeDelete}~`,
  };
}
