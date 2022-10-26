import { WebSocketServer } from 'ws'
import * as IPFS from 'ipfs-core'
const wss = new WebSocketServer({ port : 8002 });
const wssBrowser = new WebSocketServer({ port : 8003});

const ipfs = await IPFS.create();
// Expose netowrk field of the IPFS class
ipfs.bitswap.stat();
const bitswap = (await ipfs.network.use({})).bitswap;
const stats = bitswap.stat();
console.log(stats.snapshot);

wssBrowser.on("connection", wsBrowser => {
    console.log("Browser Connected!");
    wsBrowser.send('a');
    stats.on('update', (stats) => {
      console.log('Get updates!');
      console.log(bitswap.stat().snapshot);
      wsBrowser.send('a');
    });
});