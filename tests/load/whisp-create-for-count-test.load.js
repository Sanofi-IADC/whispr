/* eslint-disable */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  maxRedirects: 0,
  insecureSkipTLSVerify: true,
  scenarios: {
    loadTest: {
      executor: 'ramping-vus',
      startVUs: 2000,
      stages: [

        { duration: '600s', target: 500 }
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

  const url = __ENV.ENVIRONMENT_URL || 'http://127.0.0.1:3000/graphql';

  const headers = {
    'Content-Type': 'application/json',
  };

    const mutation = `
    mutation createwhisp {
      createWhisp(whisp:{applicationID:"SMUDGE", closed:false, data: {customData: {
        id: "${__VU}",
        id2: "${__ITER}"
      }}}) {
      _id
      applicationID 
      }
    }
    `;

    const response = http.post(url,
      JSON.stringify({ query: mutation }),
      { headers });

  sleep(1);
}
