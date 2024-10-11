import { AssetCache } from '@11ty/eleventy-fetch';
import { createGql } from '@ryanccn/gql';

import { format, subMonths, subDays, addDays } from 'date-fns';
import { logData } from '../utils/log.js';
import { dim } from 'kleur/colors';

const LIMIT = 19;

const excludes = [
  /^PolyMC\//, // dead project
  /^JayantGoel001\//, // joke repository
  /^Ampflower\/nocode$/, // joke repository
  /\.github$/, // configuration repositories
];

const gql = createGql('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

/**
 * @param {Date} from
 * @param {Date} to
 */
const queryContributions = (from, to) =>
  gql`
    query NotableContributions($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository {
              id

              name
              owner {
                login
              }
              nameWithOwner
              url

              stargazerCount
              isPrivate
              isFork
            }
          }
          hasActivityInThePast
        }
      }
    }
  `({
    from: from.toISOString(),
    to: to.toISOString(),
  });

export default async () => {
  if (!process.env.GITHUB_TOKEN) return [];

  const cache = new AssetCache('github_contributions');

  if (cache.isCacheValid('1d')) {
    logData('contributions', 'Using cached data');
    return await cache.getCachedValue();
  }

  let data = [];

  let cursor = new Date();

  while (true) {
    const from = addDays(subMonths(cursor, 6), 1);

    logData('contributions', `Fetching ${dim(`(${format(from, 'yyyy/MM/dd')}-${format(cursor, 'yyyy/MM/dd')})`)}`);

    const response = await queryContributions(from, cursor);

    if (!response.success) {
      throw new Error(`Error fetching GitHub contributions: ${response.error}`);
    }

    const {
      data: {
        viewer: {
          contributionsCollection: {
            pullRequestContributionsByRepository,
            hasActivityInThePast,
          },
        },
      },
    } = response;

    data.push(...pullRequestContributionsByRepository
      .map((k) => k.repository)
      .filter((repo) => !repo.isPrivate && !repo.isFork && repo.owner.login !== 'ryanccn')
      .filter((repo) => !excludes.some((e) => e.test(repo.nameWithOwner)))
      .filter((k) => !data.some((j) => j.id == k.id)),
    );

    cursor = subDays(from, 1);

    if (!hasActivityInThePast || data.length > LIMIT) break;
  }

  data = data
    .toSorted((a, b) => b.stargazerCount - a.stargazerCount)
    .slice(0, LIMIT);

  await cache.save(data, 'json');
  return data;
};
