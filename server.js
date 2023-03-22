const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });
const app = require('./app');
const fs = require('fs');
const http = require('http').createServer(app);
const port = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
    console.log('\n-------------------DOCUMENTATION-----------------------');
    console.log(`|  * Link: http://localhost:${port}/api-docs             |`);
    console.log(`|  * YAML: http://localhost:${port}/api-docs/toYAML      |`);
    console.log(`|  * JSON: http://localhost:${port}/api-docs/toJSON      |`);
    console.log('-------------------------------------------------------\n');
}

const grab = require('./controllers/grab');
const { ValidateIPaddress, ping } = require('./controllers/IP-tools');
(async () => {
    const allServers = await grab();
    // const allServers = require('./ips.json');
    const onlineServers = [];
    for (let server of allServers) {
        let time = await ping(server.ip);
        console.log(time);
        if (time) {
            onlineServers.push(server);
        }
    }

    fs.writeFile(
        'ips-online.json',
        JSON.stringify(onlineServers, null, 4),
        function (err) {
            if (err) {
                return next(err, 500);
            }
        }
    );
    console.log(onlineServers.length);
})();

http.listen(port, () => {
    console.log(
        `\n\nApp is running  on port ${port}, NODE_ENV: ${process.env?.NODE_ENV}, TERMINAL_TYPE: ${process.env?.TERMINAL_TYPE}\n`
    );
});
