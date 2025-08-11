export interface City {
  id: string;
  name: string;
  slug: string;
  county: string;
  population: number;
  i5Exits: string[];
  coordinates: { lat: number; lng: number };
  regionalHub: boolean;
  theme: string;
}

export const CITIES: City[] = [
  {
    id: 'portland',
    name: 'Portland',
    slug: 'portland',
    county: 'Multnomah',
    population: 641000,
    i5Exits: ['294-308'],
    coordinates: { lat: 45.5152, lng: -122.6784 },
    regionalHub: true,
    theme: 'blue'
  },
  {
    id: 'salem',
    name: 'Salem',
    slug: 'salem',
    county: 'Marion',
    population: 179000,
    i5Exits: ['249-258'],
    coordinates: { lat: 44.9429, lng: -123.0351 },
    regionalHub: true,
    theme: 'green'
  },
  {
    id: 'eugene',
    name: 'Eugene',
    slug: 'eugene',
    county: 'Lane',
    population: 178000,
    i5Exits: ['189-195B'],
    coordinates: { lat: 44.0521, lng: -123.0868 },
    regionalHub: true,
    theme: 'yellow'
  },
  {
    id: 'medford',
    name: 'Medford',
    slug: 'medford',
    county: 'Jackson',
    population: 87000,
    i5Exits: ['27', '30'],
    coordinates: { lat: 42.3265, lng: -122.8756 },
    regionalHub: true,
    theme: 'orange'
  },
  {
    id: 'grants-pass',
    name: 'Grants Pass',
    slug: 'grants-pass',
    county: 'Josephine',
    population: 40000,
    i5Exits: ['55', '58'],
    coordinates: { lat: 42.4390, lng: -123.3307 },
    regionalHub: false,
    theme: 'green'
  },
  {
    id: 'roseburg',
    name: 'Roseburg',
    slug: 'roseburg',
    county: 'Douglas',
    population: 23000,
    i5Exits: ['124', '127'],
    coordinates: { lat: 43.2165, lng: -123.3417 },
    regionalHub: false,
    theme: 'teal'
  }
];

export async function getCityData(slug: string): Promise<City | null> {
  return CITIES.find(city => city.slug === slug) || null;
}

export async function getAllCities(): Promise<City[]> {
  return CITIES;
}