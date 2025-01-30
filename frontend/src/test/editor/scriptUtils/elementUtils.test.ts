import {
  removeQueryDetails,
  urlsMatch,
} from '../../../panel/editor/scriptUtils/elementUtils';

describe('removeQueryDetails', () => {
  it('removes search.html details', () => {
    const url =
      'https://www.nhm.ac.uk/search.html?q=Sharks#gsc.tab=0&gsc.q=Sharks&gsc.page=1';
    const urlAfter = removeQueryDetails(url);
    expect(urlAfter).toBe('https://www.nhm.ac.uk/search.html');
  });

  it('leaves url with no query details unchanged', () => {
    const url = 'https://www.nhm.ac.uk';
    const urlAfter = removeQueryDetails(url);
    expect(urlAfter).toBe('https://www.nhm.ac.uk');
  });
});

describe('urlsMatch', () => {
  it('returns false for urls differing by more than search query', () => {
    const url1 =
      'https://www.nhm.ac.uk/search.html?q=Sharks#gsc.tab=0&gsc.q=Sharks&gsc.page=1';
    const url2 = 'https://www.nhm.ac.uk';
    const match = urlsMatch(url1, url2);
    expect(match).toBe(false);
  });

  it('returns true for urls differing by only search query', () => {
    const url1 =
      'https://www.nhm.ac.uk/search.html?q=Sharks#gsc.tab=0&gsc.q=Sharks&gsc.page=1';
    const url2 =
      'https://www.nhm.ac.uk/search.html?q=BAts#gsc.tab=0&gsc.q=Bats&gsc.page=1';
    const match = urlsMatch(url1, url2);
    expect(match).toBe(true);
  });
});
