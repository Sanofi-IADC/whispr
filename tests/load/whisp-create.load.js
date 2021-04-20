/* eslint-disable */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  maxRedirects: 0,
  insecureSkipTLSVerify: true,
  scenarios: {
    loadTest: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 20 },
        // { duration: '30s', target: 50 },
        // { duration: '30s', target: 100 },
        // { duration: '30s', target: 200 },
        // { duration: '30s', target: 500 },
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

// eslint-disable-next-line func-names
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

  const response = http.post(url,
    JSON.stringify({ query: mutationOpen }),
    { headers });

  // const result = check(response, {
  //   'response has status code 200': (r) => r.status === 200,
  //   'repsonse does not contain error': (r) => r.headers['Retry-After'] === undefined,
  //   'response does contain data': (r) => {
  //     try {
  //       return (r.json() as any).data;
  //     } catch (error) {
  //       return false;
  //     }
  //   },
  // });
  // // This allows us to have a global check to display the succeeded request ratio in the results
  // check(response, { 'request succeed': () => result });

  sleep(0.5);
}
