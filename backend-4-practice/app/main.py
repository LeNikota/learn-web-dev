from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import select

from database import Base, SessionLocal, engine
from models import Master
from models import Category
from routers import categories, masters, services


def seed_masters() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Master).limit(1)) is not None:
            return
        db.add_all([
            Master(name="Анна", specialization="Парикмахер"),
            Master(name="Мария", specialization="Визажист"),
        ])
        db.commit()


def seed_categories() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Category).limit(1)) is not None:
            return
        categories_data = [
            Category(id=1, name="Стрижки и укладки"),
            Category(id=2, name="Маникюр и педикюр"),
            Category(id=3, name="Брови и ресницы"),
            Category(id=4, name="Спа-процедуры"),
        ]
        db.add_all(categories_data)
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_masters()
    seed_categories()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(categories.router)
app.include_router(masters.router)
app.include_router(services.router)