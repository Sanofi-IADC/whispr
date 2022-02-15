/* eslint-disable */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  maxRedirects: 0,
  insecureSkipTLSVerify: true,
  scenarios: {
    loadTest: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [

        { duration: '300s', target: 100 }
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
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQ3OTM4NjksImV4cCI6MTY3NjMyOTg2OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.Z7u8Dd1WIKPxCT3mC4L6I4iccMUIbBigWdZVZUkvaEc'
  };


const variables = {
  "group": { "id": "$data.customData.id"}
};

  const query = `query getWhisps {
    whisps(limit: 100)
    {
      _id
    }
  }`;

  // const query = `query getWhisps {
  //   whispsAuthBeta(limit: 100)
  //   {
  //     _id
  //   }
  // }`;

  http.post(url, JSON.stringify(
    { query: query, variables: variables }),
    { headers });

  sleep(1);
}