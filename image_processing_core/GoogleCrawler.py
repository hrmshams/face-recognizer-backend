import sys
import os
from Database import Database
from google_images_download import google_images_download   #importing the library
response = google_images_download.googleimagesdownload()   #class instantiation

db = Database()
db.connect_db()

db.update('status', 'is_crawling=0', 'is_crawling=1')

result = db.where('people', 'is_crawled=0')
for r in result:
    arguments = {
        "keywords":r[1],
        "limit":5,
        "print_urls":False,
        "format": "jpg",
        "size": "medium",
    }
    paths = response.download(arguments)

    result = db.update ('people', "id={0}".format(r[0]), "is_crawled=1")
    print ("PRINT_result of updating is crawled {0}".format(result))
    print ("PRINT_crawling image for {0} is done".format(r[0]))

# print ("PRINT_access")
# db.update('status', 'is_crawling=1', 'is_crawling=0')
