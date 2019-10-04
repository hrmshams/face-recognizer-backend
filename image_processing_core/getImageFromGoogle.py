import sys
import os
from google_images_download import google_images_download   #importing the library
response = google_images_download.googleimagesdownload()   #class instantiation

def getImage(name):
  arguments = {
      "keywords":name,
      "limit":1,
      "print_urls":False,
      "format": "jpg",
      "size": "medium",
      "output_directory": "singleDownload"
  }
  paths = response.download(arguments)

if __name__ == "__main__":
  name = ""
  count = 1
  while True:
    try:
      partname = sys.argv[count]
      name += partname + " "
      count += 1
    except:
      break

  name = name[:-1]

  getImage(name)

  folder = 'singleDownload/' + name
  ldr = os.listdir(folder)
  path = folder + "/" + ldr[0]

  os.rename(path, folder + '/1.jpg')

  print ("RESULT__crawled successfully")