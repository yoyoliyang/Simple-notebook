import os
# 向上取整函数
from math import ceil
from pymongo import MongoClient
from flask import Flask, request
import jwt
import time
# 调试使用
from flask_cors import CORS
from bson.json_util import dumps
from functools import wraps


app = Flask(__name__, static_folder="../build", static_url_path="/")
CORS(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.get_json('token')
        token = token.get('token')
        print(token)
        if not token:
            return {'error': 'Token is missing!'}, 403
        try:
            jwt.decode(token, os.getenv('SECRET_KEY'))
        except jwt.exceptions.DecodeError:
            return {'error': 'Token is invalid!'}, 403

        return f(*args, **kwargs)
    return decorated


@app.route('/api/user', methods=['POST', 'GET'])
def user():
    if request.method == 'POST':
        request_data = request.get_json()
        print(request_data)
        with MongoClient(os.getenv('MONGO_URI')) as c:
            user = c.simpleBlog.user
            username = request_data.get('username')
            password = request_data.get('password')
            if user.find_one({"username": username, "password": password}):
                token = jwt.encode({'username': username, 'time': time.time()}, os.getenv(
                    'SECRET_KEY'), algorithm='HS256')
                token = token.decode('utf-8')
                print(token, username, password)
                user.find_one_and_update(
                    {"username": username},
                    {'$set': {'last_token': token}}
                )
                return {
                    'info': 'login successful', 'last_token': token, 'username': username
                }
            else:
                return {'info': 'login failed'}
    return {'info': 'user api'}


@ app.route('/api/check_token', methods=['POST', 'GET'])
def check_token():
    if request.method == 'POST':
        request_data = request.get_json()
        token = request_data.get('last_token')
        print(token)
        with MongoClient(os.getenv('MONGO_URI')) as c:
            user = c.simpleBlog.user
            if user.find_one({'last_token': token}):
                return {'loginStatus': True}
            else:
                return {'error': 'error login status'}, 403
    return {'info': 'token check api'}


@ app.route('/api/blog/<uuid:id>')
def blog_id(id):

    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        result = blog.find_one({'_id': str(id)})
        print(result)
        if result:
            return result
        else:
            return {'info': f'blog with id({id}) not found'}
    return {'info': 'blog view api'}


@ app.route('/api/blog/<string:last>')
def blog_last(last):
    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        if last == "count":
            return {'count': blog.count()}

        # /api/blog/last?index=number
        if last == "last" and 'index' in request.args:
            index = request.args.get('index')
            print(index)
            # 按_id排序
            result = blog.find(limit=int(index)).sort("timestamp", 1)
            if result:
                return dumps(result)
            else:
                return {'info': 'blog list not found'}

        # /api/blog/last?page=number
        if last == "last" and 'page' in request.args:
            # 此处取页面的count，每页10篇blog
            page_count = ceil(blog.count() / 10)
            try:
                req_page_num = int(request.args.get('page'))
            except ValueError:
                return {'error': 'error list request page number'}, 400
            if req_page_num > page_count or req_page_num <= 0:
                return {'error': 'error request page number'}, 400
            else:
                # skip跳过页面
                result = blog.find(
                    limit=10, skip=req_page_num-1).sort("timestamp", 1)
                if result:
                    return dumps(result)
                else:
                    return {'info': 'blog list not found'}
        else:
            return {'error': 'error list request'}, 400
    return {'info': 'blog list api'}


# add or update
@ app.route('/api/blog/<string:action>', methods=['POST', 'GET'])
@token_required
def blog_add(action):
    if request.method == "POST" and (action == "add" or action == "update"):
        request_data = request.get_json()
        if request_data:
            with MongoClient(os.getenv('MONGO_URI')) as c:
                blog = c.simpleBlog.blog
                if action == "add":
                    blog.insert_one(
                        {"_id": request_data.get('_id'),
                         "timestamp": request_data.get('timestamp'),
                         "subject": request_data.get('subject'),
                         "data": request_data.get('data'),
                         "tag": request_data.get('tag')
                         })
                    return {
                        'info': 'successfully added'
                    }
                if action == "update":
                    blog.find_one_and_update(
                        {"_id": request_data.get('_id')},
                        {'$set': {'subject': request_data.get(
                            'subject'), 'data': request_data.get('data')}}
                    )
                    return {
                        'info': 'successfully updated'
                    }
        else:
            return {'error': 'error request'}, 400
    return {'info': 'blog add api'}


@ app.route('/api/blog/del', methods=['POST', 'GET'])
def blog_delete():
    if request.method == "POST":
        request_data = request.get_json()
        if request_data:
            with MongoClient(os.getenv('MONGO_URI')) as c:
                blog = c.simpleBlog.blog
                _id = request_data.get('_id')
                result = blog.find_one_and_delete(
                    {"_id": _id})
                if result:
                    return {'info': f'blog with id({_id}) successfully deleted'}
                else:
                    return {'error': f'blog with id({_id}) not found'}
        else:
            return {'error': 'error requests'}, 400
    return {'info': 'blog del api'}
