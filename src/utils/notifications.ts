import type { Message } from '../types/messenger'
import { isRecord } from './typeGuards'

export function parseIncomingMessage(
  body: unknown,
  activeChatId: string,
): Message | null {
  if (
    !isRecord(body) ||
    body.typeWebhook !== 'incomingMessageReceived' ||
    typeof body.idMessage !== 'string' ||
    typeof body.timestamp !== 'number' ||
    !Number.isFinite(body.timestamp) ||
    !isRecord(body.instanceData) ||
    body.instanceData.typeInstance !== 'telegram' ||
    !isRecord(body.senderData) ||
    body.senderData.chatId !== activeChatId ||
    !isRecord(body.messageData) ||
    body.messageData.typeMessage !== 'textMessage' ||
    !isRecord(body.messageData.textMessageData) ||
    typeof body.messageData.textMessageData.textMessage !== 'string'
  ) {
    return null
  }

  return {
    direction: 'incoming',
    id: body.idMessage,
    text: body.messageData.textMessageData.textMessage,
    timestamp: body.timestamp * 1_000,
  }
}
