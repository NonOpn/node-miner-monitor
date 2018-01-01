# node-miner-monitor

Simple library for NodeJS to monitor Claymore and Ethminer

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


# Install

```
npm install --save https://github.com/NonOpn/node-miner-monitor
```

# Use

## Implementation

The DataRetriever class must be given :
  - an object describing the miner to monitor
  - the createConnection function _{optionnal}_

Note : for React Native, it is mandatory (for now) to use the createConnection injection construction. Please head over our mobile app for example

## Pure NodeJS usage example

```
const DataRetriever = require("miner-monitor");

const retriever = new DataRetriever({
  host: "some_host",
  port: some_port
});

retriever
.then(state => {
  //state -> see below
})
.catch(err => {

});
```

# Format

The library returns a Promise whith an object describing the current miner state

```
{
  version: "version",
  uptime: "running for X minutes",
  total: {
    eth: {
      hashrate: "h/s",
      shares: "number of shares",
      rejected: "number of rejected shares"
    },
    dcr: {
      hashrate: "h/s",
      shares: "number of shares",
      rejected: "number of rejected shares"s
    }
  },
  gpus: [{
      hashrate: "h/s",
      hashrate_dcr: "h/s" or "off",
      temp: "" or "temp",
      fan_speed: "" or "%"
  }],
  pool: {
    mining_pool: {
      eth: "" or "url",
      dcr: "" or "url"
    },
    eth: {
      invalids: "number of invalid shares",
      switches: "number of switches"
    },
    dcr: {
      invalids: "number of invalid shares",
      switches: "number of switches"
    }
  },
  type: "ethminer" or "claymore"
}
```

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details
