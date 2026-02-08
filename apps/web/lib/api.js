export function jsonResponse(data, init) {
  const json = JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  
  return new Response(json, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });
}