const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Color = require('../../util/color');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const http = require('http')
const log = require('../../util/log');

const SEGMENTS = {
    eagle: {
        start: 0,
        len: 16,
        id: 0
    },
    deer: {
        start: 16,
        len: 16,
        id: 1
    },
    lion: {
        start: 32,
        len: 16,
        id: 2
    }
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
            'Content-Length': data.length
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

function initDisplay() {
    seg_data = []
    for(var key in SEGMENTS) {
        seg_data.push({
            start: SEGMENTS[key].start,
            len: 16,
            on: false,
            fx: 0
        });
    }
    sendData({
        seg: seg_data
    });
}

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;

        this._onTargetCreated = this._onTargetCreated.bind(this);

        runtime.on('targetWasCreated', this._onTargetCreated);

        initDisplay();
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.leds';
    }

    /**
     * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
     * @private
     */
    _getState (target) {
        let state = target.getCustomState(Scratch3NewBlocks.STATE_KEY);
        if (!state) {
            state = {segment: Object.keys(SEGMENTS)[0]};
            target.setCustomState(Scratch3NewBlocks.STATE_KEY, state);
        }
        return state;
    }
    

    /**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
     _initSegmentName() {
        items = [];
        for(var key in SEGMENTS) {
            items.push({
                text: key,
                value: key
            });
        }
        return items;
    }

    /**
     * When a pen-using Target is cloned, clone the pen state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const state = sourceTarget.getCustomState(Scratch3NewBlocks.STATE_KEY);
            if (state) {
                newTarget.setCustomState(Scratch3NewBlocks.STATE_KEY, Clone.simple(state));
            }
        }
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
                {
                    opcode: 'selectLedSegment',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SEGMENT_NAME: {
                            type: ArgumentType.STRING,
                            menu: 'segmentName',
                            defaultValue: Object.keys(SEGMENTS)[0]
                        },
                    },
                    text: formatMessage({
                        id: 'newblocks.selectLedSegment',
                        default: 'control [SEGMENT_NAME] segment',
                        description: 'select the LED segment to control'
                    }),
                },
            ],
            menus: {
                segmentName: {
                    acceptReporters: true,
                    items: this._initSegmentName()
                }
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
        const target = util.target;
        var state = this._getState(target)
        sendData({
            "seg": [{
              "id": SEGMENTS[state.segment].id,
              "col": [	
                [rgb.r, rgb.g, rgb.b]	
              ],
              "on": true
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

    selectLedSegment (args, util) {
        const target = util.target;
        var state = this._getState(target);
        state.segment = args.SEGMENT_NAME;
        target.setCustomState(Scratch3NewBlocks.STATE_KEY, state);
    }
}

module.exports = Scratch3NewBlocks;
