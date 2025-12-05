export const asyncHandler = (fn) => (req, res, next) => {
  if (typeof next !== 'function') {
    console.error('asyncHandler: next is not a function!', next);
    console.error('req.url:', req.url);
    console.error('req.method:', req.method);
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};
