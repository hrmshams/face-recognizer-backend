import sys
import os

f = open(os.path.abspath(os.path.dirname(__file__)) + "/testfile.txt", "w+")
f.write("This is a line\r\n")
f.close()

print('successfully created')
sys.stdout.flush()