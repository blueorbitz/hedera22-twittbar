import { TwitterApi } from 'twitter-api-v2';
import { userValidateSchema } from '../../helpers/schema';
import HttpErrorHandler, { HttpError } from '../../helpers/HttpError';

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    getFn: validateUser,
  });
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