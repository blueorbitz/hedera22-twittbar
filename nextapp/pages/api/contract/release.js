import ConnectToContract from '../../../helpers/contract';
import HttpErrorHandler, { HttpError } from '../../../helpers/HttpError';
import { userValidateSchema } from '../../../helpers/schema';
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    postFn: async () => releaseFund(await getSession({ req })),
  });
}

async function releaseFund({ user }) {
  const handle = user.username;
  const validate = userValidateSchema.validate({ handle }, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  try {
    const { liveContract } = await ConnectToContract();
    console.log('LiveContract call: releaseFund()');
    const data = await liveContract.releaseFund(validate.value.handle);
    console.log(data);
  } catch (error) {
    throw new HttpError(error.message, 400);
  }

  return {
    message: 'Ok',
  };
}
