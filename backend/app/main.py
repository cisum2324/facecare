from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from .utils import (
    analyze_skin_tone_from_image,
    hash_password,
    verify_password,
    create_access_token,
    create_verification_token,
    send_verification_email,
    verify_email_token,
)
from .models import User, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import requests

app = FastAPI()

# Allow CORS for frontend development (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Local development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

API_KEY = "YB0lbqFVWM1RfEzwz7r5IFy_tEKP-XB8"
API_SECRET = "Nc3ju99g5lBqJBW17yCb_qPHwH9_ag0Q"
FACEPP_API_URL = "https://api-us.faceplusplus.com/facepp/v3/detect"

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/")
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter((User.username == username) | (User.email == email)).first()

    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed_password = hash_password(password)
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        age=age,
        gender=gender,
        verified=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send verification email
    token = create_verification_token(email)
    send_verification_email(email, username, token)

    return JSONResponse(content={"message": "User registered. Please verify your email."})

@app.get("/verify-email/")
async def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_email_token(token)

    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    db_user.verified = True
    db.commit()
    db.refresh(db_user)

    return JSONResponse(content={"message": "Email verified successfully! You can now log in."})

@app.post("/login/")
async def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == email).first()

    if not db_user or not verify_password(password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not db_user.verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please check your email.")

    access_token = create_access_token(data={"sub": db_user.username})
    return JSONResponse(content={"message": "Login successful", "token": access_token})

@app.get("/users/", response_model=List[dict])
async def get_users(db: Session = Depends(get_db)):
    """
    Retrieve a list of all registered users.
    """
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "age": user.age,
            "gender": user.gender,
            "verified": user.verified,
        }
        for user in users
    ]

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    """
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()

    return JSONResponse(content={"message": f"User {db_user.username} deleted successfully."})

@app.post("/analyze-skin-tone/")
async def analyze_skin_tone(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        print(f"Received file: {file.filename}, Content Type: {file.content_type}")

        # Read the image file into memory
        image_bytes = await file.read()
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Analyze skin tone
        result = analyze_skin_tone_from_image(image)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return result  # Now includes both "skin_tone" and "reason"

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-skin/")
async def analyze_skin(file: UploadFile = File(...)):
    try:
        # Check if the file is received
        print(f"Received file: {file.filename}, Content Type: {file.content_type}")

        image_bytes = await file.read()
        if not image_bytes:
            print("Error: Empty file received")
            raise HTTPException(status_code=400, detail="Empty file received")

        print(f"File read successfully, size: {len(image_bytes)} bytes")

        # Prepare API request
        files = {"image_file": ("filename.jpg", image_bytes)}
        params = {
            "api_key": API_KEY,
            "api_secret": API_SECRET,
            "return_attributes": "skinstatus",
        }

        # Send request to Face++ API
        response = requests.post(FACEPP_API_URL, files=files, data=params)

        # Log API response
        print("Face++ API Response:", response.status_code, response.text)

        if response.status_code != 200:
            print("Error: Face++ API request failed")
            raise HTTPException(status_code=response.status_code, detail=f"Face++ API request failed: {response.text}")

        # Extract skin analysis data
        data = response.json()
        if "faces" not in data or not data["faces"]:
            print("Error: No face detected in the image")
            raise HTTPException(status_code=400, detail="No face detected in the image")

        skin_status = data["faces"][0]["attributes"]["skinstatus"]

        print("Skin analysis result:", skin_status)

        return {"skin_analysis": skin_status}

    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

