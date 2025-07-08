from dotenv import load_dotenv
import os
import jwt
import mysql.connector
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://charlesdesc.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY est manquant. Vérifie ton .env et le montage Docker.")
SECRET_KEY = str(SECRET_KEY)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


@app.get("/")
async def hello_world():
    return "Hello world"


@app.get("/users/public")
async def get_users():
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_ROOT_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    sql_select_Query = "select username from user"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    return {'utilisateurs': records}


def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant ou invalide")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalide")


@app.get("/users/private")
async def get_private_users(user=Depends(verify_token)):
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Accès interdit")

    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_ROOT_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    sql_select_Query = "SELECT id, username, email, is_admin FROM user"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    return {'utilisateurs': records}


@app.post("/users")
async def create_user(user: dict):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_ROOT_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    sql_insert_Query = "INSERT INTO user (username, email, password, is_admin) VALUES (%s, %s, %s, %s)"
    values = (user['username'], user['email'], user['password'], user['is_admin'])
    cursor.execute(sql_insert_Query, values)
    conn.commit()
    return {'message': 'User created successfully', 'user_id': cursor.lastrowid}


@app.delete("/users/{user_id}")
async def delete_user(user_id: int, user=Depends(verify_token)):
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Accès interdit")
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_ROOT_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    sql_delete_Query = "DELETE FROM user WHERE id = %s"
    cursor.execute(sql_delete_Query, (user_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {'message': 'User deleted successfully'}


@app.post("/login")
async def login(data: dict):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_ROOT_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    query = "SELECT id, is_admin FROM user WHERE username = %s AND password = %s"
    cursor.execute(query, (data['username'], data['password']))
    result = cursor.fetchone()
    if not result:
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    user_id, is_admin = result

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "username": data["username"],
        "is_admin": bool(is_admin),
        "exp": expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}