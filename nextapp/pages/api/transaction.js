import { getRecent, postRecent } from '../../handler/recent';
import HttpError from '../../helpers/HttpError';

export default async function handler(req, res) {
  const method = req.method.toUpperCase();
  try {
    switch (method) {
      case 'GET':
        res.status(200).json(await getRecent(req.query));
        break;
      case 'POST':
        res.status(200).json(await postRecent(req.body));
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
