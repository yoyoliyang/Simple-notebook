import os
from pymongo import MongoClient

with MongoClient(os.getenv('MONGO_URI')) as c:
    blog = c.simpleBlog.blog
    result = blog.find_one({
        "_id": '4f53dc88-ea2b-4a7f-90e7-314fbed786a7',
    })
    print(result)
