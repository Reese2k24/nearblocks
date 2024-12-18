// import crypto from 'node:crypto';

// import { v4 } from 'uuid';

import { ValidationError } from '#types/types';
import db from '#libs/db';
import Sentry from '#libs/sentry';
import logger from '#libs/logger';

export const getPagination = (page = 1, perPage = 25) => {
  return {
    limit: perPage,
    offset: (page - 1) * perPage,
  };
};

export const keyBinder = (raw: string, bindings: any, format = false) => {
  let index = 0;
  const values: any[] = [];
  const params: any[] = [];
  const regex = /:(\w+)/g;

  let query = raw.replace(regex, function (match, group) {
    if (group in bindings) {
      index++;
      values.push(bindings[group]);

      if (format) {
        params.push(`$${index}::text`);
      }

      return format ? '%L' : `$${index}`;
    }

    throw new Error(`missing parameter binding for ${match}`);
  });

  if (format) {
    query = params.length
      ? `format('${query}', ${params.join(', ')})`
      : `'${query}'`;
  }

  return {
    query,
    values,
  };
};

export const validationErrors = (errors: ValidationError[]) => {
  return {
    errors: errors.map((error) => ({
      path: [error.path],
      message: error.message,
    })),
  };
};

// export const generateApiKey = () => {
//   const apiKey = v4({
//     random: crypto.randomBytes(16),
//   });

//   return apiKey.toUpperCase().replace(/-/g, '');
// };

export const getFreePlan = async () => {
  const { rows } = await db.query(
    `
      SELECT
        *
      FROM
        api__plans
      WHERE
        id = 1
    `,
  );

  return rows?.[0];
};

export const errorHandler = (error: Error) => {
  logger.error(error);
  Sentry.captureException(error);
};
