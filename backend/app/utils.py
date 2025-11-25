import cv2
import numpy as np
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


MAILTRAP_USERNAME = "cbd025e0963284"
MAILTRAP_PASSWORD = "a3a758a794ece5"
MAILTRAP_HOST = "sandbox.smtp.mailtrap.io"
MAILTRAP_PORT = 587  # Typically 2525 or 587


SECRET_KEY = "your_secret_key"  # Change to a strong secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expiration time (in minutes)
EMAIL_VERIFICATION_EXPIRE_MINUTES = 60 

# Function to create a JWT token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to create an email verification token
def create_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=EMAIL_VERIFICATION_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# Function to verify the token
def verify_email_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verification link expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid verification link")

# Function to verify the JWT token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

# Function to hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Function to verify a password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def analyze_skin_tone_from_image(image: np.ndarray) -> dict:
    """
    Analyze the skin tone of the face in an image and provide an explanation 
    based on facial skin regions (forehead, cheeks, chin).
    """
    # Convert image to YCrCb and LAB color spaces
    image_ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
    image_lab = cv2.cvtColor(image, cv2.COLOR_BGR2Lab)

    # Convert image to grayscale for face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load OpenCV pre-trained face detector (Haar cascade)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    if len(faces) == 0:
        return {"error": "No face detected in the image"}

    # Assume the first detected face is the primary subject
    x, y, w, h = faces[0]

    # Define key facial regions (forehead, left cheek, right cheek, chin)
    forehead = image[y:y + h // 5, x + w // 4:x + (3 * w) // 4]
    left_cheek = image[y + (2 * h) // 5:y + (4 * h) // 5, x:x + w // 3]
    right_cheek = image[y + (2 * h) // 5:y + (4 * h) // 5, x + (2 * w) // 3:x + w]
    chin = image[y + (4 * h) // 5:y + h, x + w // 4:x + (3 * w) // 4]

    # Function to get average Cr, Cb, and L values for a given region
    def get_avg_skin_tone(region):
        region_ycrcb = cv2.cvtColor(region, cv2.COLOR_BGR2YCrCb)
        region_lab = cv2.cvtColor(region, cv2.COLOR_BGR2Lab)
        avg_cr = np.mean(region_ycrcb[:, :, 1])
        avg_cb = np.mean(region_ycrcb[:, :, 2])
        avg_l = np.mean(region_lab[:, :, 0])
        return avg_l, avg_cr, avg_cb

    # Get average values for different regions
    l_forehead, cr_forehead, cb_forehead = get_avg_skin_tone(forehead)
    l_left_cheek, cr_left_cheek, cb_left_cheek = get_avg_skin_tone(left_cheek)
    l_right_cheek, cr_right_cheek, cb_right_cheek = get_avg_skin_tone(right_cheek)
    l_chin, cr_chin, cb_chin = get_avg_skin_tone(chin)

    # Average out the values for the entire face
    avg_l = (l_forehead + l_left_cheek + l_right_cheek + l_chin) / 4
    avg_cr = (cr_forehead + cr_left_cheek + cr_right_cheek + cr_chin) / 4
    avg_cb = (cb_forehead + cb_left_cheek + cb_right_cheek + cb_chin) / 4

    # Determine skin tone category with explanation based on facial features
    if avg_l > 190 and avg_cr > 140:
        skin_tone = "Very Fair"
        reason = (
            f"Your forehead and cheeks have high lightness (L > 190) and strong red chrominance (Cr > 140), "
            f"which indicates a very fair complexion with minimal melanin."
        )
    elif avg_l > 160 and avg_cr > 135:
        skin_tone = "Fair"
        reason = (
            f"Your forehead and cheeks show moderate brightness (L > 160) with noticeable red undertones (Cr > 135). "
            f"This suggests fair skin with a warm undertone."
        )
    elif avg_l > 130 and avg_cr > 130:
        skin_tone = "Medium"
        reason = (
            f"The lightness of your facial skin (L > 130) and balanced red chrominance (Cr > 130) "
            f"indicate a medium skin tone with a neutral undertone."
        )
    elif avg_l > 100 and avg_cr > 125:
        skin_tone = "Olive"
        reason = (
            f"Your cheeks and chin exhibit moderate lightness (L > 100) with warm red tones (Cr > 125), "
            f"suggesting an olive skin tone commonly found in Mediterranean or Middle Eastern complexions."
        )
    elif avg_l > 70 and avg_cr > 120:
        skin_tone = "Dark Brown"
        reason = (
            f"Your facial skin has a lower lightness level (L > 70) with strong melanin presence, "
            f"giving it a deep brown appearance."
        )
    else:
        skin_tone = "Deeply Pigmented"
        reason = (
            f"Your facial skin shows very low lightness (L < 70) with high melanin absorption, "
            f"resulting in a deeply pigmented complexion."
        )

    return {"skin_tone": skin_tone, "reason": reason}
    
# Function to send verification email
def send_verification_email(recipient_email: str, username: str, token: str):
    sender_email = "noreply@example.com"
    verification_link = f"http://localhost:8081/verify-email?token={token}"  # Adjust URL for frontend

    subject = "Verify Your Email"
    body = f"""
    Hi {username},

    Thank you for registering! Please verify your email by clicking the link below:

    {verification_link}

    This link will expire in 1 hour.

    Best regards,
    The Team
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(MAILTRAP_HOST, MAILTRAP_PORT) as server:
            server.starttls()
            server.login(MAILTRAP_USERNAME, MAILTRAP_PASSWORD)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"Verification email sent to {recipient_email}")
    except Exception as e:
        print(f"Error sending email: {e}")

