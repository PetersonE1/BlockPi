Blockly.defineBlocksWithJsonArray([
    {
        "type": "gpio_pin_define",
        "message0": "Define Pin %1 as %2",
        "args0": [
            {
                "type": "field_number",
                "name": "PIN",
            },
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["Input", "IN"],
                    ["Output", "OUT"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    {
        "type": "gpio_pin_set",
        "message0": "Set Pin %1 to %2",
        "args0": [
            {
                "type": "field_number",
                "name": "PIN",
            },
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    ["ON", "GPIO.HIGH"],
                    ["OFF", "GPIO.LOW"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    {
        "type": "gpio_pin_get",
        "message0": "Pin %1 State",
        "args0": [
            {
                "type": "field_number",
                "name": "PIN",
                "value": 0
            }
        ],
        "output": "String",
        "colour": 160
    },
    {
        "type": "gpio_state_enum",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    ["ON", "GPIO.LOW"],
                    ["OFF", "GPIO.HIGH"],
                    ["UNSET", "GPIO.UNKNOWN"]
                ]
            }
        ],
        "output": "String",
        "colour": 160
    },
    {
        "type": "gpio_pwm_set",
        "message0": "Pin %1 as PWM",
        "message1": "at %1 Hz",
        "args0": [
            {
                "type": "field_number",
                "name": "PIN",
                "value": 0
            }
        ],
        "args1": [
            {
                "type": "field_number",
                "name": "NUM",
                "value": 1000
            }
        ],
        "output": "String",
        "colour": 160
    },
    {
        "type": "gpio_pwm_start",
        "message0": "Start PWM %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    {
        "type": "gpio_pwm_stop",
        "message0": "Stop PWM %1",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    {
        "type": "gpio_pwm_duty",
        "message0": "Set Duty Cycle of %1 to %2 %%",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_value",
                "name": "NUM",
                "check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

python.pythonGenerator.forBlock['gpio_pin_define'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var state = block.getFieldValue("TYPE");

    if (state == "IN") {
        return `GPIO.setup(${pin}, GPIO.IN, pull_up_down=GPIO.PUD_UP)\n`;
    }

    if (state == "OUT") {
        return `GPIO.setup(${pin}, GPIO.OUT)\n`;
    }

    return "";
};

python.pythonGenerator.forBlock['gpio_pin_set'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var state = block.getFieldValue("STATE");

    var code =
`func = GPIO.gpio_function(${pin})
if func == GPIO.OUT:
  GPIO.output(${pin}, ${state})
else:
  raise Exception("Pin ${pin} not set to output")
`;

    return code;
};

python.pythonGenerator.forBlock['gpio_pin_get'] = function (block) {
    var pin = block.getFieldValue("PIN");
    
    return [`getPinState(${pin})`, python.Order.NONE];
};

python.pythonGenerator.forBlock['gpio_state_enum'] = function (block) {
    var state = block.getFieldValue("STATE");

    return [state, python.Order.NONE];
};

python.pythonGenerator.forBlock['gpio_pwm_set'] = function (block) {
    var pin = block.getFieldValue("PIN");
    var frequency = block.getFieldValue("NUM");

    return [`GPIO.PWM(${pin}, ${frequency})`, python.Order.NONE];
};

python.pythonGenerator.forBlock['gpio_pwm_start'] = function (block) {
    var input_block = block.getInput('VALUE').connection.targetBlock();

    if (input_block) {
        var pwm = python.pythonGenerator.getVariableName(input_block.getFieldValue('VAR'));
        var code =
            `
pwm_pins.append(${pwm})
${pwm}.start(0)
`
        return code;
    }

    return "";
};

python.pythonGenerator.forBlock['gpio_pwm_stop'] = function (block) {
    var input_block = block.getInput('VALUE').connection.targetBlock();

    if (input_block) {
        var pwm = python.pythonGenerator.getVariableName(input_block.getFieldValue('VAR'));
        var code =
            `
pwm_pins.remove(${pwm})
${pwm}.stop()
`
        return code;
    }

    return "";
};

python.pythonGenerator.forBlock['gpio_pwm_duty'] = function (block) {
    var input_block = block.getInput('VALUE').connection.targetBlock();
    var input_block_2 = block.getInput('NUM').connection.targetBlock();

    var duty = 0;
    if (input_block_2) {
        duty = input_block_2.getFieldValue('NUM');
        if (duty == null) {
            duty = python.pythonGenerator.getVariableName(input_block_2.getFieldValue('VAR'));
        }
    }

    if (input_block) {
        var pwm = python.pythonGenerator.getVariableName(input_block.getFieldValue('VAR'));
        var code =
`
${pwm}.ChangeDutyCycle(${duty})
`
        return code;
    }

    return "";
};