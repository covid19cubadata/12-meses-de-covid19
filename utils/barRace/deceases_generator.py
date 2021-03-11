import json
from datetime import date

import pandas as pd

from tools.constants import PROVINCES
from tools.date_tools import date_range, date_range_aux


def build_deceases_data_for_bar_race():

    deceases_full_result = {}
    deceases_full_result['state'] = []
    deceases_full_result['region'] = []

    deceases_result = {}
    deceases_result['date'] = []
    deceases_result['province'] = []
    deceases_result['deceases'] = []
    deceases_result['accumulated_deceases'] = []

    accumulated_deceases = {}
    for p in PROVINCES:
        accumulated_deceases[p] = 0

    with open('data/covid19-fallecidos.json', 'r') as f:
        distros_dict = json.load(f)

    for caso in distros_dict['casos']['dias']:
        c = distros_dict['casos']['dias'][caso]
        if 'fallecidos' in c:
            for p in PROVINCES:
                deceases = 0
                for d in c['fallecidos']:
                    if d['provincia_detección'] == p:
                        deceases += 1
                accumulated_deceases[p] += deceases
                s = c['fecha'].split('/')
                deceases_result['date'].append("-".join(s))
                deceases_result['province'].append(p)
                deceases_result['deceases'].append(deceases)
                deceases_result['accumulated_deceases'].append(
                    accumulated_deceases[p])

    def datos(dat, pro):
        for i in range(len(deceases_result['date'])):
            date_aux = date.fromisoformat(deceases_result['date'][i])
            if date_aux > date.fromisoformat(dat):
                break
            if deceases_result['province'][i] == pro:
                if deceases_result['date'][i] == dat:
                    return [
                        dat, pro, deceases_result['deceases'][i],
                        deceases_result['accumulated_deceases'][i]]
        return None

    date_end = date.fromisoformat(deceases_result['date'][-1])
    date_end = date.isoformat(date_end)

    range_date = date_range('2020-03-11', date_end)
    range_date_aux = date_range_aux('2020-03-11', date_end)
    deceases_full_result['state'] = PROVINCES
    deceases_full_result['region'] = PROVINCES
    for item, dat in enumerate(range_date):
        deceases_full_result[f"{range_date_aux[item]}_date"] = []
        for ip, pro in enumerate(PROVINCES):
            d = datos(dat, pro)
            if d:
                deceases_full_result[
                    f"{range_date_aux[item]}_date"].append(d[3])
            else:
                if item == 0:
                    deceases_full_result[
                        f"{range_date_aux[item]}_date"].append(0)
                else:
                    deceases_full_result[
                        f"{range_date_aux[item]}_date"].append(
                            deceases_full_result[
                                f"{range_date_aux[item-1]}_date"][ip])

    df = pd.DataFrame(
        deceases_full_result,
        columns= ['state', 'region'] + [
            dat+'_date' for dat in range_date_aux])

    df.to_csv(f"data/province_deceases.csv", index = False, header=True)


if __name__ == "__main__":
    build_deceases_data_for_bar_race()
