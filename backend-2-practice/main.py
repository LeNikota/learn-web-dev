from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class CategoryResponse(BaseModel):
    id: int
    name: str
    services_count: int

    class Config:
        alias_generator = lambda field_name: (
            "servicesCount" if field_name == "services_count" else field_name
        )
        populate_by_name = True


CATEGORIES = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


@app.get("/categories", response_model=list[CategoryResponse])
def get_categories():
    """Возвращает список всех категорий услуг."""
    return CATEGORIES


@app.get(
        "/categories/{category_id}",
        response_model=CategoryResponse,
)
def get_category(category_id: int):
    """Возвращает информацию о категории по её ID."""
    for category in CATEGORIES:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")