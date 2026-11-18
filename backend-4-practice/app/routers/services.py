from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Service
from schemas import ServiceCreate, ServiceResponse

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[ServiceResponse])
def get_services(
    db: Session = Depends(get_db),
):
    """Получить все услугу из БД."""
    stmt = select(Service)
    results = db.scalars(stmt).all()
    return results


@router.post("", response_model=ServiceResponse)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
):
    """Создаёт новую услугу в БД."""
    new_service = Service(
        category_id=service_in.category_id,
        title=service_in.title,
        desc=service_in.desc,
        duration=service_in.duration,
        price=service_in.price,
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return JSONResponse(
        status_code=201,
        content=ServiceResponse.model_validate(new_service).model_dump(
            by_alias=True
        ),
    )