import { interval, Subject, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { exhaustMap, retry, catchError, share, takeUntil, startWith } from 'rxjs/operators';
import './styles.css';
import { renderMessages } from './components/messageTable';

const API_URL = '/api/messages/unread';

const displayedMessages = new Set();

// Subject для остановки стрима/отписки
const destroy$ = new Subject();

const fetchMessages$ = interval(3000).pipe(
    startWith(0), // сразу сделать первый запрос
    exhaustMap(() =>
        ajax.getJSON(API_URL).pipe(
            retry({ count: Infinity, delay: 3000 }),
            catchError((error) => {
                console.error('Error fetching messages:', error);

                // возвращает объект в ожидаемом формате, чтобы downstream не ломался
                return of({
                    status: 'error',
                    timestamp: Math.floor(Date.now() / 1000),
                    messages: [],
                    error: true,
                });
            })
        )
    ),
    share(),
    takeUntil(destroy$)
);

const subscription = fetchMessages$.subscribe((response) => {
    if (!response) return;

    if (response.status === 'ok') {
        const newMessages = (response.messages || []).filter((msg) => {
            if (!displayedMessages.has(msg.id)) {
                displayedMessages.add(msg.id);
                return true;
            }
            return false;
        });

        renderMessages(newMessages);
    } else {
        console.warn('API returned error response');
    }
});

// очистка при закрытии/перезагрузке страницы
window.addEventListener('beforeunload', () => {
    destroy$.next();
    destroy$.complete();
    subscription.unsubscribe();
});