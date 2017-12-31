import { createConnection } from "net";

const TIMEOUT = 10000;

class DataRetriever {
  constructor(monitor) {
    this.monitor = monitor;
  }

  call() {
    const monitor = this.monitor;

    return new Promise((resolve, reject) => {
      var rejected = false;
      let client = createConnection(monitor.port, monitor.host, () => {
        //if the following response call does not permit to make the difference
        //between claymore and ethminer
        //a change can be done : claymore does not wait for \n whereas ethminer does
        client.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}\n');
      });

      setTimeout(() => {
        if(!rejected) {
          rejected = true;
          client.destroy();
        }
      }, TIMEOUT);

      client.on('data', (data) => {
        try {
          const json = JSON.parse(data.toString());
          if(json) {
            if(json.result) {
              const array = json.result;
              const version = array[0];
              const running = array[1];
              const total = array[2].split(";");
              const hashrates = array[3].split(";");
              const total_dcr = array[4].split(";");
              const hashrates_dcr = array[5].split(";"); //if length = 1 AND gpu > 1, ethminer
              const temp_fanspeed = array[6].split(";");
              const mining_pool = array[7].split(";"); //length = 0 et nothing in it ethminer
              const eth_inv_switches_dcr_inv_dcr_switches = array[8].split(";");

              const has_dcr = total_dcr.filter(item => item != "off").length > 0;

              const object = {
                version: version,
                uptime: running,
                total: {
                  eth: {
                    hashrate: total[0],
                    shares: total[1],
                    rejected: total[2]
                  },
                  dcr: {
                    hashrate: total_dcr[0],
                    shares: total_dcr[1],
                    rejected: total_dcr[2]
                  }
                },
                gpus: hashrates.map((hashrate, i) => {
                  const gpu = {
                    hashrate: hashrate,
                    hashrate_dcr: (hashrates_dcr.length > i ? hashrates_dcr[i] : "off"), //default
                    temp: temp_fanspeed[i * 2],
                    fan_speed: temp_fanspeed[i * 2 + 1]
                  };
                  return gpu;
                }),
                pool: {
                  mining_pool: {
                    eth: mining_pool[0],
                    dcr: (mining_pool.length > 0 ? mining_pool[1] : "")
                  },
                  eth: {
                    invalids: eth_inv_switches_dcr_inv_dcr_switches[0],
                    switches: eth_inv_switches_dcr_inv_dcr_switches[1]
                  },
                  dcr: {
                    invalids: eth_inv_switches_dcr_inv_dcr_switches[2],
                    switches: eth_inv_switches_dcr_inv_dcr_switches[3]
                  }
                },
                type: ((mining_pool.length == 1 && mining_pool[0].length == 0) ? "ethminer":  "claymore")
              }

              resolve(object);
            } else {
              reject();
            }
          } else {
            reject();
          }
          rejected = true;
        }catch(e) {
          reject();
          rejected = true;
        }

        client.destroy(); // kill client after server's response
      });

      client.on('error', (error) => {
        reject();
        rejected = true;
      });

      client.on('close', () => {
        if(!rejected) {
          reject();
          rejected = true;
        }
      });
    });
  }
}


module.exports = DataRetriever;
