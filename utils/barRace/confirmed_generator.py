import json
from datetime import date

import pandas as pd

from tools.constants import PROVINCES
from tools.date_tools import date_range, date_range_aux


def build_confirmed_data_for_bar_race():

    confirmed_full_result = {}
    confirmed_full_result['state'] = []
    confirmed_full_result['region'] = []

    confirmed_result = {}
    confirmed_result['date'] = []
    confirmed_result['province'] = []
    confirmed_result['confirmed'] = []
    confirmed_result['accumulated_confirmed'] = []

    accumulated_confirmed = {}
    for p in PROVINCES:
        accumulated_confirmed[p] = 0

    with open('data/covid19-cuba.json', 'r') as f:
        distros_dict = json.load(f)

    for caso in distros_dict['casos']['dias']:
        c = distros_dict['casos']['dias'][caso]
        if 'diagnosticados' in c:
            for p in PROVINCES:
                confirmed = 0
                for d in c['diagnosticados']:
                    if d['provincia_detección'] == p:
                        confirmed += 1
                accumulated_confirmed[p] += confirmed
                s = c['fecha'].split('/')
                confirmed_result['date'].append("-".join(s))
                confirmed_result['province'].append(p)
                confirmed_result['confirmed'].append(confirmed)
                confirmed_result['accumulated_confirmed'].append(
                    accumulated_confirmed[p])

    def datos(dat, pro):
        for i in range(len(confirmed_result['date'])):
            date_aux = date.fromisoformat(confirmed_result['date'][i])
            if date_aux > date.fromisoformat(dat):
                break
            if confirmed_result['province'][i] == pro:
                if confirmed_result['date'][i] == dat:
                    return [
                        dat, pro, confirmed_result['confirmed'][i],
                        confirmed_result['accumulated_confirmed'][i]]
        return None

    date_end = date.fromisoformat(confirmed_result['date'][-1])
    date_end = date.isoformat(date_end)

    range_date = date_range('2020-03-11', date_end)
    range_date_aux = date_range_aux('2020-03-11', date_end)
    confirmed_full_result['state'] = PROVINCES
    confirmed_full_result['region'] = PROVINCES
    for item, dat in enumerate(range_date):
        confirmed_full_result[f"{range_date_aux[item]}_date"] = []
        for ip, pro in enumerate(PROVINCES):
            d = datos(dat, pro)
            if d:
                confirmed_full_result[
                    f"{range_date_aux[item]}_date"].append(d[3])
            else:
                if item == 0:
                    confirmed_full_result[
                        f"{range_date_aux[item]}_date"].append(0)
                else:
                    confirmed_full_result[
                        f"{range_date_aux[item]}_date"].append(
                            confirmed_full_result[
                                f"{range_date_aux[item-1]}_date"][ip])

    df = pd.DataFrame(
        confirmed_full_result,
        columns= ['state', 'region'] + [
            dat+'_date' for dat in range_date_aux])

    df.to_csv(f"data/province_confirmed.csv", index = False, header=True)


if __name__ == "__main__":
    build_confirmed_data_for_bar_race()
