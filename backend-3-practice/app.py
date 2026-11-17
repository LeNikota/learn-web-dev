from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, select
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    sessionmaker,
)


DATABASE_URL = "sqlite:///./salon.sqlite3"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    specialization: Mapped[str] = mapped_column(nullable=False)


class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    model_config = {"from_attributes": True}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_masters() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Master).limit(1)) is not None:
            return
        db.add_all([
            Master(name="Анна", specialization="Парикмахер"),
            Master(name="Мария", specialization="Визажист"),
        ])
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_masters()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/masters", response_model=list[MasterResponse])
def get_masters(
    specialization: str | None = None,
    db: Session = Depends(get_db),
):
    """Возвращает список мастеров, опционально по специализации."""
    stmt = select(Master)
    if specialization is not None:
        stmt = stmt.where(Master.specialization == specialization)
    return db.scalars(stmt).all()


@app.get("/masters/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    """Возвращает мастера по ID или 404."""
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master