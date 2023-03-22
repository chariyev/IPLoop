const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { ValidateIPaddress, ping } = require('../IP-tools');
const HttpsProxyAgent = require('https-proxy-agent');
let agent = new HttpsProxyAgent('http://172.20.14.11:10809');

const url = 'https://www.vpngate.net/en';

module.exports = async () => {
    try {
        const { data } = await axios.get(url, {
            httpsAgent: agent,
        });
        const $ = cheerio.load(data);
        const listItems = $('table tbody tr');
        const SERVERS = [];

        listItems.each(async (idx, el) => {
            const server = {};

            server.county = $(el).children('td:nth(0)').text();
            server.hostName = $(el).children('td:nth(1)').children('b').text();
            server.ip = $(el).children('td:nth(1)').children('span').text();

            let ssl = $(el).children('td:nth(4)').text();
            if (ssl?.indexOf('TCP:') !== -1) {
                let TCP = ssl?.slice(ssl.indexOf('TCP: ') + 5)?.split('UDP:')[0]
                    ? ssl?.slice(ssl.indexOf('TCP: ') + 5)?.split('UDP:')[0]
                    : 'Unsupported';
                let UDP = ssl
                    ?.slice(ssl.indexOf('TCP: ') + 5)
                    ?.split('UDP: ')[1]
                    ? ssl?.slice(ssl.indexOf('TCP: ') + 5)?.split('UDP: ')[1]
                    : 'Unsupported';
                server.SSL = { TCP, UDP };
            }

            let OpenVpn = $(el).children('td:nth(4)').text();
            if (OpenVpn?.indexOf('TCP:') !== -1) {
                let TCP = OpenVpn?.slice(OpenVpn.indexOf('TCP: ') + 5)?.split(
                    'UDP: '
                )[0]
                    ? OpenVpn?.slice(OpenVpn.indexOf('TCP: ') + 5)?.split(
                          'UDP: '
                      )[0]
                    : 'Unsupported';
                let UDP = OpenVpn?.slice(OpenVpn.indexOf('TCP: ') + 5)?.split(
                    'UDP: '
                )[1]
                    ? OpenVpn?.slice(OpenVpn.indexOf('TCP: ') + 5)?.split(
                          'UDP: '
                      )[1]
                    : 'Unsupported';
                server.OpenVPN = { TCP, UDP };
            }

            if (
                ValidateIPaddress(server.ip) &&
                (server.OpenVPN || server.SSL)
            ) {
                SERVERS.push(server);
            }
        });
        fs.writeFile(
            'ips.json',
            JSON.stringify(SERVERS, null, 4),
            function (err) {
                if (err) {
                    return next(err, 500);
                }
            }
        );
        return SERVERS;
    } catch (err) {
        console.log(err);
        return [];
    }
};
