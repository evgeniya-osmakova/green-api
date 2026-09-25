# План реализации

## Архитектурные ограничения

- `src/api/` содержит только базовые типизированные HTTP-запросы к GREEN-API.
- `src/api/request.ts` содержит только общую HTTP-механику и возвращает структурированную техническую ошибку без текста для UI.
- `src/api/greenApi.ts` содержит только методы `checkAccount`, `sendMessage`, `receiveNotification`, `deleteNotification` и минимальный URL helper.
- Пользовательские тексты и преобразование ошибок GREEN-API находятся в `src/utils/errors.ts`.
- Polling, lifecycle, backoff, фильтрация, дедупликация и application state находятся в hooks.
- Основной orchestration сначала реализуется в `useMessenger`. `useNotificationPolling` добавляется только если `useMessenger` станет слишком большим.
- `notificationParser.ts` заранее не создаётся. Parsing выносится в чистую функцию вне `api/` только при достаточном объёме логики.
- Доменные типы приложения и API централизованы в `src/types/`.
- Типы props хранятся рядом с компонентом в `Component.props.ts`.
- API-запросы не выполняются из UI-компонентов.
- Credentials хранятся только в runtime state.
- Компонент и его CSS Module лежат рядом. В CSS Modules используются BEM-классы.
- Цвета хранятся в CSS-переменных.
- Повторяющиеся UI-элементы выносятся в переиспользуемые компоненты.
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
│   ├── greenApi.ts
│   └── request.ts
├── types/
│   ├── api.ts
│   └── messenger.ts
├── hooks/
│   ├── useMessenger.ts
│   └── useNotificationPolling.ts
├── utils/
│   ├── errors.ts
│   ├── notifications.ts
│   └── typeGuards.ts
└── components/
    ├── ChatSetupForm/
    ├── ChatView/
    │   └── components/
    ├── CredentialsForm/
    └── ui/
        ├── Button/
        └── TextField/
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

- [x] Создать `src/types/api.ts` и `src/types/messenger.ts`.
- [x] Добавить `Data<T>` и `ApiError`.
- [x] Оставить в `ApiError` только технические данные: тип ошибки и HTTP status, когда он есть.
- [x] Реализовать безопасный типизированный `request<T>` в `src/api/request.ts`.
- [x] Реализовать `checkAccount`, `sendMessage`, `receiveNotification`, `deleteNotification`.
- [x] Использовать generic-типы для обычных ответов и оставить notification body как `unknown`.
- [x] Не включать токен и полный URL в ошибки.
- [x] Не формировать в API layer сообщения для UI.
- [x] Не добавлять polling-логику в `api/`.
- [x] Проверить TypeScript, lint и build.

## Этап 3. Credentials и временный env-prefill

- [x] Реализовать форму `idInstance` и `apiTokenInstance`.
- [x] Хранить credentials только в runtime state.
- [x] Добавить временный prefill из `VITE_ID_INSTANCE` и `VITE_API_TOKEN_INSTANCE`.
- [x] Не подключать пользователя автоматически при наличии `.env`.
- [x] Не логировать credentials.
- [x] Реализовать отключение и очистку runtime state.
- [x] Вынести повторяющиеся кнопки и поля в общие UI-компоненты.
- [x] Вынести палитру в CSS-переменные.
- [x] Проверить работу с `.env` и без него.

## Этап 4. Создание чата

- [x] Нормализовать телефон до международного формата из цифр.
- [x] Вызвать `CheckAccount` и сохранить полученный `chatId`.
- [x] Обработать скрытый или несуществующий номер, неавторизованный инстанс, `429`, `469` и сетевые ошибки.
- [x] Добавить в `useMessenger` одну функцию преобразования `ApiError` в понятное сообщение с учетом операции.
- [x] Различать неверные credentials, ошибку создания/поиска чата, `429`, сетевую и неизвестную ошибку.
- [x] Для неизвестной ошибки использовать нейтральное сообщение с предложением повторить запрос.
- [x] Не показывать пользователю HTTP status/code.
- [x] Не повторять `CheckAccount` автоматически.
- [x] Проверить успешный и ошибочные сценарии.

## Этап 5. Интерфейс мессенджера

- [x] Реализовать sidebar, header, список сообщений и composer.
- [x] Добавить состояния пустой переписки.
- [x] Сделать адаптивную раскладку.
- [x] Использовать CSS Modules и BEM.
- [x] Хранить приватные компоненты внутри `ChatView/components`.
- [x] Проверить desktop и узкий экран.

## Этап 6. Отправка сообщений

- [x] Вызывать `SendMessage` по `chatId`.
- [x] Запрещать пустой текст и текст длиннее 4096 символов.
- [x] Блокировать повторный submit на время запроса.
- [x] После успешного ответа добавлять исходящее сообщение справа.
- [x] Не считать успешный API-вызов подтверждением доставки.
- [x] При ошибке сохранять текст в composer.
- [x] Не создавать отдельную систему delivery statuses.
- [x] Проверить отправку и ошибку отправки.

## Этап 7. Polling в `useNotificationPolling`

- [x] Запускать один polling-цикл после создания чата.
- [x] Последовательно вызывать `receiveNotification` с `receiveTimeout=5`.
- [x] Обрабатывать `null`.
- [x] Применять ограниченный exponential backoff при ошибках.
- [x] Не использовать `setInterval`.
- [x] Управлять запросами через `AbortController`.
- [x] Останавливать цикл при отключении, смене credentials, смене чата и unmount.
- [x] Не показывать штатный abort при cleanup как пользовательскую ошибку.
- [x] Защитить state от обновлений устаревшим циклом минимальным решением вместе с abort/cleanup.
- [x] Добавлять отдельный generation id только при доказанной необходимости.
- [x] Проверить отсутствие параллельных polling-запросов.

## Этап 8. Фильтрация, дедупликация и удаление

- [x] Принимать только Telegram `incomingMessageReceived` с `textMessage` активного `chatId`.
- [x] Преобразовывать подходящее уведомление в `Message`.
- [x] Проверять дубли по `chatId + idMessage`.
- [x] Удалять подходящие, повторные и проигнорированные уведомления.
- [x] Вызывать следующий `ReceiveNotification` только после обработки и `DeleteNotification`.
- [x] Не обновлять state после cleanup старого цикла.
- [x] При необходимости вынести polling в `useNotificationPolling`.
- [x] При необходимости вынести parsing в чистую функцию вне `api/`.
- [x] Проверить входящие сообщения, дубли и посторонние события.

## Этап 9. Финальная проверка и удаление env-prefill

- [x] Проверить сценарий credentials → чат → отправка → ответ.
- [x] Проверить дубли при ошибке `DeleteNotification`.
- [x] Проверить сообщения других чатов и нетекстовые события.
- [x] Проверить остановку polling и восстановление после сетевой ошибки.
- [x] Удалить чтение `VITE_ID_INSTANCE` и `VITE_API_TOKEN_INSTANCE`.
- [x] Проверить работу без `.env`.
- [x] Проверить отсутствие credentials в Git и логах.
- [x] Проверить отсутствие `any`.
- [x] Добавить и запустить минимальный набор автоматических тестов.
- [x] Запустить lint и production build.

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
