from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Boolean

# Base class for all models
Base = declarative_base()

# SQLite database URL
DATABASE_URL = "sqlite:///./test.db"

# Create database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    age = Column(Integer)
    gender = Column(String)
    verified = Column(Boolean, default=False)  # Added field to track verification status

# Create the database tables if they do not exist
Base.metadata.create_all(bind=engine)
