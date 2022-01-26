 1. Do an Npm Install 
 2. Start Elastic Service
 3. npm run start

Project 1 :
 Find active servers
  1. Hit http://localhost:3000/api/serverstatus will give you status of listed servers
     [
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
  2. Hit http://localhost:3000/api/findserver will render the online server with least priority if not will display offline status

Project 2:
  Autocomplete search 
  1. Hit http://localhost:3000/index.html for autocomplete
