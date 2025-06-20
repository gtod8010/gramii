import { EventEmitter } from 'events';

// 서버 메모리에서 동작하는 일회성 이벤트 통신용 Emitter
export const serverEmitter = new EventEmitter(); 
