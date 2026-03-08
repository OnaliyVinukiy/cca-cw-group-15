import os
from logging.config import fileConfig
from sqlalchemy import create_engine, pool, text
from alembic import context
from dotenv import load_dotenv

# Load .env from project root
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv(dotenv_path)

# Import your SQLAlchemy models
from database.models import Base  # <- your declarative_base
target_metadata = Base.metadata

# Alembic config object
config = context.config

# Setup logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Load DB credentials from environment variables with defaults
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "n111")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5433")  # your mapped Docker port
DB_NAME = os.getenv("DB_NAME", "tech_pay_scale_db")

# Compose SQLAlchemy URL
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Override the URL in alembic.ini dynamically
config.set_main_option("sqlalchemy.url", SQLALCHEMY_DATABASE_URL)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (no DB connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (DB connection required)."""
    connectable = create_engine(SQLALCHEMY_DATABASE_URL, poolclass=pool.NullPool)

    try:
        with connectable.connect() as connection:
            # Ensure schemas exist before running migrations
            for schema in ["community", "identity", "salary"]:
                connection.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema}"))

            context.configure(
                connection=connection,
                target_metadata=target_metadata,
            )

            with context.begin_transaction():
                context.run_migrations()
    except Exception as e:
        print("Database connection failed:", e)
        raise


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()