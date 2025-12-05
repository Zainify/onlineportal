export function getPagination(query, defaults = { limit: 20, max: 100 }) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  let limit = Math.max(1, parseInt(query.limit || `${defaults.limit}`, 10));
  limit = Math.min(limit, defaults.max);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function getSearchFilter(query, fields = []) {
  const q = (query.q || '').trim();
  if (!q || fields.length === 0) return null;
  return { q, fields };
}
