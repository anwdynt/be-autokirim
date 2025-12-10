import { Context } from 'hono';

/**
 * Response sukses
 */
export const success = <T = any>(
    c: Context,
    data?: T,
    message: string = 'Success',
    status: number = 200
) => {
    return c.json(
        {
            status: 'success',
            message,
            data: data ?? null,
        },
        status as any
    );
};

/**
 * Response error
 */
export const error = (
    c: Context,
    message: string = 'Something went wrong',
    status: number = 500,
    data?: any
) => {
    return c.json(
        {
            status: 'error',
            message,
            data: data ?? null,
        },
        status as any
    );
};

/**
 * Response validation / bad request
 */
export const badRequest = (c: Context, message: string = 'Bad request', data?: any) => {
    return c.json(
        {
            status: 'fail',
            message,
            data: data ?? null,
        },
        400
    );
};

/**
 * Response unauthorized
 */
export const unauthorized = (c: Context, message: string = 'Unauthorized') => {
    return c.json(
        {
            status: 'fail',
            message,
        },
        401
    );
};

/**
 * Response forbidden
 */
export const forbidden = (c: Context, message: string = 'Forbidden') => {
    return c.json(
        {
            status: 'fail',
            message,
        },
        403
    );
};

/**
 * Response not found
 */
export const notFound = (c: Context, message: string = 'Resource not found') => {
    return c.json(
        {
            status: 'fail',
            message,
        },
        404
    );
};
