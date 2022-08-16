import type { TypesViews } from '../models/interfaces';
import { AddLeadingZeros } from '../components/AddLeadingZeros';
import { FormatName } from '../components/FormatName';
// import { status } from '../global/status';
import 'dotenv/config';

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

export function view(props: TypesViews, results: Array<{ service_time: string }> = []) {
  function hours() {
    if (props.status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning') {
      return process.env.MORNING.split(', ').map((item) => `${item}:00`);
    }

    if (props.status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Afternoon') {
      return process.env.AFTERNOON.split(', ').map((item) => `${item}:00`);
    }
    return [];
  }

  const oneDay = (1000 * 60 * 60 * 24);
  const date = new Date();
  const limiter = new Date((date.getTime() + (oneDay * 14)));
  const message = new Date(props.status[`DATE${props.message.sender.id}`.split('@')[0]]);

  const getNow = [
    AddLeadingZeros(date.getDate(), 2),
    AddLeadingZeros((date.getMonth() + 1), 2),
    date.getFullYear()];

  const getLimiter = [
    AddLeadingZeros(limiter.getDate(), 2),
    AddLeadingZeros((limiter.getMonth() + 1), 2),
    limiter.getFullYear()];

  const getMessage = `${dayName[message.getDay()]}, ${message.getDate()} de ${monName[message.getMonth()]} de ${message.getFullYear()}`;

  const ValidateHours = (res: Array<{ service_time: string }>, selectHours: string) => {
    if (!selectHours) return false;
    return !res?.filter((item) => item.service_time === selectHours).length;
  };

  const indexHours = (value: number, time: string) => hours()[Number(hours()
    .map((item, index) => (item === time ? index : ''))
    .filter((item) => String(item))[0]) + value];

  function HourView() {
    if (props.status[`SERVICE${props.message.sender.id}`.split('@')[0]] === process.env.ONESERVICE) {
      return `Horários pela parte da *${props.status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}*\n${getMessage}\n${props.status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n 📝 Para finalizar o agendamento digite a hora e minuto separados por dois-pontos ( *hora:minuto* ).\n\n${hours().map((time, index) => `${emojis[index]}  ${time.slice(0, -3)}  ${ValidateHours(results, time) ? '🟢  ----  Disponível\n' : '🔴  ----  Reservado\n'}`).join('')}\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`;
    }

    return `Horários pela parte da *${props.status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}*\n${getMessage}\n${props.status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n 📝 Para finalizar o agendamento digite a hora e minuto separados por dois-pontos ( *hora:minuto* ).\n\n${hours().map((time, index) => {
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
    }).join('')}\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`;
  }

  return {
    NameView: '💬 Digite seu nome para iniciar o atendimento automático:',

    MainView: `👾 Olá, ${FormatName(props.status[`NAME${props.message.sender.id}`.split('@')[0]])}, seja muito bem-vindo ao atendimento automático.\n\n✌️ *${process.env.BUSINESS}* 💈\n\n 📝 Para agilizar o seu atendimento responda com o número da opção desejada.\n\n 1️⃣ - Horarios e agendamento \n 2️⃣ - Cancelar agendamento \n 0️⃣ - Falar com um atendente \n\n • Para alterar o seu nome de usuario digite *#perfil*.\n\n • Em qualquer momento digite *#sair* para sair do atendimento.`,

    ServicesView: `*Escolha o tipo de serviço* \n\n 1️⃣ - ${process.env.ONESERVICE}\n 2️⃣ - ${process.env.TWOSERVICE}\n 3️⃣ - ${process.env.THREESERVICE}\n 4️⃣ - ${process.env.OTRERSERVICE}\n\n • Digite *#inicio* para voltar ao menu principal.`,

    DateView: `Escolhar um data entre *${getNow.join('/')}* á *${getLimiter.join('/')}* exceto final de semana e feriados. 🗓️\n\n 📝 Digite o dia, mês e ano separados por barra ( *dia/mês/ano* ).\n\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`,

    PeriodView: 'Selecione o período desejado.\n\n 1️⃣ Período da tarde\n 2️⃣ Período da manhã\n\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.',

    HourView: HourView(),

    CouponView: `Agendamento concluído com sucesso\n\n${getMessage}\nPeriodo da ${props.status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning' ? 'manhã' : 'tarde'}\n${props.status[`SERVICE${props.message.sender.id}`.split('@')[0]]}\n\n 1️⃣ - Realizar outro agendamento\n 2️⃣ - Finalizar o atendimento\n\nSeu código de agendamento é\n${props.status[`COUPON${props.message.sender.id}`.split('@')[0]]}`,
  };
}
