from flask_migrate import Migrate
from app import app, db

migrate = Migrate(app, db)

if __name__ == '__main__':
    # This allows you to run migrations directly from this file
    from flask.cli import FlaskGroup
    cli = FlaskGroup(app)
    cli()