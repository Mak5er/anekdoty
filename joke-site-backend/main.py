from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request

from config import JWT_SECRET, GOOGLE_CLIENT_ID, origins
from database import SessionLocal, init_db, SiteUser, Joke, SentJoke, Vote

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=JWT_SECRET)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_db():
    async with SessionLocal() as session:
        yield session


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.get("/api/auth")
async def authentication(request: Request, token: str, db: AsyncSession = Depends(get_db)):
    try:
        user_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        request.session['user'] = {
            "email": user_info["email"],
            "name": user_info["name"],
            "picture": user_info["picture"],
        }

        query = select(SiteUser).filter(SiteUser.email == user_info["email"])
        result = await db.execute(query)
        user = result.scalars().first()

        if not user:
            user = SiteUser(email=user_info["email"], name=user_info.get("name"), picture=user_info.get("picture"))
            db.add(user)
            await db.commit()
            await db.refresh(user)

        return {"email": user.email, "name": user.name}

    except ValueError:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/api/user")
async def get_user(request: Request):
    user = request.session.get('user')
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@app.get("/api/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out"}


@app.get("/api/joke")
async def get_joke(request: Request, db: AsyncSession = Depends(get_db)):
    user = request.session.get('user')

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_email = user.get("email")

    if not user_email:
        raise HTTPException(status_code=400, detail="Email not found in session")

    query = select(SiteUser).filter(SiteUser.email == user_email)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user.id

    # Subquery to filter out already sent jokes
    subquery = select(SentJoke.joke_id).filter(SentJoke.user_id == user_id).subquery()

    # Main query to get a joke that hasn't been sent to the user
    query = (
        select(Joke)
        .outerjoin(Vote, Joke.id == Vote.joke_id)
        .filter(Joke.id.notin_(subquery))
        .group_by(Joke.id)
        .order_by(func.count(Vote.id).desc())
        .limit(1)
    )

    result = await db.execute(query)
    joke = result.scalars().first()

    if not joke:
        raise HTTPException(status_code=404, detail="No jokes available")

    tags_with_hash = joke.tags

    if joke.tags is not None:
        tags_with_hash = f'#{joke.tags}'
        tags_with_hash = tags_with_hash.replace(', ', ' #')

    result = {"id": joke.id, "text": joke.text, "tags": tags_with_hash}

    sent_joke = SentJoke(user_id=user_id, joke_id=joke.id)
    db.add(sent_joke)

    await db.commit()
    return result


@app.get("/api/joke/category")
async def get_category_joke(request: Request, tag: str, db: AsyncSession = Depends(get_db)):
    user = request.session.get('user')

    print(tag)

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_email = user.get("email")

    if not user_email:
        raise HTTPException(status_code=400, detail="Email not found in session")

    query = select(SiteUser).filter(SiteUser.email == user_email)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user.id

    # Subquery to filter out already sent jokes
    subquery = select(SentJoke.joke_id).filter(SentJoke.user_id == user_id).subquery()

    # Main query to get a joke that hasn't been sent to the user in the specified category
    query = (
        select(Joke)
        .outerjoin(Vote, Joke.id == Vote.joke_id)
        .filter(Joke.id.notin_(subquery), Joke.tags.ilike(f'%{tag}%'))
        .group_by(Joke.id)
        .order_by(func.count(Vote.id).desc())
        .limit(1)
    )

    result = await db.execute(query)
    joke = result.scalars().first()

    if not joke:
        raise HTTPException(status_code=404, detail="No jokes available")

    tags_with_hash = joke.tags

    if joke.tags is not None:
        tags_with_hash = f'#{joke.tags}'
        tags_with_hash.replace(', ', ' #')

    result = {"id": joke.id, "text": joke.text, "tags": tags_with_hash}

    sent_joke = SentJoke(user_id=user_id, joke_id=joke.id)
    db.add(sent_joke)

    await db.commit()

    return result
