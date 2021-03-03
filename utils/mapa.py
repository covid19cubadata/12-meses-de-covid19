import csv
import io
import json
import os
from collections import defaultdict
from datetime import datetime

import requests  # noqa We are just importing this to prove the dependency installed correctly


def get_countries_incidence():
    #data2 = requests.get('https://covid.ourworldindata.org/data/owid-covid-data.csv').content
    data2 = requests.get(
        'http://localhost:8000/utils/owid-covid-data.csv').content
    data2 = io.StringIO(data2.decode('utf8'))
    reader = csv.reader(data2)
    data = defaultdict(lambda: defaultdict(list))
    headers = next(reader)
    headers = {j: i for i, j in enumerate(headers)}
    for i in reader:
        iso_code = i[headers['iso_code']]
        if 'OWID' in iso_code:
            continue
        total_cases = i[headers['total_cases']]
        population = i[headers['population']]
        date = i[headers['date']]
        if len(data[iso_code]['population']) == 0:
            try:
                data[iso_code]['population'].append(int(float(population)))
            except Exception:
                print(i)
                raise
        data[iso_code]['date'].append(date)
        if total_cases:
            data[iso_code]['total_cases'].append(int(float(total_cases)))
        elif len(data[iso_code]['total_cases']) > 0:
            data[iso_code]['total_cases'].append(
                data[iso_code]['total_cases'][-1])
        else:
            data[iso_code]['total_cases'].append(0)

    incidences = defaultdict(list)
    for iso_code, country in data.items():
        date = datetime.fromisoformat(country['date'][0])
        cases = country['total_cases'][0]
        for currentCases, currentDate in zip(country['total_cases'][1:], country['date'][1:]):
            currentDate = datetime.fromisoformat(currentDate)
            if (currentDate-date).days >= 7:
                incidence = (currentCases - cases) * \
                    10**5/country['population'][0]
                incidences[iso_code].append(incidence)
                date = currentDate
                cases = currentCases

    with open('data/incidences.json', 'w') as f:
        json.dump(incidences, f, indent=2)


if __name__ == "__main__":
    get_countries_incidence()
