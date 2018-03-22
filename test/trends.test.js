
const Trends = require('../scripts/helpers/trends');

describe('trends', function () {

  this.timeout(60 * 1000);

  it('should load and parse trends', async function () {
    const trendingUrl = 'https://github.com/trending/javascript?since=weekly';
    const repos = await new Trends(trendingUrl).getAll();
    const repo = repos[0];
    assert.equal(repos.length, 25);
    assert.isString(repo.name);
    assert.isString(repo.url);
    assert.isString(repo.description);
    assert.isNumber(repo.starsAdded);
    assert.isNumber(repo.stars);
    assert.isNumber(repo.forks);
  });

  it('should retry 4 times for empty trends', async function () {
    let counter = 0;
    const trendingUrl = 'https://github.com';
    const trends = new Trends(trendingUrl);
    trends._loadRepos = () => {
      counter++;
      return Trends.prototype._loadRepos.call(trends);
    };
    try {
      await trends.getAll();
    } catch(e) {
      // expected error
    }
    assert.equal(counter, 5);
  });
});