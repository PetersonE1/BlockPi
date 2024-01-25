Blockly.defineBlocksWithJsonArray([
    {
        "type": "time_wait",
        "message0": "Wait %1 Seconds",
        "args0": [
            {
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
]);

python.pythonGenerator.forBlock['time_wait'] = function (block) {
    var time = block.getFieldValue("NUM");

    return `time.sleep(${time})\n`;
};