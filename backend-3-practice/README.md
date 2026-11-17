## Запуск
```py
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

После запуска в браузере swagger открывается по пути: `http://127.0.0.1:8000/docs`.


## Выполненные команды
```py
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic
pip freeze > requirements.txt
```