import mongoose from 'mongoose';
import HttpError from '../utils/httpError.js';

export default function validateObjectId(param = 'id') {
  return (req, _res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return next(new HttpError(400, `El id "${req.params[param]}" no es válido`));
    }
    next();
  };
}
