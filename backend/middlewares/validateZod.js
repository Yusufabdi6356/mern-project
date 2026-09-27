import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        ...formErrors.map(message => ({ field: 'body', message })),
        ...Object.entries(fieldErrors).map(([field, messages]) => ({
          field,
          message: messages[0]
        }))
      ]
    });
  }

  req.body = result.data;
  next();
};
