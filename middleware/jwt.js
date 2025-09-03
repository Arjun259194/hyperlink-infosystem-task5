import z from 'zod'

/**
 *
 * @param {import('express').Request} req - The Express request object, contains post data in req.body.
 * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
 * @param {import("express").NextFunction} next - The next function for next middleware
 *
 * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
 */
export default async function verifyToken(req, res, next) {
    const rawCookieVal = req.cookies['auth']

    z.string().and(z.jwt())
}
