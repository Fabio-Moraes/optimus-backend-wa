import moment from 'moment';
import type { TypesViews, TypesSession } from '../models/interfaces';
import { AddLeadingZeros } from '../components/AddLeadingZeros';
import { FormatName } from '../components/FormatName';

import sessionJson from '../config/Session.json';

const dayName = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'];

const monName = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'];

const emojis = ['🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🕛'];

interface TypeResults {
  name: string;
  service: string;
  employee: string;
  service_time: string;
  service_date: string;
  identifier: string;
}

export function view(props: TypesViews, results: TypeResults[] = []) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  function hours() {
    if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning') {
      return session.Morning.split(', ').map((item) => `${item}:00`);
    }

    if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Afternoon') {
      return session.Afternoon.split(', ').map((item) => `${item}:00`);
    }
    return [];
  }

  const oneDay = (1000 * 60 * 60 * 24);
  const date = new Date();
  const limiter = new Date((date.getTime() + (oneDay * 14)));
  const message = new Date(status[`DATE${props.message.sender.id}`.split('@')[0]]);
  const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]];

  const getNow = moment.utc(date).format('DD/MM/YY');
  const getLimiter = moment.utc(limiter).format('DD/MM/YY');

  const getMessage = `${dayName[message.getDay()]}, ${message.getDate()} de ${monName[message.getMonth()]} de ${message.getFullYear()}`;

  const ValidateHours = (res: Array<{ service_time: string }>, selectHours: string) => {
    if (!selectHours) return false;
    return !res?.filter((item) => item.service_time === selectHours).length;
  };

  const indexHours = (value: number, time: string) => hours()[Number(hours()
    .map((item, index) => (item === time ? index : ''))
    .filter((item) => String(item))[0]) + value];

  function isWithinTime(end: string) {
    const now = moment().format('HH:mm');

    if (now.toString() >= end) return true;
    return false;
  }

  function isWithinDate(end: string) {
    const now = moment().format('YYYY/MM/DD');

    if (end === now.toString()) return true;
    return false;
  }

  function HourView() {
    if (status[`SERVICE${props.message.sender.id}`.split('@')[0]] === session.Oneservice) {
      return `Horários pela parte da *${status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}*\n${getMessage}\n${status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n📝 Para finalizar o agendamento digite a hora e minuto separados por dois-pontos ( *hora:minuto* ).\n\n${hours().map((time, index) => {
        if (isWithinTime(time.slice(0, -3)) && isWithinDate(service_date)) {
          return `${emojis[index]}  ${time.slice(0, -3)}  🔴  ----  Reservado\n`;
        }

        return `${emojis[index]}  ${time.slice(0, -3)}  ${ValidateHours(results, time) ? '🟢  ----  Disponível\n' : '🔴  ----  Reservado\n'}`;
      }).join('')}\n🔸 Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`;
    }

    return `Horários pela parte da *${status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}*\n${getMessage}\n${status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n📝 Para finalizar o agendamento digite a hora e minuto separados por dois-pontos ( *hora:minuto* ).\n\n${hours().map((time, index) => {
      if (isWithinTime(time.slice(0, -3)) && isWithinDate(service_date)) {
        return `${emojis[index]}  ${time.slice(0, -3)}  🔴  ----  Reservado\n`;
      }

      if (ValidateHours(results, time) && ValidateHours(results, indexHours(1, time))) {
        return `${emojis[hours().findIndex((i) => i === time)]}  ${time.slice(0, -3)}  🟢  ----  Disponível\n`;
      }

      if (!ValidateHours(results, time) && ValidateHours(results, indexHours(1, time))) {
        return `${emojis[index]}  ${time.slice(0, -3)}  🔴  ----  Reservado\n`;
      }

      if (ValidateHours(results, time) && ValidateHours(results, indexHours(-1, time))) {
        return '';
      }

      return `${emojis[index]}  ${time.slice(0, -3)}  🔴  ----  Reservado\n`;
    }).join('')}\n🔸 Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`;
  }

  function DeleteView() {
    const setResults = new Set();

    const filterResults = results.filter((res) => {
      const duplicatedIdentifier = setResults.has(res.identifier);
      setResults.add(res.identifier);
      return !duplicatedIdentifier;
    });

    if (results.length !== 0) {
      return `Agendamentos referentes ao telefone:\n*📲 ${String(props.message.sender.id).split('@')[0].substring(2)}*\n\n📝 Para cancelar um agendamento responda com o número do ID.\n\n${filterResults.map((item, index) => {
        const dateListDelete = new Date(item.service_date);
        const timeDelete = item.service_time.substring(0, item.service_time.length - 3);
        const dateListDeleteNow = [
          AddLeadingZeros(dateListDelete.getDate(), 2),
          AddLeadingZeros((dateListDelete.getMonth() + 1), 2),
          String(dateListDelete.getFullYear()).substring(2)];

        // if (String(results[index - 1]?.service_date) === String(item.service_date))

        return `*ID: ${index}*\nNome: ${item.name?.replace(/_/g, ' ')}\nBarbeiro: ${item.employee?.replace(/_/g, ' ')}\nServiço: ${item.service?.replace(/_/g, ' ')}\nData e hora: ${dateListDeleteNow.join('/')} as ${timeDelete}`;
      }).join('\n---------------------------------------------------------\n')}\n\n🔸 Digite *#inicio* para retornar ao menu inicial.`;
    }

    return '*📒 Nenhum agendamento encontrado.*\n\n🔸 Digite *#inicio* para retornar ao menu inicial.';
  }

  return {
    NameView: '💬 Digite seu nome para iniciar o atendimento automático:',

    MainView: `👾 Olá, ${FormatName(status[`NAME${props.message.sender.id}`.split('@')[0]])}, seja muito bem-vindo ao atendimento automático.\n\n✌️ *${session.Business}* 💈\n\n📝 Para agilizar o seu atendimento responda com o número da opção desejada.\n\n1️⃣ - Horarios e agendamento \n2️⃣ - Cancelar agendamento \n0️⃣ - Falar com um atendente \n\n🔸 Para alterar o seu nome de usuario digite *#perfil*.\n\n🔸 Em qualquer momento digite *#sair* para sair do atendimento.`,

    ServicesView: `*Escolha o tipo de serviço* \n\n1️⃣ - ${session.Oneservice}\n2️⃣ - ${session.Twoservice}\n3️⃣ - ${session.Threeservice}\n4️⃣ - ${session.Otrerservice}\n\n🔸 Digite *#inicio* para voltar ao menu principal.`,

    DateView: `Escolhar um data entre *${getNow}* á *${getLimiter}* exceto final de semana e feriados. 🗓️\n\n📝 Digite o dia, mês e ano separados por barra ( *dia/mês/ano* ).\n\n🔸 Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`,

    PeriodView: 'Selecione o período desejado.\n\n1️⃣ Período da tarde\n2️⃣ Período da manhã\n\n🔸 Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.',

    HourView: HourView(),

    IdentifierView: `Agendamento concluído com sucesso\n\n${getMessage}\nPeriodo da ${status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}\n${status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n1️⃣ - Realizar outro agendamento\n2️⃣ - Finalizar o atendimento\n\nSeu código de agendamento é\n${status[`identifier${props.message.sender.id}`.split('@')[0]]}`,

    DeleteView: DeleteView(),

    EmployeeView: `*Escolha para qual barbeiro* \n\n1️⃣ - ${session.Employee1}\n2️⃣ - ${session.Employee2}\n\n🔸 Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`,
  };
}
