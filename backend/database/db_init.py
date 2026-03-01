import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def init_local_db():
    conn = None
    try:
        # Connect to the local Docker container
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            dbname=os.getenv("DB_NAME")
        )
        cur = conn.cursor()

        # Create the schemas required for the project
        schemas = ["identity", "salary", "community"]
        for schema in schemas:
            cur.execute(f"CREATE SCHEMA IF NOT EXISTS {schema};")
            print(f"Schema '{schema}' created successfully.")

        conn.commit()
        print("\nLocal Database is ready for development!")

    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_local_db()