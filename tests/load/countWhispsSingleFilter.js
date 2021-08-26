/* eslint-disable */

import http from 'k6/http';
import { check, sleep } from 'k6';

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


const variables = {
  // "filter": buildFilter(numberOfQueries),
  "group": { "id": "$data.customData.id"}
};

  const query = `query getWhispCount($group: JSONObject!) {
    countWhisps(filter: { applicationID: "SMUDGE" }, group: $group)
    {
      _id
      count
    }
  }`;

  const response = http.post(url,
    JSON.stringify({ query: query, variables: variables }),
    { headers });

  // console.log(response.body);

  sleep(1);
}

function buildFilter(numberOfQueries) {
  let filter = Array(numberOfQueries);
  for (let i = 0; i < numberOfQueries; i++) {
    filter[i] = ({
      "applicationID": "SMUDGE",
      "data.customData.id": `${i}`
    });
    // variables[`filter${i}`] = { "applicationID": "SMUDGE", "closed": "false", "data.customData.id": `${i}` }
  }
  // console.log(filter[0]['data.customData.id']);
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
