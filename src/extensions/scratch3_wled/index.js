const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

const icon = "data:image/png;base64,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";

class Scratch3Wled {
    constructor () {
        this.state = {
            segment: "",
            host: "",
            effects: ['Connect for effects'],
            segments: {'Connect for segments': 0}
        };
    }

    
    _sendData(args) {
        const data = new TextEncoder().encode(JSON.stringify(args))
        fetch("http://" + this.state.host + "/json/state", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: data // body data type must match "Content-Type" header
        });
    }

    _parseState(data) {
        this.state.effects = data.effects;
        this.state.segments = {};
        for(var seg of data.state.seg) {
            if ('n' in seg) {
                this.state.segments[seg.n] = seg;
            }
        }
    }

    _getWLED(args) {
        const data = new TextEncoder().encode(JSON.stringify(args))
        fetch("http://" + this.state.host + "/json", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }) .then(response => response.json())
        .then(data => this._parseState(data));
    }

    _initDisplay() {
        var seg_data = []
        for(var key in this.state.segments) {
            seg_data.push({
                on: false,
                fx: 0
            });
        }
        this._sendData({
            seg: seg_data
        });
    }

    /**
     * Initialize segment parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
     _initSegmentName() {
        return Object.keys(this.state.segments);
    }

    getFxName() {
        var items = [];
        for(var i=0; i<this.state.effects.length; i++) {
            items.push({
                text: this.state.effects[i],
                value: i
            });
        }
        return items;
    }

    getInfo () {
        return {
            id: 'wled',
            name: 'WLED Controls',
            blockIconURI: icon,
            menuIconURI: icon,
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        HOST: {
                            type: ArgumentType.STRING,
                            defaultValue: "WLED address"
                        }
                    },
                    text: 'Connect to WLED at [HOST]',
                },
                {
                    opcode: 'allOff',
                    blockType: BlockType.COMMAND,
                    text: 'turn all LEDs off'
                },
                {
                    opcode: 'allOn',
                    blockType: BlockType.COMMAND,
                    text: 'turn all LEDs on'
                },
                {
                    opcode: 'segmentOff',
                    blockType: BlockType.COMMAND,
                    text: 'turn selected segment off'
                },
                {
                    opcode: 'segmentOn',
                    blockType: BlockType.COMMAND,
                    text: 'turn selected segment on'
                },
                {
                    opcode: 'setSegmentColor',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR
                        }
                    },
                    text: 'set LED color to [COLOR]',
                },
                {
                    opcode: 'selectLedSegment',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SEGMENT_NAME: {
                            type: ArgumentType.STRING,
                            menu: 'segmentName',
                            defaultValue: Object.keys(this.state.segments)[0]
                        },
                    },
                    text: "control [SEGMENT_NAME] segment",
                },
                {
                    opcode: 'selectLedEffect',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FX_NAME: {
                            type: ArgumentType.STRING,
                            menu: 'fxName',
                            defaultValue: this.state.effects[0]
                        },
                    },
                    text: 'show the [FX_NAME] effect',
                },
            ],
            menus: {
                segmentName: {
                    acceptReporters: true,
                    items: '_initSegmentName'
                },
                fxName: {
                    items: 'getFxName'
                }
            }
        };
    }

    _setSegParam(param, val, util) {
        var data = {
            "seg": [{
              "id": this.state.segments[this.state.segment]['id'],
            }]	
        };
        data['seg'][0][param] = val
        this._sendData(data);
    }

    segmentOff(args, util) {
        this._setSegParam('on', false, util);
    }

    segmentOn(args, util) {
        this._setSegParam('on', true, util);
    }

    allOff (args) {
        this._sendData({
            on:false
        })
    }

    allOn (args) {
        this._sendData({
            on:true
        })
    }

    connect (args) {
        this.state.host = args.HOST;
        this._initDisplay();
        this._getWLED();
    }

    setSegmentColor(args, util) {
        const rgb = Cast.toRgbColorObject(args.COLOR);
        this._setSegParam('col', [	
            [rgb.r, rgb.g, rgb.b]	
          ], util);
    }

    selectLedEffect (args, util) {
        this._setSegParam('fx', args.FX_NAME, util);
    }

    selectLedSegment (args, util) {
        this.state.segment = args.SEGMENT_NAME;
    }
    
}

module.exports = Scratch3Wled;
