const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

//import ky from 'ky';

function sendData(args) {
    const http = require('http')

    const data = new TextEncoder().encode(JSON.stringify(args))

    const options = {
        hostname: '192.168.1.123',
        port: 80,
        path: '/json/state',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
    // const json = await ky.post('http://192.168.1.123/json/state', {json: args}).json();

    // console.log(json);
}

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'ledsOff',
                    blockType: BlockType.COMMAND,
                    text: 'turn LEDs off'
                },
                {
                    opcode: 'ledsOn',
                    blockType: BlockType.COMMAND,
                    text: 'turn LEDs on'
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }


    

    ledsOff (args) {
        sendData({
            on:false
        })
    }

    ledsOn (args) {
        sendData({
            on:true
        })
    }
}

module.exports = Scratch3NewBlocks;
