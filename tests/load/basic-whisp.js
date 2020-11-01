import http from "k6/http";
import { sleep } from "k6";

export default function() {

  let query = `
  query WQ($filter: JSONObject!) {
    whisps(filter: $filter) {
      _id # fields you want to retrieve from the created whisp
      applicationID
      timestamp
      data  
    }
  }`;

  let headers = {
    "Content-Type": "application/json"
  };

  let res = http.post("http://localhost:3000/graphql",
    JSON.stringify({ query: query }),
    {headers: headers}
  );

  if (res.status === 200) {
    console.log(JSON.stringify(res.body));
    let body = JSON.parse(res.body);
    let whisp = body.data;
    console.log(whisp._id);

  }
  sleep(0.3);
}