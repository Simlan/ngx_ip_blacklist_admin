# -*- coding: utf-8 -*-
from ngx_ipblacklist import application
from config.database import db


@application.before_first_request
def create_user():
    db.create_all()

if __name__ == '__main__':
    application.run(port=6099)
