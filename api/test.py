import os
from pymongo import MongoClient
from faker import Faker

fake = Faker('zh_CN')
with MongoClient(os.getenv('MONGO_URI')) as c:
    # blog = c.simpleBlog.blog
    user = c.simpleBlog.user
    user.insert_one({
        "username": 'yang',
        'email': 'yoyoliyang@gmail.com',
        "password": ''
    })
