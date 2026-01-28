import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { exhaustMap, retry, catchError, share } from 'rxjs/operators';
import './styles.css';
import { renderMessages } from './components/messageTable';

const API_URL = '/api/messages/unread';

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
        const newMessages = (response.messages || []).filter((msg) => {
            if (!displayedMessages.has(msg.id)) {
                displayedMessages.add(msg.id);
                return true;
            }
            return false;
        });

        renderMessages(newMessages);
    }
});
