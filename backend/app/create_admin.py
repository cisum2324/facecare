from sqlalchemy.orm import Session
from utils import hash_password
from models import User, SessionLocal

# Create a new session
db: Session = SessionLocal()

# Define the admin user details
admin_username = "mdfcadmin"
admin_email = "mdfc@gmail.com"
admin_password = "medifacecare"
admin_hashed_password = hash_password(admin_password)

# Check if admin already exists
existing_admin = db.query(User).filter(User.email == admin_email).first()

if not existing_admin:
    admin_user = User(
        username=admin_username,
        email=admin_email,
        password_hash=admin_hashed_password,
        age=30,  # Set an arbitrary age
        gender="Other",  # Set a default gender
        verified=True  # Mark as verified
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    print("Admin user created successfully!")
else:
    print("Admin user already exists.")

# Close the session
db.close()
