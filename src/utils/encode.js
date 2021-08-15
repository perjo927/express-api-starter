const encodeBody = (body) =>
  Object.keys(body)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
    .join("&");

const encodeParams = (params) => {
  const definedParams = Object.entries(params).filter(([, value]) =>
    Boolean(value)
  );
  return definedParams
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

module.exports = { encodeBody, encodeParams };
