/* eslint-disable */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  maxRedirects: 0,
  insecureSkipTLSVerify: true,
  scenarios: {
    loadTest: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '10s', target: 20 },
        { duration: '20s', target: 20 },
        { duration: '10s', target: 50 },
        { duration: '30s', target: 50 },
        { duration: '10s', target: 100 },
        { duration: '20s', target: 100 },
        // { duration: '10s', target: 200 },
        // { duration: '30s', target: 200 },
        // { duration: '10s', target: 500 },
        // { duration: '20s', target: 500 },
        // { duration: '10s', target: 1000 },
        // { duration: '20s', target: 1000 },
        // { duration: '20s', target: 0 },
      ],
      tags: {
        application: 'whispr',
      },
      gracefulStop: __ENV.GRACEFUL_STOP ? __ENV.GRACEFUL_STOP : '30s',
    },
  },
  thresholds: {
    'failed requests': ['rate<0.01'], // threshold on a custom metric
    http_req_duration: ['p(95)<500'], // threshold on a standard metric
  },
};

export default function () {
  const mutationOpen = `
  mutation createwhisp {
    createWhisp(whisp:{applicationID:"SMUDGE", closed:false, data: {customData: {
      id: "1234",
      description: "a test whisp"
    }}}) {
    _id
    applicationID 
    }
  }
  `;

  const url = __ENV.ENVIRONMENT_URL || 'http://localhost:3000/graphql';

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url,
    JSON.stringify({ query: mutationOpen }),
    { headers });

  sleep(0.1);
}
