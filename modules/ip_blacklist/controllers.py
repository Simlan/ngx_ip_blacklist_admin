# -*- coding: utf-8 -*-

from config.redis import redis_store
from config.settings import IP_BLACKLIST
from include.ultils import validate_ip
from flask import render_template, request, redirect, Blueprint

from modules.ip_blacklist_api.models import User
from flask_httpauth import HTTPBasicAuth

ip_bl = Blueprint('ip_bl', __name__, template_folder='templates')

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
    # g.user = user
    return True


@ip_bl.route('/')
@ip_bl.route('/list')
@auth.login_required
def list_ip_blacklist():
    ip_blacklist = redis_store.smembers(IP_BLACKLIST)
    return render_template('dashboard/list_ips.html', page_name='List IPs Blacklisted', ips=ip_blacklist)


@ip_bl.route('/delete/<ip>')
@auth.login_required
def del_ip_blacklist(ip):
    redis_store.srem(IP_BLACKLIST, ip)

    return redirect('/')


@ip_bl.route('/add', methods=['POST', 'GET'])
@auth.login_required
def add_ip_blacklist():
    if request.method == 'GET':
        return render_template('dashboard/add_ipb.html', page_name='Add IP Blacklist')
    else:
        ipb = request.form['ipb']
        ip_addr = validate_ip(ipb)
        if ip_addr:
            redis_store.sadd(IP_BLACKLIST, ipb)
            return redirect('/')
        else:
            return 'Deo phai ip'
