import { describe, expect, it } from 'vitest'
import { parseIncomingMessage } from './notifications'

const activeChatId = '10000000'
const textNotification = {
  idMessage: 'message-1',
  instanceData: { typeInstance: 'telegram' },
  messageData: {
    textMessageData: { textMessage: 'Привет' },
    typeMessage: 'textMessage',
  },
  senderData: { chatId: activeChatId },
  timestamp: 1_700_000_000,
  typeWebhook: 'incomingMessageReceived',
}

describe('parseIncomingMessage', () => {
  it('преобразует текстовое сообщение активного Telegram-чата', () => {
    expect(parseIncomingMessage(textNotification, activeChatId)).toEqual({
      direction: 'incoming',
      id: 'message-1',
      text: 'Привет',
      timestamp: 1_700_000_000_000,
    })
  })

  it.each([
    {
      body: {
        ...textNotification,
        senderData: { chatId: 'another-chat' },
      },
      name: 'сообщение другого чата',
    },
    {
      body: {
        ...textNotification,
        messageData: { typeMessage: 'imageMessage' },
      },
      name: 'нетекстовое сообщение',
    },
  ])('игнорирует $name', ({ body }) => {
    expect(parseIncomingMessage(body, activeChatId)).toBeNull()
  })
})
