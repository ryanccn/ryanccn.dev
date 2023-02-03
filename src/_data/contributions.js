const { AssetCache } = require('@11ty/eleventy-fetch');
const { ofetch } = require('ofetch');
const { cyan, dim } = require('kleur/colors');

const excludes = [
  /PolyMC/, // dead project
  /JayantGoel001/, // joke repo
  /\.github/, // configuration stuff
  /(RyanModDev|91b4dd62)/, // personal organizations
];

const gqlQuery = (after) =>
  `
query NotableContributions {
  viewer {
    repositoriesContributedTo(first: 20, ${
      after ? `after: "${after}",` : ''
    } contributionTypes: [COMMIT, PULL_REQUEST], orderBy: { field: STARGAZERS, direction: DESC }) {
      edges {
        node {
          owner {
            login
            avatarUrl
          }
          nameWithOwner
          url
          stargazers {
            totalCount
          }
        }
      }
      
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`.trim();

module.exports = async () => {
  const cache = new AssetCache('github_contributions');

  if (cache.isCacheValid('1d')) {
    console.log(`${cyan('[data]')} Using cached contributions data`);
    return await cache.getCachedValue();
  }

  let data = [];

  let after = null;

  while (true) {
    console.log(
      `${cyan('[data]')} Fetching GitHub contributions ${dim(
        `(after ${after})`
      )}`
    );

    const {
      data: {
        viewer: { repositoriesContributedTo },
      },
    } = await ofetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: gqlQuery(after) }),
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    data.push(...repositoriesContributedTo.edges.map((k) => k.node));
    after = repositoriesContributedTo.pageInfo.endCursor;

    if (!repositoriesContributedTo.pageInfo.hasNextPage) break;
  }

  data = data
    .filter((repo) => !repo.isPrivate)
    .filter((repo) => {
      for (const exclude of excludes)
        if (exclude.exec(repo.nameWithOwner)) return false;
      return true;
    });

  await cache.save(data, 'json');

  return data;
};
