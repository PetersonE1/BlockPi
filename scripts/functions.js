let funcsList = [
`  def getPinState(pin):
    func = GPIO.gpio_function(pin)
    if func == GPIO.IN:
      return GPIO.input(pin)
    else:
      raise Exception(f"Pin {pin} not set to input")
`,
]