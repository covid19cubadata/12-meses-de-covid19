import csv
import io
import json
import os
from collections import defaultdict

import requests  # noqa We are just importing this to prove the dependency installed correctly


def get_countries_incidence():
    if not os.path.exists('data/counties-codes.json'):
        data2 = requests.get(
            'https://covid.ourworldindata.org/data/owid-covid-data.csv').content
        # data2 = requests.get('http://localhost:8000/utils/owid-covid-data.csv').content
        data2 = io.StringIO(data2.decode('utf8'))
        reader = csv.reader(data2)
        data = defaultdict(lambda: dict())
        headers = next(reader)
        headers = {j: i for i, j in enumerate(headers)}
        for i in reader:
            iso_code = i[headers['iso_code']]
            population = i[headers['population']]
            if not population and population != 0:
                continue
            name = i[headers['location']]
            if 'population' not in data[name]:
                data[name] = {
                    'population': int(float(population)),
                    'code': iso_code
                }
        data['Burma'] = data['Myanmar']
        data['Cabo Verde'] = data['Cape Verde']
        data['Congo (Kinshasa)'] = data['Congo']
        data['Holy See'] = data['Vatican']
        data['Korea, South'] = data['South Korea']
        data['Micronesia'] = data['Micronesia (country)']
        data['Taiwan*'] = data['Taiwan']
        data['Timor-Leste'] = data['Timor']
        data['US'] = data['United States']
        countries = data

        with open('data/counties-codes.json', 'w') as f:
            json.dump(data, f, indent=1)
    else:
        countries = json.load(open('data/counties-codes.json'))

    data = requests.get(
        'https://pomber.github.io/covid19/timeseries.json').json()
    # data = json.load(open('utils/timeseries.json'))

    incidences = defaultdict(lambda: list())

    for country, confirmeds in data.items():
        if country == "Congo (Brazzaville)" or country == "Diamond Princess" or country == 'MS Zaandam' or country == 'West Bank and Gaza':
            continue
        confirmed = confirmeds[0]['confirmed']
        try:
            population = countries[country]['population']
        except KeyError:
            print(country)
            raise
        code = countries[country]['code']
        for n, i in enumerate(map(lambda x: x['confirmed'], confirmeds)):
            if n % 7 == 0:
                incidence = (i-confirmed)*10**5/population
                confirmed = i
                incidences[code].append(incidence)

    with open('data/incidences.json', 'w') as f:
        json.dump(incidences, f, indent=1)


if __name__ == "__main__":
    get_countries_incidence()
