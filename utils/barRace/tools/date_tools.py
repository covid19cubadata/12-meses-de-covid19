from datetime import date, timedelta


def date_range(date_init, date_end, idays=1):
    dater = []
    date_current = date.fromisoformat(date_init)
    date_end = date.fromisoformat(date_end)
    oneDay = timedelta(days=+idays)
    while date_current <= date_end:
        dater.append(date_current.isoformat())
        date_current += oneDay
    if date_end.isoformat() not in dater:
        dater.append(date_end.isoformat())
    return dater


def date_range_aux(date_init, date_end, idays=1):
    dater = []
    date_current = date.fromisoformat(date_init)
    date_end = date.fromisoformat(date_end)
    oneDay = timedelta(days=+idays)
    while date_current <= date_end:
        d = date_current.isoformat().split('-')
        dater.append(f"{d[1]}/{d[2]}/{d[0]}")
        date_current += oneDay
    return dater