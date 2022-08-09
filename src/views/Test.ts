import type { TypesViews } from '../models/interfaces';
import { GenerateCoupon } from '../components/GenerateCoupon';

import { status } from '../global/status';
import { view } from '../messages/views';
import { db } from '../database/connect';

export async function Test(props: TypesViews) {
  const business = 'barbearia_optimus';
  const name = status.name.replace(/ /g, '_');
  const phone = String(props.message.sender.id);
  const service = 'Cabelo e barba/sobrancelha'.replace(/\//g, ' ').split(' ').join('_').toLowerCase();
  const coupon = GenerateCoupon(4);
  const service_date = '2022/08/19'.split('/').join('-');
  const service_time = '14:30:00';

  const sql = 'INSERT INTO optimus SET business = ?, name = ?, phone = ?, service = ?, coupon = ?, service_date = ?, service_time = ?;';

  const values = [business, name, phone, service, coupon, service_date, service_time];

  const dayName = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const monName = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  const oneDay = (1000 * 60 * 60 * 24);
  const data = new Date();
  const now = new Date((data.getTime() + (oneDay * 0)));

  const msgdate = `Hoje é ${dayName[now.getDay()]}, ${now.getDate()} de ${monName[now.getMonth()]} de ${now.getFullYear()}.`;

  switch (props.message.body.toLocaleLowerCase()) {
    case 'sql':
      db.query(sql, values, (error) => {
        if (error) {
          props.client
            .sendText(props.message.from, 'Não foi possivel fazer o cadastro');
        }

        props.client
          .sendText(props.message.from, 'teste_db_ok').then(() => { });
      });
      break;

    case 'msgdate':
      props.client
        .sendText(props.message.from, msgdate);
      break;

    case 'cupom':
      props.client
        .sendText(props.message.from, GenerateCoupon(4));
      break;

    case 'day':
      status.view = 'SelectedData';
      props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    default:
      if (status.name === '') status.name = props.message.body;
      await props.client.sendText(props.message.from, view().Main);
      break;
  }
}
