const urlsMatch = (url1: string, url2: string): boolean => {
  const url1Stripped = removeQueryDetails(url1);
  const url2Stripepd = removeQueryDetails(url2);
  return url1Stripped === url2Stripepd;
};

const removeQueryDetails = (url: string): string => {
  const queryStringRegex = /\?[^/]*$/g;
  const [urlAfterLastSlash] = queryStringRegex.exec(url) ?? [undefined];
  if (urlAfterLastSlash) {
    return url.replace(queryStringRegex, '');
  }
  return url;
};

export { urlsMatch, removeQueryDetails };
