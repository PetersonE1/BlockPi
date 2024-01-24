Blockly.defineBlocksWithJsonArray([
    {
        "type": "write_debug",
        "message0": "Log %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

javascript.javascriptGenerator.forBlock['write_debug'] = function (block) {
    var input_block = block.getInput('VALUE').connection.targetBlock();

    var is_variable = false;
    let input = input_block ? input_block.getFieldValue('TEXT')
        ?? input_block.getFieldValue('NUM')
        ?? input_block.getFieldValue('BOOL')
        ?? input_block.getFieldValue('COLOUR') : 'No input supplied';

    if (input == null) {
        var temp_input = input_block.getFieldValue('VAR');
        if (temp_input != null) {
            input = javascript.javascriptGenerator.getVariableName(temp_input);
            is_variable = true;
        }
    }

    let value = '\'' + input + '\'';

    if (is_variable) {
        value = value.substring(0, value.length - 1);
        value += ' = \' + ' + input;
    }

    return 'console.log(' + value + ');\n';
};

python.pythonGenerator.forBlock['write_debug'] = function (block) {
    var input_block = block.getInput('VALUE').connection.targetBlock();

    var is_variable = false;
    let input = input_block ? input_block.getFieldValue('TEXT')
        ?? input_block.getFieldValue('NUM')
        ?? input_block.getFieldValue('BOOL')
        ?? input_block.getFieldValue('COLOUR') : 'No input supplied';

    if (input == null) {
        var temp_input = input_block.getFieldValue('VAR');
        if (temp_input != null) {
            input = python.pythonGenerator.getVariableName(temp_input);
            is_variable = true;
        }
    }

    let value = '\'' + input + '\'';

    if (is_variable) {
        value = value.substring(0, value.length - 1);
        value += ' = \' + ' + input;
    }

    return 'print(' + value + ');\n';
};