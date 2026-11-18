from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Master
from schemas import MasterResponse

router = APIRouter(prefix="/masters", tags=["Masters"])


@router.get("", response_model=list[MasterResponse])
def get_masters(
    specialization: str | None = None,
    db: Session = Depends(get_db),
):
    """Возвращает список мастеров, опционально по специализации."""
    stmt = select(Master)
    if specialization is not None:
        stmt = stmt.where(Master.specialization == specialization)
    return db.scalars(stmt).all()


@router.get("/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    """Возвращает мастера по ID или 404."""
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master