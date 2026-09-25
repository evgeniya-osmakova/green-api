# План реализации

## Архитектурные ограничения

- `src/api/` содержит только базовые типизированные HTTP-запросы к GREEN-API.
- `src/api/greenApi.ts` содержит общий `fetch`-wrapper и методы `checkAccount`, `sendMessage`, `receiveNotification`, `deleteNotification`.
- Polling, lifecycle, backoff, фильтрация, дедупликация и application state находятся в hooks.
- Основной orchestration сначала реализуется в `useMessenger`. `useNotificationPolling` добавляется только если `useMessenger` станет слишком большим.
- `notificationParser.ts` заранее не создаётся. Parsing выносится в чистую функцию вне `api/` только при достаточном объёме логики.
- Все типы приложения и API централизованы в `src/types/`.
- API-запросы не выполняются из UI-компонентов.
- Credentials хранятся только в runtime state.
- Компонент и его CSS Module лежат рядом. В CSS Modules используются BEM-классы.
- Приватные дочерние компоненты хранятся внутри родителя.
- Новые тесты без отдельного запроса не добавляются.

## Структура `src/`

```text
src/
├── main.tsx
├── index.css
├── App.tsx
├── App.module.css
├── api/
│   └── greenApi.ts
├── types/
│   ├── api.ts
│   └── messenger.ts
├── hooks/
│   └── useMessenger.ts
└── components/
    ├── CredentialsForm/
    ├── ChatSetupForm/
    └── ChatView/
        └── components/
```

## Этап 1. Создание проекта и фиксация плана

- [x] Создать Vite-проект React + TypeScript.
- [x] Настроить ESLint и базовые scripts.
- [x] Удалить демонстрационный код.
- [x] Добавить `.env` в `.gitignore`.
- [x] Не создавать `.env.example`.
- [x] Сохранить согласованный план в `IMPLEMENTATION_PLAN.md`.
- [x] Проверить dev server, lint и production build.

## Этап 2. Централизованные типы и HTTP API

- [ ] Создать `src/types/api.ts` и `src/types/messenger.ts`.
- [ ] Добавить `Data<T>` и `ApiError`.
- [ ] Реализовать безопасный типизированный `fetch`-wrapper.
- [ ] Реализовать `checkAccount`, `sendMessage`, `receiveNotification`, `deleteNotification`.
- [ ] Обрабатывать ответы как `unknown` через type guards.
- [ ] Не включать токен и полный URL в ошибки.
- [ ] Не добавлять polling-логику в `api/`.
- [ ] Проверить TypeScript, lint и build.

## Этап 3. Credentials и временный env-prefill

- [ ] Реализовать форму `idInstance` и `apiTokenInstance`.
- [ ] Хранить credentials только в runtime state.
- [ ] Добавить временный prefill из `VITE_ID_INSTANCE` и `VITE_API_TOKEN_INSTANCE`.
- [ ] Не подключать пользователя автоматически при наличии `.env`.
- [ ] Не логировать credentials.
- [ ] Реализовать отключение и очистку runtime state.
- [ ] Проверить работу с `.env` и без него.

## Этап 4. Создание чата

- [ ] Нормализовать телефон до международного формата из цифр.
- [ ] Вызвать `CheckAccount` и сохранить полученный `chatId`.
- [ ] Обработать скрытый или несуществующий номер, неавторизованный инстанс, `429`, `469` и сетевые ошибки.
- [ ] Не повторять `CheckAccount` автоматически.
- [ ] Проверить успешный и ошибочные сценарии.

## Этап 5. Интерфейс мессенджера

- [ ] Реализовать sidebar, header, список сообщений и composer.
- [ ] Добавить состояния пустой переписки.
- [ ] Сделать адаптивную раскладку.
- [ ] Использовать CSS Modules и BEM.
- [ ] Хранить приватные компоненты внутри `ChatView/components`.
- [ ] Проверить desktop и узкий экран.

## Этап 6. Отправка сообщений

- [ ] Вызывать `SendMessage` по `chatId`.
- [ ] Запрещать пустой текст и текст длиннее 4096 символов.
- [ ] Блокировать повторный submit на время запроса.
- [ ] После успешного ответа добавлять исходящее сообщение справа.
- [ ] Не считать успешный API-вызов подтверждением доставки.
- [ ] При ошибке сохранять текст в composer.
- [ ] Не создавать отдельную систему delivery statuses.
- [ ] Проверить отправку и ошибку отправки.

## Этап 7. Polling в `useMessenger`

- [ ] Запускать один polling-цикл после создания чата.
- [ ] Последовательно вызывать `receiveNotification` с `receiveTimeout=5`.
- [ ] Обрабатывать `null`.
- [ ] Применять ограниченный exponential backoff при ошибках.
- [ ] Не использовать `setInterval`.
- [ ] Управлять запросами через `AbortController`.
- [ ] Останавливать цикл при отключении, смене credentials, смене чата и unmount.
- [ ] Защитить state от обновлений устаревшим циклом минимальным решением вместе с abort/cleanup.
- [ ] Добавлять отдельный generation id только при доказанной необходимости.
- [ ] Проверить отсутствие параллельных polling-запросов.

## Этап 8. Фильтрация, дедупликация и удаление

- [ ] Принимать только Telegram `incomingMessageReceived` с `textMessage` активного `chatId`.
- [ ] Преобразовывать подходящее уведомление в `Message`.
- [ ] Проверять дубли по `chatId + idMessage`.
- [ ] Удалять подходящие, повторные и проигнорированные уведомления.
- [ ] Вызывать следующий `ReceiveNotification` только после обработки и `DeleteNotification`.
- [ ] Не обновлять state после cleanup старого цикла.
- [ ] При необходимости вынести polling в `useNotificationPolling`.
- [ ] При необходимости вынести parsing в чистую функцию вне `api/`.
- [ ] Проверить входящие сообщения, дубли и посторонние события.

## Этап 9. Финальная проверка и удаление env-prefill

- [ ] Проверить сценарий credentials → чат → отправка → ответ.
- [ ] Проверить дубли при ошибке `DeleteNotification`.
- [ ] Проверить сообщения других чатов и нетекстовые события.
- [ ] Проверить остановку polling и восстановление после сетевой ошибки.
- [ ] Удалить чтение `VITE_ID_INSTANCE` и `VITE_API_TOKEN_INSTANCE`.
- [ ] Проверить работу без `.env`.
- [ ] Проверить отсутствие credentials в Git и логах.
- [ ] Проверить отсутствие `any`.
- [ ] Запустить lint и production build.

## Этап 10. README

- [ ] Описать установку и запуск.
- [ ] Описать настройку GREEN-API Telegram.
- [ ] Указать требования: пустой `webhookUrl` и включённый `incomingWebhook`.
- [ ] Описать получение `apiUrl`, `idInstance` и `apiTokenInstance`.
- [ ] Описать использование приложения.
- [ ] Кратко описать архитектуру и lifecycle polling.
- [ ] Описать ограничения одноканальной очереди, runtime credentials и историю.
- [ ] Указать beta-статус Telegram API.
- [ ] Сверить README с фактической реализацией.
