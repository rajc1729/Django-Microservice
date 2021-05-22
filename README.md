To run scheduler

```
celery -A websocketService beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
```

To Worker run

```
celery -A  websocketService worker --loglevel=info
```
