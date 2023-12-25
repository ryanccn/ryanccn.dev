import { AssetCache } from '@11ty/eleventy-fetch';
import { createGql } from '@ryanccn/gql';

import { logData } from '../utils/log.js';
import { dim } from 'kleur/colors';

const excludes = [
  /PolyMC/, // dead project
  /JayantGoel001/, // joke repo
  /Ampflower\/nocode/, // joke repo
  /\.github/, // configuration stuff
  /(RyanModDev)/, // personal organizations
];

const gql = createGql('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

/**
 * @param {string} after
 */
const queryContributions = (after) =>
  gql`
    query NotableContributions($after: String) {
      viewer {
        repositoriesContributedTo(
          first: 20
          after: $after
          contributionTypes: [COMMIT, PULL_REQUEST]
          orderBy: { field: STARGAZERS, direction: DESC }
        ) {
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
              isPrivate
              isFork
            }
          }

          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `({ after });

export default async () => {
  if (!process.env.GITHUB_TOKEN) return [];

  const cache = new AssetCache('github_contributions');

  if (cache.isCacheValid('1d')) {
    logData('contributions', 'Using cached data');

    return await cache.getCachedValue();
  }

  let data = [];

  let after = undefined;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    logData('contributions', `Fetching ${dim(`(after ${after})`)}`);

    const response = await queryContributions(after);

    if (!response.success) {
      throw new Error(
        `Error fetching GitHub contributions: ${response.response}`,
      );
    }

    const {
      data: {
        viewer: { repositoriesContributedTo },
      },
    } = response;

    data.push(...repositoriesContributedTo.edges.map((k) => k.node));
    after = repositoriesContributedTo.pageInfo.endCursor;

    if (!repositoriesContributedTo.pageInfo.hasNextPage) break;
  }

  data = data
    .filter((repo) => !repo.isPrivate && !repo.isFork)
    .filter((repo) => !excludes.some((e) => e.test(repo.nameWithOwner)));

  await cache.save(data, 'json');

  return data;
};
