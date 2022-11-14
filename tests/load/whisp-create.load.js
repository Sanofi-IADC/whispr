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
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 500 },
        { duration: '30s', target: 1000 }
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

  const query = `
  query Whisps( $sortTimestamp: JSONObject,$filter:JSONObject) {  
    whisps(sort:$sortTimestamp,filter:$filter,limit:1000) {    
      _id    
      #readableID  
      type   
      description 
      updated
      timestamp
      applicationID
      #data
      #openedById
      #openedBy
      expirationDate
      timeToLiveSec
      
  
    }
  }
  `;

  const variables = `
  {
    "sortUpdated": {
      "updated": "desc"
    },
    "sortTimestamp": {
      "timestamp": "desc"
    },
    "filter": {
      "type": "ACTION"
    }
  }
  `;

  const url = __ENV.ENVIRONMENT_URL || 'http://127.0.0.1:3000/graphql';

  const headers = {
    'Content-Type': 'application/json'
  };

  const response = http.post(url,
    JSON.stringify({ query: query,variables:variables }),
    { headers });

  const result = check(response, {
    'response has status code 200': (r) => r.status === 200,
    'repsonse does not contain error': (r) => !(r.json().errors && r.json().errors.length !== 0),
    'response does contain data': (r) => {
      try {
        return (r.json() ).data;
      } catch (error) {
        return false;
      }
    },
  });
  // // This allows us to have a global check to display the succeeded request ratio in the results
  //check(response, { 'request succeed': () => result });

  sleep(1);
}
