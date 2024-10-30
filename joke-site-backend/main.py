from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.middleware.sessions import SessionMiddleware


from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel
from sqlalchemy import func, insert, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request

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

favicon_path = 'static/favicon.ico'



app.add_middleware(SessionMiddleware, secret_key=JWT_SECRET)
print(origins)
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
async def get_joke(
        request: Request,
        id: int = None,
        tag: str = None,
        db: AsyncSession = Depends(get_db)
):
    user = request.session.get('user')
    user_email = user.get("email") if user else None

    if user and user_email:
        query = select(SiteUser).filter(SiteUser.email == user_email)
        result = await db.execute(query)
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = user.id

        # Subquery to filter out already sent jokes
        subquery = select(SentJoke.joke_id).filter(SentJoke.user_id == user_id).subquery()
    else:
        user_id = None
        subquery = None

    if id:
        # Fetch joke by ID
        query = select(Joke).filter(Joke.id == id)
    elif tag:
        # Fetch joke by category
        query = (
            select(Joke)
            .outerjoin(Vote, Joke.id == Vote.joke_id)
            .filter(Joke.tags.ilike(f'%{tag}%'))
        )
        if subquery is not None:
            query = query.filter(Joke.id.notin_(subquery))
        query = query.group_by(Joke.id)
        if user_id is not None:
            query = query.order_by(func.count(Vote.id).desc()).limit(1)
        else:
            query = query.order_by(func.random()).limit(1)
    else:
        # Fetch a random joke
        query = (
            select(Joke)
            .outerjoin(Vote, Joke.id == Vote.joke_id)
        )
        if subquery is not None:
            query = query.filter(Joke.id.notin_(subquery))
        query = query.group_by(Joke.id)
        if user_id is not None:
            query = query.order_by(func.count(Vote.id).desc()).limit(1)
        else:
            query = query.order_by(func.random()).limit(1)

    result = await db.execute(query)
    joke = result.scalars().first()

    if not joke:
        raise HTTPException(status_code=404, detail="No jokes available")

    tags_with_hash = joke.tags
    if joke.tags is not None:
        tags_with_hash = f'#{joke.tags}'.replace(', ', ' #')

    joke_result = {"id": joke.id, "text": joke.text, "tags": tags_with_hash}

    if user_id is not None:
        # Check if the record already exists
        sent_joke_query = select(SentJoke).filter(SentJoke.user_id == user_id, SentJoke.joke_id == joke.id)
        sent_joke_result = await db.execute(sent_joke_query)
        sent_joke = sent_joke_result.scalars().first()

        if sent_joke is None:
            sent_joke = SentJoke(user_id=user_id, joke_id=joke.id)
            db.add(sent_joke)
            await db.commit()

    return joke_result


@app.get("/api/joke/votes")
async def return_joke_votes(request: Request, joke_id: int, db: AsyncSession = Depends(get_db)):
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
        select(Joke.id, Joke.text)  # Select Joke.id and Joke.text
        .join(SentJoke, SentJoke.joke_id == Joke.id)
        .filter(SentJoke.user_id == user_id)
        .order_by(SentJoke.id.desc())  # Order by the SentJoke.id in descending order
        .offset(skip)
        .limit(limit)
    )
    sent_jokes_result = await db.execute(sent_jokes_query)
    jokes = sent_jokes_result.all()

    result = [JokeHistoryItem(id=joke.id, text=joke.text) for joke in jokes]

    return result


@app.get("/api/joke/user_vote")
async def get_user_vote(joke_id: int, request: Request, db: AsyncSession = Depends(get_db)):
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

    # Get the user's existing vote
    stmt = select(Vote.vote_type).where(Vote.joke_id == joke_id, Vote.user_id == user_id)
    result = await db.execute(stmt)
    vote = result.scalars().first()

    if vote:
        return {"vote_type": vote}
    else:
        return {"vote_type": None}


@app.get("/api/jokes/search")
async def search_jokes(query: str, db: AsyncSession = Depends(get_db)):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")

    query_statement = select(Joke).filter(Joke.text.ilike(f"%{query}%"))
    result = await db.execute(query_statement)
    jokes = result.scalars().all()

    if not jokes:
        raise HTTPException(status_code=404, detail="No jokes found")

    return [{"id": joke.id, "text": joke.text} for joke in jokes]

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(favicon_path)