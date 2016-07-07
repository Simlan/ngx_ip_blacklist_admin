# -*- coding: utf-8 -*-
from ngx_ipblacklist import app
from config.database import db


@app.before_first_request
def create_user():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6699)


