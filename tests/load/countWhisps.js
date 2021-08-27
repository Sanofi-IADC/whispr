/* eslint-disable */
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  maxRedirects: 0,
  insecureSkipTLSVerify: true,
  scenarios: {
    loadTest: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [

        { duration: '60s', target: 10 }
      ],
      tags: {
        application: 'whispr',
      },
      gracefulStop: __ENV.GRACEFUL_STOP ? __ENV.GRACEFUL_STOP : '30s',
    },
  },
};

// eslint-disable-next-line func-names
export default function () {

  const url = __ENV.ENVIRONMENT_URL || 'http://127.0.0.1:3000/graphql';

  const headers = {
    'Content-Type': 'application/json',
  };

  const numberOfQueries = 100;

  const variables = {
    "filter": buildFilter(numberOfQueries),
    "group": { "id": "$data.customData.id" }
  };

  const query = `query getWhispCount($filter: [JSONObject!], $group: JSONObject!) {
    countWhisps(filter: $filter, group: $group)
    {
      _id
      count
    }
  }`;

  http.post(url, JSON.stringify(
    { query: query, variables: variables }),
    { headers });

  sleep(1);
}

function buildFilter(numberOfQueries) {
  let filter = Array(numberOfQueries);
  for (let i = 0; i < numberOfQueries; i++) {
    filter[i] = ({
      "applicationID": "SMUDGE",
      "data.customData.id": `${i}`
    });
  }
  return filter;
}

function buildQueries(numberOfQueries) {
  let queries = Array(numberOfQueries);
  for (let i = 0; i < numberOfQueries; i++) {
    queries[i] = `count${i}: countWhisps(filter: $filter${i}, group : $variables.group)`;
  }
  return queries.join('\n');
}

function buildQueryParams(numberOfQueries) {
  let params = Array(numberOfQueries);
  for (let i = 0; i < numberOfQueries; i++) {
    params[i] = `$filter${i}: JSONObject!`;
  }
  return params.join(',');
}
