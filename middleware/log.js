/**
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} next - Express next middleware function
 */
export default function logger(req, res, next) {
  const start = Date.now();

  // Log when endpoint is hit
  console.log(`\t\x1b[36m[START]\x1b[0m \x1b[33m${req.method} ${req.originalUrl}\x1b[0m`);

  // Log request body, query, and params
  console.log(`\t\x1b[35mRequest Body:\x1b[0m`, req.body);
  console.log(`\t\x1b[35mQuery Params:\x1b[0m`, req.query);
  console.log(`\t\x1b[35mURL Params:\x1b[0m`, req.params);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`\t\x1b[32m[END]\x1b[0m \x1b[36m${req.method} ${req.originalUrl}\x1b[0m - Total time: \x1b[35m${duration}ms\x1b[0m`);
  });

  next();
}
