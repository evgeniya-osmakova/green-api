# GREEN-API Telegram Chat

Одночатовый веб-клиент для отправки и получения текстовых сообщений Telegram через GREEN-API. Проект написан на React, TypeScript и Vite.

Демо: https://green-api-six-ebon.vercel.app/

## Возможности

- подключение по `idInstance` и `apiTokenInstance`;
- поиск Telegram-аккаунта по номеру телефона;
- отправка текстовых сообщений;
- получение сообщений через последовательный HTTP polling;
- фильтрация событий и сообщений других чатов;
- дедупликация входящих сообщений;
- адаптивный интерфейс.

## Установка и запуск

Требуется Node.js `20.19+` или `22.12+`.

```bash
npm install
npm run dev
```

Vite выведет локальный адрес приложения в терминале.

Проверки проекта:

```bash
npm test
npm run lint
npm run build
```

Переменные окружения для запуска не требуются. Локальный `.env` игнорируется Git и может использоваться только как личная памятка для credentials — приложение его не читает и форму не заполняет.

## Настройка GREEN-API Telegram

1. Зарегистрируйтесь в [личном кабинете GREEN-API](https://console.green-api.com/).
2. Создайте Telegram-инстанс и авторизуйте его через QR-код.
3. В карточке инстанса найдите:
   - `apiUrl` — адрес API;
   - `idInstance` — идентификатор инстанса;
   - `apiTokenInstance` — секретный ключ доступа.
4. В настройках инстанса выберите получение уведомлений через HTTP API:
   - оставьте `webhookUrl` пустым;
   - включите `incomingWebhook`;
   - сохраните настройки.

Подробности: [подготовка Telegram-инстанса](https://green-api.com/telegram/docs/before-start/) и [настройка HTTP API notifications](https://green-api.com/telegram/docs/api/receiving/technology-http-api/).

`apiTokenInstance` нельзя публиковать, коммитить или передавать другим людям. Если токен раскрыт, замените его в личном кабинете.

Приложение использует общий адрес `https://api.green-api.com`. Если в карточке вашего инстанса указан другой `apiUrl`, замените константу `API_URL` в `src/api/greenApi.ts`.

## Использование

1. Запустите приложение.
2. Введите `idInstance` и `apiTokenInstance` из карточки инстанса.
3. Укажите номер собеседника в международном формате. Разделители допустимы: приложение оставит только цифры.
4. Создайте чат и отправьте текстовое сообщение.
5. Оставьте приложение открытым для получения входящих сообщений.

Успешный ответ `SendMessage` означает, что GREEN-API принял запрос. Это не подтверждение доставки сообщения адресату.

## Архитектура

- `src/api/` — общий `request<T>` и четыре типизированных метода GREEN-API без application state;
- `src/hooks/useMessenger.ts` — состояние чата, отправка, фильтрация и дедупликация;
- `src/hooks/useNotificationPolling.ts` — lifecycle polling, cleanup, retry/backoff и удаление уведомлений;
- `src/utils/` — преобразование ошибок, type guards и parsing уведомлений;
- `src/types/` — общие типы API и приложения;
- `src/components/` — формы, чат и переиспользуемые UI-компоненты.

Polling работает последовательно:

1. `ReceiveNotification` ожидает уведомление до 5 секунд.
2. Hook фильтрует notification и передаёт подходящее сообщение в `useMessenger`.
3. Подходящие, повторные и проигнорированные notification подтверждаются через `DeleteNotification`.
4. Следующий `ReceiveNotification` начинается только после успешного удаления предыдущего notification.
5. Сетевые и HTTP-ошибки повторяются с backoff от 1 до 8 секунд.
6. При отключении, смене чата или unmount активный запрос и retry delay отменяются через `AbortController`.

Такой lifecycle соответствует документации [ReceiveNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/) и [DeleteNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/DeleteNotification/).

## Ограничения

- Поддерживается один активный чат.
- Поддерживаются только текстовые входящие и исходящие сообщения.
- История сообщений существует только в памяти вкладки и очищается при отключении или перезагрузке.
- Credentials существуют только в runtime state и не сохраняются в браузере.
- Приложение потребляет общую входящую очередь инстанса и удаляет все прочитанные notification, включая события и сообщения других чатов. Не запускайте для этого же инстанса второй HTTP polling consumer.
- Статусы доставки отдельно не отслеживаются.
- `apiUrl` не вводится в интерфейсе; используется заданный в коде общий адрес API.
- Telegram API официально находится в [beta-статусе](https://green-api.com/telegram/docs/api/).
