import { Hbar, HbarUnit } from "@hashgraph/sdk";
import ConnectToContract from '../../../helpers/contract';
import HttpErrorHandler, { HttpError } from '../../../helpers/HttpError';
import { userValidateSchema } from '../../../helpers/schema';

export default async function handler(req, res) { 
  HttpErrorHandler(req, res, {
    postFn: releaseFund,
  });
}

async function releaseFund(body) {
  const validate = userValidateSchema.validate(body, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const { liveContract } = await ConnectToContract();
  console.log('LiveContract call: releaseFund()');
  const data = await liveContract.releaseFund(validate.value.handle);
  console.log(data);
  return {
    message: 'Ok',
  };
}
