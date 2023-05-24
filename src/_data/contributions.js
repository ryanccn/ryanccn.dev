const { AssetCache } = require('@11ty/eleventy-fetch');
const { createGql } = require('@ryanccn/gql');

const { cyan, dim } = require('kleur/colors');

const excludes = [
  /PolyMC/, // dead project
  /JayantGoel001/, // joke repo
  /\.github/, // configuration stuff
  /(RyanModDev|91b4dd62)/, // personal organizations
];

const gql = createGql('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

const queryContributions = (after) =>
  gql`
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
`;

module.exports = async () => {
  if (!process.env.GITHUB_TOKEN) return [];

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

    const response = await queryContributions(after);

    if (!response.success) {
      throw new Error(
        `Error fetching GitHub contributions: ${response.response}`
      );
    }

    const {
      data: {
        data: {
          viewer: { repositoriesContributedTo },
        },
      },
    } = response;

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
