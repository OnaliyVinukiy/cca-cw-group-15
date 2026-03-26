from db_connection import engine, Base

def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully!")
if __name__ == "__main__":
    create_tables()