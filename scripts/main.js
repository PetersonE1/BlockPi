/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
(function () {
    function toFile() {
        let code = 
`import RPi.GPIO as GPIO
import time
import math
pwm_pins = []
try:
`;
        code +=
`  GPIO.setmode(GPIO.BOARD)
`
        for (func in funcsList) {
            code += funcsList[func];
        }
        let lines = python.pythonGenerator.workspaceToCode(Blockly.getMainWorkspace()).match(/[^\r\n]+/g);
        for (line in lines)
            code += "  " + lines[line] + '\n';
        code +=
`except (KeyboardInterrupt):
  pass
finally:
  for pin in pwm_pins:
    pin.stop()
  GPIO.cleanup()
`;
        console.log(code);

        var file = new Blob([code]);
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, "compiled_code");
        else {
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = "compiled_code.py";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    function save() {
        var save = JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()));
        console.log(save);
        
        var file = new Blob([save]);
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, "blockstate.block")
        else {
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = "blockstate.block";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    function load(event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                var content = e.target.result;
                if (content) {
                    try {
                        content = JSON.parse(content);
                        console.log(content);
                        Blockly.serialization.workspaces.load(content, Blockly.getMainWorkspace());
                    } catch (error) {
                        console.log(error);
                    }
                }
            };
        })(file);

        reader.readAsText(file);
    }

    document.querySelector('#export').addEventListener('click', toFile);
    document.querySelector('#save').addEventListener('click', save);
    document.querySelector('#load').addEventListener('click', () => {
        var input = document.getElementById("i_load");
        input.addEventListener('change', load, false);
        input.click();
    });

    Blockly.inject("blocklyDiv", {
        toolbox: Toolbox,
        scrollbars: false,
        horizontalLayout: false,
        toolboxPosition: "start",
    });
})();
