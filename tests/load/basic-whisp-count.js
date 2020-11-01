import http from "k6/http";
import { sleep } from "k6";

export default function () {

  let query = `
  query countWhisps1{
    whispsCount()
  }
  `

  let headers = {
    "Content-Type": "application/json"
  };

  let res = http.post("http://localhost:3000/graphql",
    JSON.stringify({ query: query }),
    { headers: headers }
  );

  query = `
   query countWhisps{
    whispsCount(filter: {applicationID:"TEST",closed:false})
  }
  `
  res = http.post("http://localhost:3000/graphql",
    JSON.stringify({ query: query }),
    { headers: headers }
  );

  query = `
  query countWhisps{
    whispsCount(filter: {applicationID:"TEST",closed:true})
  }
 `

  res = http.post("http://localhost:3000/graphql",
    JSON.stringify({ query: query }),
    { headers: headers }
  );

  sleep(0.3);
}