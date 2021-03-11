import json

import requests


def gen_imported():
    cubadata = requests.get(
        'https://covid19cubadata.github.io/data/covid19-cuba.json').content
    # cubadata = requests.get(
    #     'http://localhost:8000/utils/covid19-cuba.json').content
    cubadata = json.loads(cubadata)

    dates = []
    importados = []
    active = []
    total = 0
    evac = 0
    recover = 0
    death = 0

    shouldSkip = True
    for i in cubadata['casos']['dias'].values():
        total += len(i.get('diagnosticados', []))
        recover += i.get('recuperados_numero', 0)
        death += i.get('muertes_numero', 0)
        evac += i.get('evacuados_numero', 0)

        if shouldSkip:
            if i['fecha'] != '2020/11/15':
                continue
            else:
                shouldSkip = False

        day_import = 0
        for diag in i.get('diagnosticados', []):
            if diag['contagio'] == 'importado':
                day_import += 1

        dates.append('/'.join(i['fecha'].split('/')[1:]))
        importados.append(day_import)
        active.append(total - (evac+recover+death))

    dates.insert(0, 'Fecha')
    importados.insert(0, 'Casos importados en el día')
    active.insert(0, 'Casos activos')

    js = 'dailyImported = '
    js += json.dumps(importados, ensure_ascii=False)
    js += ';\ndailyActive = '
    js += json.dumps(active, ensure_ascii=False)
    js += ';\ndatesImported = '
    js += json.dumps(dates)
    js += ';\n'

    with open('utils/importados.base.js', encoding='utf-8') as f:
        basejs = f.read()
    with open('js/importados.js', 'w', encoding='utf-8') as f:
        f.write(js+basejs)


if __name__ == '__main__':
    gen_imported()
