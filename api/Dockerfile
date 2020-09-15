FROM python:3.8.1-slim-buster

WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV MONGO_URI mongodb://root:liyang@192.168.1.123:27017/admin

RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ --upgrade pip 
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ -r requirements.txt

COPY . /usr/src/app/
