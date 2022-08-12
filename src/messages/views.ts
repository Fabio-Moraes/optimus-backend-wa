import { AddLeadingZeros } from '../components/AddLeadingZeros';
import { FormatName } from '../components/FormatName';
import { status } from '../global/status';

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

const hours = [
  '07:30:00',
  '08:00:00',
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00'];

const emojis = ['🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🕛'];

export function view(results: Array<{ service_time: string }> = []) {
  const oneDay = (1000 * 60 * 60 * 24);
  const date = new Date();
  const limiter = new Date((date.getTime() + (oneDay * 14)));
  const message = new Date(status.data);

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

  const indexHours = (value: number, time: string) => hours[Number(hours
    .map((item, index) => (item === time ? index : ''))
    .filter((item) => String(item))[0]) + value];

  function testTimesMorning() {
    if (status.service === 'corte_de_cabelo') {
      return `*horários pela parte da manhã*\n${getMessage}\n\n${hours.map((time, index) => `${emojis[index]} ${time} ${ValidateHours(results, time) ? '🟢  ----  Disponível\n' : '🔴  ----  Reservado\n'}`).join('')}`;
    }

    return `*horários pela parte da manhã*\n${getMessage}\n\n${hours.map((time, index) => {
      if (ValidateHours(results, time) && ValidateHours(results, indexHours(1, time))) {
        return `${emojis[hours.findIndex((i) => i === time)]} ${time} 🟢  ----  Disponível\n`;
      }

      if (!ValidateHours(results, time) && ValidateHours(results, indexHours(1, time))) {
        return `${emojis[index]} ${time} 🔴  ----  Reservado\n`;
      }

      if (ValidateHours(results, time) && ValidateHours(results, indexHours(-1, time))) {
        return '';
      }

      return `${emojis[index]} ${time} 🔴  ----  Reservado\n`;
    }).join('')}`;
  }

  return {
    SelectedName: '💬 Digite seu nome para iniciar o atendimento automático:',

    SelectedData: `Escolhar um data entre *${getNow.join('/')}* á *${getLimiter.join('/')}* exceto final de semana e feriados. 🗓️\n\n📝 Digite o dia, mês e ano separados por barra ( *dia/mês/ano* ).\n\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.`,

    Main: `👾 Olá, ${FormatName(status.name)}, seja muito bem-vindo ao atendimento automático.\n\n✌️ *Barbearia Optimus* 💇‍♂️\n\n ⏩ Para agilizar o seu atendimento responda com o número da opção desejada.\n\n 1️⃣ - Horarios disponíveis \n 2️⃣ - Fazer agendamento \n 3️⃣ - Cancelar agendamento \n 0️⃣ - Falar com um atendente \n\n👤 Para alterar o seu nome de usuario, digite: *#perfil*`,

    TypesOfServices: '*Escolha o tipo de serviço* \n\n 1️⃣ - Corte de cabelo\n 2️⃣ - Barba/sobrancelha\n 3️⃣ - Cabelo e barba/sobrancelha\n 4️⃣ - Serviços variados\n\n • Digite *#inicio* para voltar ao menu principal.',

    WhichPeriod: 'Selecione o período desejado.\n\n 1️⃣ Período da tarde\n 2️⃣ Período da manhã\n\n • Digite *#inicio* para retornar ao menu inicial ou *#voltar* para voltar ao menu anterior.',

    TimesMorning: testTimesMorning(),

    TimesAfternoon: 'Período: Tarde\n\n*horários pela parte da tarde* \n\n🕐 13:00 🟢  ----  Disponível\n🕜 13:30 🟢  ----  Disponível\n🕑 14:00 🔴  ----  Reservado\n🕝 14:30 🟢  ----  Disponível\n🕒 15:00 🔴  ----  Reservado\n🕞 15:30 🔴  ----  Reservado\n🕓 16:00 🟢  ----  Disponível\n🕟 16:30 🔴  ----  Reservado\n🕔 17:00 🟢  ----  Disponível\n🕠 17:30 🟢  ----  Disponível',
  };
}
