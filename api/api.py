import os
# 向上取整函数
from math import ceil
import time
import click
from pymongo import MongoClient
from flask import Flask, request, make_response, send_file
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_cors import CORS
from bson.json_util import dumps
from functools import wraps
from base64 import b64decode
import io

app = Flask(__name__, static_folder="../build", static_url_path="/")

CORS(app)


# debug调试输出颜色
def log_color(s):
    CRED = '\033[91m'
    CEND = '\033[0m'
    return CRED+s+CEND

# 重置管理员


@app.cli.command('reset-user')
def reset_user():
    """reset user to default(admin,your password)"""
    pswd = input('input password:')
    with MongoClient(os.getenv('MONGO_URI')) as c:
        user = c.simpleBlog.user
        user.find_one_and_delete({'user': 'admin'})
        user.insert_one({
            'username': 'admin',
            'password': generate_password_hash(pswd)
        })


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json('token')
        token = data.get('token')
        if not token:
            print(log_color('debug:(token_required):Token is missing!'))
            return {'error': 'Token is missing!'}, 401
        try:
            jwt.decode(token, os.getenv('SECRET_KEY'))
        except jwt.exceptions.DecodeError:
            return {'error': 'Token is invalid!'}, 400
        except jwt.exceptions.ExpiredSignatureError:
            return {'error': 'Token is expired!'}, 401

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
            result = user.find_one({"username": username})
            if result:
                password_hash = result.get('password')
                if check_password_hash(password_hash, password):
                    # 生成token并设定到期日+8hour
                    token = jwt.encode({'username': username, 'exp': ceil(time.time()) + 28800}, os.getenv(
                        'SECRET_KEY'), algorithm='HS256')
                    token = token.decode('utf-8')
                    user.find_one_and_update(
                        {"username": username},
                        {'$set': {'token': token}}
                    )
                    return {
                        'info': 'login successful', 'token': token, 'username': username
                    }, 200
                else:
                    return {
                        'info': 'error username or password'
                    }, 401
            else:
                return {'info': 'error username or password'}, 400
    return {'info': 'user api'}


@app.route('/api/check_token', methods=['POST', 'GET'])
# token检测
@token_required
def check_token():
    return {'message': 'success'}, 200


# uuid 格式url
@app.route('/api/blog/<uuid:id>')
def blog_id(id):
    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        result = blog.find_one({'_id': str(id)})
        # print('debug: blog_id-', result)
        if result:
            return result, 200
        else:
            return {'info': f'blog with id({id}) not found'}, 400
    return {'info': 'blog view api'}


@app.route('/api/search')
# /api/search?keyword=someword
def search():
    # search api
    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        if 'keyword' in request.args:
            keyword = request.args.get('keyword')
            # pymongo 正则判断及运算符
            result = blog.find({
                '$or':
                [
                    {'subject': {'$regex': keyword}},
                    {'data': {'$regex': keyword}}
                ]
            })
            return dumps(result)
    return {'info': 'blog search api'}


# get blog list data
@app.route('/api/blog/<string:last>')
def blog_last(last):
    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        if last == "count":
            return {'count': blog.count()}

        # /api/blog/last?index=number
        if last == "last" and 'index' in request.args:
            index = request.args.get('index')
            try:
                req_idx_num = int(index)
            except ValueError:
                return {'error': 'error index number'}
            # 按_id排序,-1为降序
            result = blog.find(limit=req_idx_num).sort("timestamp", -1)
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
            # 错误页数请求处理
            if req_page_num > page_count or req_page_num <= 0:
                return {'error': 'error request page number', 'count': blog.count()}
            else:
                # skip跳过页面
                result = blog.find(
                    limit=10, skip=req_page_num-1).sort("timestamp", -1)
                if result:
                    return dumps(result), 200
                else:
                    return {'info': 'blog list not found', 'count': 0}, 200
        else:
            return {'error': 'error list request'}, 400
    return {'info': 'blog list api'}

# img api
@app.route('/api/img/<string:id>')
def img_path(id):
    with MongoClient(os.getenv('MONGO_URI')) as c:
        blog = c.simpleBlog.blog
        # 获取blog id
        _id = id.split('--')[0]
        result = blog.find_one({'_id': _id})
        if result:
            base64str = result.get('image').get(id)
            # return base64str
            if base64str:
                # base64代码转为二进制
                img_binary = b64decode(base64str.split(',')[1])
                response = send_file(io.BytesIO(img_binary), 
                    mimetype="image/png",
                    # 作为下载附件的参数
                    # as_attachment=True,
                    # attachment_filename=f'{id}.png'
                    )
                return response
            else:
                return '', 404
        else:
            return {'info': f'not found blog with id {id}'}, 404
        
    return {
        'info': 'blog img api'
    }


# add or update
@app.route('/api/blog/<string:action>', methods=['POST', 'GET'])
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
                         "image": request_data.get('image'),
                         "tag": request_data.get('tag')
                         })
                    return {
                        'info': 'successfully added'
                    }, 200
                if action == "update":
                    blog.find_one_and_update(
                        {"_id": request_data.get('_id')},
                        {'$set': {'subject': request_data.get(
                            'subject'), 'timestamp': request_data.get('timestamp'),
                            'data': request_data.get('data'),
                            "image": request_data.get('image')
                            }}
                    )
                    return {
                        'info': 'successfully updated'
                    }, 200
        else:
            return {'error': 'error request'}, 400
    return {'info': 'blog add api'}


@app.route('/api/blog/del', methods=['POST', 'GET'])
@token_required
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
                    return {'error': f'blog with id({_id}) not found'}, 400
        else:
            return {'error': 'error requests'}, 400
    return {'info': 'blog del api'}
