## Описание

Тестовое задание выполнено на NestJS.
Проверка работоспособности по адресу http://79.170.163.247:3000
В корне проекта формированные запросы для проверки по следующим адресам для Postman:

```bash
# POST | Create all
http://79.170.163.247:3000/createall

# POST | Create all with validation
http://79.170.163.247:3000/createall?validation=true

# POST | Create One
http://79.170.163.247:3000/create

# POST | Create One with validation
http://79.170.163.247:3000/create?validation=true

# GET | Get all
http://79.170.163.247:3000

# GET | Create all with validation
http://79.170.163.247:3000?validation=true

# GET | Get One
http://79.170.163.247:3000/332

# GET | Get One with validation
http://79.170.163.247:3000/333?validation=true

# PATCH | Update One
http://79.170.163.247:3000/333

# PATCH | Update One with validation
http://79.170.163.247:3000/332?validation=true

# DELETE | Delete One
http://79.170.163.247:3000/332

# GET | Progenies by id
http://79.170.163.247:3000/progenies/289

# GET | Brothers and sisters by id
http://79.170.163.247:3000/brothers-and-sisters/101

# GET | All incestuous marriage
http://79.170.163.247:3000/incestuous
```

Так же в коре проекта в папке data сформирован json с проверочными данными.
Аналогичные запросы сформированы для локальной машины.
