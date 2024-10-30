from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey, Text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False  # Додаємо, щоб кешування не очищалось після commit
)
Base = declarative_base()


class SiteUser(Base):
    __tablename__ = "site_user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    picture = Column(String, nullable=True)


class Joke(Base):
    __tablename__ = "jokes_uk"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    tags = Column(Text, nullable=False)


class SentJoke(Base):
    __tablename__ = "sent_jokes"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    joke_id = Column(Integer, nullable=False)


class Vote(Base):
    __tablename__ = "votes"

    id = Column(BigInteger, primary_key=True, index=True)
    joke_id = Column(BigInteger, ForeignKey("jokes_uk.id"), nullable=True)
    user_id = Column(BigInteger, nullable=True)
    vote_type = Column(Text, nullable=True)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
