from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel
from sqlalchemy import func, insert, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from sqlalchemy.orm import joinedload
from sqlalchemy.sql.expression import distinct

from config import JWT_SECRET, GOOGLE_CLIENT_ID, origins
from database import SessionLocal, init_db, SiteUser, Joke, SentJoke, Vote


async def get_db():
    async with SessionLocal() as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(SessionMiddleware, secret_key=JWT_SECRET)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/api/joke/votes")
async def return_joke_votes(request: Request, joke_id: int, db: AsyncSession = Depends(get_db)):
    user = request.session.get('user')

    print(joke_id)

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

    likes_query = select(func.count(Vote.id)).where(Vote.joke_id == joke_id, Vote.vote_type == "like")
    likes_result = await db.execute(likes_query)
    likes_count = likes_result.scalar()

    # Підрахунок дизлайків
    dislikes_query = select(func.count(Vote.id)).where(Vote.joke_id == joke_id, Vote.vote_type == "dislike")
    dislikes_result = await db.execute(dislikes_query)
    dislikes_count = dislikes_result.scalar()

    result = {"likes": likes_count, "dislikes": dislikes_count}

    return result


class VoteRequest(BaseModel):
    joke_id: int
    vote_type: str


@app.post("/api/joke/votes")
async def vote_joke(vote_request: VoteRequest, request: Request, db: AsyncSession = Depends(get_db)):
    user = request.session.get('user')
    print(vote_request.joke_id)
    print(vote_request.vote_type)

    joke_id = vote_request.joke_id
    vote_type = vote_request.vote_type

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

    # Get the user's existing vote
    stmt = select(Vote.vote_type).where(Vote.joke_id == joke_id, Vote.user_id == user_id)
    result = await db.execute(stmt)
    existing_vote = result.scalars().first()

    if existing_vote == vote_type:
        # Remove the vote
        stmt = delete(Vote).where(Vote.joke_id == joke_id, Vote.user_id == user_id)
        await db.execute(stmt)
        await db.commit()
        return {"detail": f"Removed {vote_type} from joke", "action": "removed"}
    elif existing_vote:
        # Update the vote
        stmt = update(Vote).where(Vote.joke_id == joke_id, Vote.user_id == user_id).values(vote_type=vote_type)
        await db.execute(stmt)
        await db.commit()
        return {"detail": f"Updated vote to {vote_type}", "action": "updated"}
    else:
        # Add a new vote
        stmt = insert(Vote).values(joke_id=joke_id, user_id=user_id, vote_type=vote_type)
        await db.execute(stmt)
        await db.commit()
        return {"detail": f"Added {vote_type} to joke", "action": "added"}


class JokeHistoryItem(BaseModel):
    id: int
    text: str

@app.get("/api/joke/history")
async def get_joke_history(
    request: Request,
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, alias="offset"),
    limit: int = Query(10),
):
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

    sent_jokes_query = (
        select(distinct(Joke.id), Joke.text)  # Ensure unique jokes by their ID
        .join(SentJoke, SentJoke.joke_id == Joke.id)
        .filter(SentJoke.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    sent_jokes_result = await db.execute(sent_jokes_query)
    jokes = sent_jokes_result.all()

    result = [JokeHistoryItem(id=joke[0], text=joke[1]) for joke in jokes]

    return result

