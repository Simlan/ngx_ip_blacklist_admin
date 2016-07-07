# -*- coding: utf-8 -*-

import socket
import hmac
import hashlib
import base64


def validate_ip(ip):

    try:
        socket.inet_aton(ip)
        return True

    except socket.error:
        return False


def verification_msg(key, msg):

    digest_maker = hmac.new(key=key, msg=msg, digestmod=hashlib.sha256)
    return base64.encodestring(digest_maker.hexdigest())
