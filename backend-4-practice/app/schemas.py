from pydantic import BaseModel, Field


class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    model_config = {"from_attributes": True}


class CategoryResponse(BaseModel):
    id: int
    name: str
    services_count: int = Field(..., alias="servicesCount")

    model_config = {"populate_by_name": True, "from_attributes": True}


class ServiceCreate(BaseModel):
    category_id: int = Field(..., alias="categoryId")
    title: str = Field(..., min_length=1, max_length=100)
    desc: str = Field(..., min_length=1, max_length=100)
    duration: int = Field(..., ge=30, le=180)
    price: float = Field(..., gt=0)

    model_config = {"populate_by_name": True}


class ServiceResponse(BaseModel):
    id: int
    category_id: int = Field(..., alias="categoryId")
    title: str
    desc: str
    duration: int
    price: float

    model_config = {"from_attributes": True, "populate_by_name": True}