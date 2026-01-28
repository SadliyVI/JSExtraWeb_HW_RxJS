import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, catchError, retry, share } from 'rxjs/operators';
import './styles.css';
import { renderMessages } from './components/messageTable';
import { exhaustMap } from 'rxjs/operators';

const API_URL = 'http://localhost:3000/messages/unread';
const displayedMessages = new Set();

const fetchMessages$ = interval(3000).pipe(
    exhaustMap(() =>
        ajax.getJSON(API_URL).pipe(
            retry({ count: Infinity, delay: 3000 }),
            catchError((error) => {
                console.error('Error fetching messages:', error);
                return [];
            })
        )
    ),
    share()
);

fetchMessages$.subscribe((response) => {
    if (response && response.status === 'ok') {
        const messages = response.messages || [];

        // console.log('Полученные сообщения с сервера:', messages);

        const newMessages = messages.filter((message) => {
            if (!displayedMessages.has(message.id)) {
                displayedMessages.add(message.id);
                return true;
            }
            return false;
        });

        // console.log('Новые сообщения для отображения:', newMessages);

        renderMessages(newMessages);
    } else {
        console.error('Invalid response format:', response);
    }
});