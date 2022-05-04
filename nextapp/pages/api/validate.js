import { TwitterApi } from 'twitter-api-v2';
import { userValidateSchema } from '../../helpers/schema';
import HttpError from '../../helpers/HttpError';

export default async function handler(req, res) {
  const method = req.method.toUpperCase();
  try {
    switch (method) {
      case 'GET':
        res.status(200).json(await validateUser(req.query));
        break;
      default:
        res.status(405).send();
    }
  } catch (e) {
    if (e instanceof HttpError) {
      res.status(e.status).json({ error: e.message });
    }
    else {
      console.error(e);
      res.status(500).send();
    }
  }
}

async function validateUser(query) {
  const validate = userValidateSchema.validate(query, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN).readOnly;
  const results = await client.v2.userByUsername(validate.value.handle, {
    'user.fields': ['profile_image_url', 'verified'],
  });

  if (results.errors)
    throw new HttpError(results.errors[0].detail, 404);

  return results.data;
}