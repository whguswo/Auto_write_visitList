import time
import busio
import board
import adafruit_amg88xx

i2c = busio.I2C(board.SCL, board.SDA)
amg = adafruit_amg88xx.AMG88XX(i2c)

time.sleep(0.5)
print(amg.pixels)
for row in amg.pixels:
    print(["{0:.1f}".format(temp) for temp in row])
    print("")
print("\n")

