import http from "k6/http";
import { sleep } from "k6";

export default function () {

    let mutationOpen = `
    mutation createwhisp {
        createWhisp(whisp:{applicationID:"TEST",closed:false}) {
        _id
        applicationID 
        }
    }
  `

    let mutationClosed = `
    mutation createwhisp {
        createWhisp(whisp:{applicationID:"TEST",closed:true}) {
        _id
        applicationID 
        }
    }
  `
  
    let headers = {
        "Content-Type": "application/json"
    };

    let res = http.post("http://localhost:3000/graphql",
        JSON.stringify({ query: mutationOpen }),
        { headers: headers }
    );

    res = http.post("http://localhost:3000/graphql",
        JSON.stringify({ query: mutationClosed }),
        { headers: headers }
    );

    sleep(0.3);
}