from flask import Flask
from config.redis import redis_store
from config.database import db

import config.settings

from modules.ip_blacklist.controllers import ip_bl
from modules.ip_blacklist_api.controllers import api

app = Flask(__name__)
app.config.from_object(config.settings)
redis_store.init_app(app)

db.init_app(app)
app.register_blueprint(ip_bl)
app.register_blueprint(api)

