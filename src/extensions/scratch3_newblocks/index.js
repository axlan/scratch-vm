const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Color = require('../../util/color');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const http = require('http')
const log = require('../../util/log');

/**
 * Enum for pen color parameter values.
 * @readonly
 * @enum {string}
 */
 const ColorParam = {
    COLOR: 'color',
    SATURATION: 'saturation',
    BRIGHTNESS: 'brightness',
    TRANSPARENCY: 'transparency'
};

function sendData(args) {
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
                },
                {
                    opcode: 'setLedColor',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR
                        }
                    },
                    text: formatMessage({
                        id: 'newblocks.setLedColor',
                        default: 'set LED color to [COLOR]',
                        description: 'set the LED color to a particular (RGB) value'
                    }),
                },
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    /**
     * The pen "set pen color to {color}" block sets the pen to a particular RGB color.
     * The transparency is reset to 0.
     * @param {object} args - the block arguments.
     *  @property {int} COLOR - the color to set, expressed as a 24-bit RGB value (0xRRGGBB).
     * @param {object} util - utility object provided by the runtime.
     */
     setLedColor (args, util) {
        const rgb = Cast.toRgbColorObject(args.COLOR);
        sendData({
            "seg": [{	
              "col": [	
                [rgb.r, rgb.g, rgb.b]	
              ]		
            }]	
        })
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
