# -*- coding: utf-8 -*-

from models import User
from flask_httpauth import HTTPBasicAuth
from flask import jsonify, g, request, Blueprint, abort
from config.database import db
from config.settings import TOKEN_DURATION, IP_BLACKLIST
from config.redis import redis_store

from include.ultils import validate_ip

api = Blueprint('api', __name__)

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@api.route('/api/users', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)  # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)  # existing user
    user = User(username=username, password=password)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'username': user.username})


@api.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(TOKEN_DURATION)
    return jsonify({'token': token.decode('ascii'), 'duration': TOKEN_DURATION})


@api.route('/api/add', methods=['POST'])
@auth.login_required
def add_ip_bl():
    ip = request.json.get('ip')
    ip_addr = validate_ip(ip)
    if ip_addr:
        redis_store.sadd(IP_BLACKLIST, ip)
        return jsonify({'Type': 'Add', 'Ip': ip})
    else:
        return jsonify({'Type': 'add clgt'})


@api.route('/api/del', methods=['POST'])
@auth.login_required
def del_ip_bl():
    ip = request.json.get('ip')
    ip_addr = validate_ip(ip)
    if ip_addr:
        redis_store.srem(IP_BLACKLIST, ip)
        return jsonify({'Type': 'Del', 'Ip': ip})
    else:
        return jsonify({'Type': 'Del clgt'})
