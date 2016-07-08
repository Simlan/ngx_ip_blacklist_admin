from flask import Flask
from config.redis import redis_store
from config.database import db

import config.settings

from modules.ip_blacklist.controllers import ip_bl
from modules.ip_blacklist_api.controllers import api

application = Flask(__name__)
application.config.from_object(config.settings)
redis_store.init_app(application)

db.init_app(application)
application.register_blueprint(ip_bl)
application.register_blueprint(api)
