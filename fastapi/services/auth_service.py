from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
import jwt
from google_auth_oauthlib.flow import Flow

load_dotenv()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

SCOPES = ["https://www.googleapis.com/auth/calendar"]

class AuthService:
    """
    Service for handling authentication.
    """

    security = HTTPBearer()
    SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

    @classmethod
    def get_current_user(cls, credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials

        try:
            payload = jwt.decode(
                token,
                cls.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload

        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

    @classmethod
    def get_google_auth_url(cls):
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI],
                }
            },
            scopes=SCOPES,
            redirect_uri=REDIRECT_URI,
        )

        auth_url, _ = flow.authorization_url(
            access_type="offline",  # gets refresh_token
            prompt="consent",
            include_granted_scopes="true"
        )
        return auth_url
    
    @staticmethod
    def exchange_code_for_tokens(code: str):
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI],
                }
            },
            scopes=SCOPES,
            redirect_uri=REDIRECT_URI,
        )

        flow.fetch_token(code=code)
        credentials = flow.credentials

        return {
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "expiry": credentials.expiry.isoformat()
        }
