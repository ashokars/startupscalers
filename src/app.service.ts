import { Injectable, HttpException } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';
import axios, { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  private readonly esclient: elasticsearch.Client;
  private requestsData = [
    {
      "url": "http://doesNotExist.boldtech.co",
      "priority": 1
    },
    {
      "url": "http://boldtech.co",
      "priority": 7
    },
    {
      "url": "http://offline.boldtech.co",
      "priority": 2
    },
    {
      "url": "http://google.com",
      "priority": 4
    },
    {
      "url": "http://amazon.in",
      "priority": 3
    },
    {
      "url": "http://netflix.in",
      "priority": 2
    }
  ]

  constructor(private httpService: HttpService) {
    this.esclient = new elasticsearch.Client({
      host: "localhost:9200",
      log: 'trace',
    });
    this.esclient.ping({ requestTimeout: 3000 })
      .catch(err => {
        throw new HttpException({
          status: 'error',
          message: 'Unable to reach Elasticsearch cluster' + err
        }, 500);
      });
  }

  async findServer(){
    return await this.getServerStatus().then(res => {
      let resArray: any[] = res;
      let onlineServers: any[] = [];
      resArray.forEach((val, i) => {
        if (val === "Online") {
          onlineServers.push(this.requestsData[i])
        }
      })
      //find the least priority server
      let serverSelected={};
      onlineServers.forEach(server=>{
        serverSelected && server.priority>serverSelected['priority']?null:serverSelected=server;
      })
      if (serverSelected['url'])
      return axios.get(serverSelected['url']).then(res=>{console.log(res.data);return res.data}).catch(err=>console.log(err))
      return "<h1>ALL OFFLINE</h1>"
    })
  }

  async getServerStatus() {
    const requestArr = this.requestsData.map(async data => {
      let resp = "Offline"
      console.log(data.url)
      return axios.get(data.url, { timeout: 5000 })
        .then(response => { 
          if(response.status>=200&&response.status<300)
          resp="Online"
        })
        .catch(error => console.log(error.toString()))
        .then(()=>{
          return resp;
        })
    });

    return Promise.all(requestArr).then((data) => {
      let result = []
      data.map(d => result.push(d))
      return result
    })
  }

  async bulkInsert() {
    var payload = {
      "index": "world",
      "body": {
        "settings": {
          "analysis": {
            "analyzer": {
              "indexing_analyzer": {
                "tokenizer": "whitespace",
                "filter": ["lowercase", "edge_ngram_filter"]
              },
              "search_analyze": {
                "tokenizer": "whitespace",
                "filter": "lowercase"
              }
            },
            "filter": {
              "edge_ngram_filter": {
                "type": "nGram",
                "min_gram": 1,
                "max_gram": 10
              }
            }
          }
        },
        "mappings": {
          "world": {
            "_all": {
              "index_analyzer": "indexing_analyzer",
              "search_analyzer": "search_analyze"
           },
            "properties": {
              "city": {
                "type": "string",
                "term_vector":"yes",
                "index": "not_analyzed"
              },
              "state": {
                "type": "string",
                "term_vector":"yes",
                "index": "not_analyzed"
              },
              "country": {
                "type": "string",
                "term_vector":"yes",
                "index": "not_analyzed"
              }
            }
          }
        }
      }
    }
    this.esclient.indices.create(payload, (error, response) => {
      var _data = [{
        "id": "af68810e-7aea-4a53-9a83-b82d907fb0ca",
        "city_name": "Juegang",
        "state_name": "Wuhan",
        "country_name": "China"
      }, {
        "id": "b960d700-76f0-4768-9ffa-ac5f274ee820",
        "city_name": "Thi Tran Nghen",
        "state_name": "Vietnesse",
        "country_name": "Vietnam"
      }, {
        "id": "16c8a93b-37ad-4fc5-9ef9-44a7dd2e1be7",
        "city_name": "Jaguaribe",
        "state_name": "Cabo de Rame",
        "country_name": "Brazil"
      }, {
        "id": "9f80b888-45a1-49b9-b0c9-ecfb0cd855b6",
        "city_name": "Jimo",
        "state_name": "Woh oh Jin",
        "country_name": "China"
      }, {
        "id": "ea7d0627-0233-4a95-9fbc-d9812e1f13dc",
        "city_name": "Gualeguay",
        "state_name": "Gully Bay",
        "country_name": "Argentina"
      }, {
        "id": "79fdc3bf-8fd4-42a3-a211-5995b87fcd49",
        "city_name": "Shevchenkove",
        "state_name": "Kuruku theru",
        "country_name": "Ukraine"
      }, {
        "id": "47cdac07-b99f-4a08-baef-e8c21bef71d4",
        "city_name": "Glazov",
        "state_name": "Mins",
        "country_name": "Russia"
      }, {
        "id": "125ff464-1298-4fd1-9a62-594c63479105",
        "city_name": "Hidalgo",
        "state_name": "Chiapas",
        "country_name": "Mexico"
      }, {
        "id": "c3b49a85-68b4-47f7-83be-5235afd2d5ad",
        "city_name": "Slunj",
        "state_name": "Konirre",
        "country_name": "Croatia"
      }, {
        "id": "9871d078-1509-4b58-8842-2f53051ea9c5",
        "city_name": "Ibipora",
        "state_name": "Dsouza",
        "country_name": "Brazil"
      }];

      var data_array = [];
      for (var i = 0; i < _data.length; i++) {
        data_array.push(
          { index: { _index: "world", _type: "world", _id: _data[i].id } },
          { city: _data[i].city_name, state: _data[i].state_name, country: _data[i].country_name }
        )
        this.esclient.bulk({
          body: data_array
        }, function (error, response) {
          console.log(error);
          console.log(response);
        });
      }
    });
  }

  // searches the 'pokemons' index for matching documents
  async searchIndex(q: string) {
    return await this.esclient.search({
      index: "world", body: {
        query: {
          multi_match: {
            query: q.toString(),
            type: "phrase_prefix",
            fields: ["city", "state", "country"],
          }
        }
      }
    })
      .then(res => res.hits.hits)
      .catch(err => { throw new HttpException(err, 500); });
  }
}