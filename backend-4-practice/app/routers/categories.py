from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from models import Category, Service
from schemas import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Возвращает список всех категорий с подсчетом услуг."""
    stmt = (
        select(
            Category.id,
            Category.name,
            func.count(Service.id).label("services_count"),
        )
        .outerjoin(Service, Category.id == Service.category_id)
        .group_by(Category.id)
    )
    results = db.execute(stmt).all()
    
    return [
        CategoryResponse(
            id=row.id, 
            name=row.name, 
            servicesCount=row.services_count
        )
        for row in results
    ]


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Возвращает информацию о категории по её ID."""
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    count = db.scalar(
        select(func.count(Service.id)).where(Service.category_id == category_id)
    )
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        servicesCount=count
    )