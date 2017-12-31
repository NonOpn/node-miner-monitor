# node-miner-monitor
NodeJS Miner monitor library

# Install

```
npm install --save https://github.com/NonOpn/node-miner-monitor
```

# Use

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
